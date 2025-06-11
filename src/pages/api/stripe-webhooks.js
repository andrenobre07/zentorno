import { buffer } from 'micro';
import Stripe from 'stripe';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Desativa o body parser do Next.js para podermos obter o corpo raw do pedido
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

    // Lidar com o evento específico
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('✅ Sessão de checkout concluída!', session.id);
        
        const customerEmail = session.customer_details.email;
        const totalAmount = (session.amount_total / 100).toFixed(2);
        
        try {
          // Enviar o email com o Resend
          await resend.emails.send({
            from: 'Zentorno <onboarding@resend.dev>', // MUDE PARA O SEU DOMÍNIO VERIFICADO NO RESEND
            to: customerEmail,
            subject: `O seu recibo da Zentorno - Encomenda #${session.id.slice(-6)}`,
            html: `
              <h1>Obrigado pela sua compra!</h1>
              <p>Olá,</p>
              <p>Confirmamos o seu pagamento de <strong>€${totalAmount}</strong>.</p>
              <p>Este é um recibo para a sua referência.</p>
              <p>Com os melhores cumprimentos,<br>Equipa Zentorno</p>
            `,
          });
          console.log(`✉️ Email de recibo enviado para ${customerEmail}`);
        } catch (error) {
          console.error('❌ Erro ao enviar email com o Resend:', error);
        }
        break;
      // ... pode adicionar outros eventos aqui (ex: 'payment_intent.succeeded')
      default:
        console.warn(`🤷‍ Evento não tratado: ${event.type}`);
    }

    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default handler;