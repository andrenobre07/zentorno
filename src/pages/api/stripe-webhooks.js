import { buffer } from 'micro';
import Stripe from 'stripe';
import { Resend } from 'resend';
import ReceiptEmail from '../../emails/ReceiptEmail';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      console.error(`❌ Erro na verificação da assinatura do webhook: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      try {
        // --- A ALTERAÇÃO FINAL ESTÁ AQUI ---
        // Vamos buscar o ID do cliente na sessão
        const customerId = session.customer;
        if (!customerId) {
          throw new Error('ID do cliente não encontrado na sessão.');
        }

        // Usamos o ID para ir buscar o objeto completo do cliente
        const customer = await stripe.customers.retrieve(customerId);
        
        // A morada de entrega está guardada no objeto do cliente
        const shippingAddress = customer.shipping;
        
        const customerEmail = customer.email || session.customer_details?.email;
        const totalAmount = session.amount_total / 100;
        
        const carDetails = {
          nome: session.metadata.car_name,
          color: session.metadata.color,
          interior: session.metadata.interior,
          packages: session.metadata.packages,
        };

        if (!customerEmail) {
            console.error("❌ Email do cliente não encontrado.");
            return res.status(400).json({ error: 'Email do cliente em falta.' });
        }

        await resend.emails.send({
          from: 'Zentorno <onboarding@resend.dev>',
          to: customerEmail,
          subject: `O seu recibo da Zentorno para o ${carDetails.nome}`,
          react: <ReceiptEmail 
                    customerEmail={customerEmail} 
                    totalAmount={totalAmount}
                    car={carDetails}
                    shippingAddress={shippingAddress}
                 />,
        });
        console.log(`✉️ Email de recibo detalhado enviado para ${customerEmail}`);

      } catch (error) {
        console.error('❌ Erro ao processar o webhook ou ao enviar o email:', error);
        return res.status(500).json({ error: 'Erro ao processar o pedido.' });
      }
    } else {
      console.warn(`🤷‍♀️ Evento não tratado: ${event.type}`);
    }

    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default handler;