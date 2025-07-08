import { buffer } from 'micro';
import Stripe from 'stripe';
import { Resend } from 'resend';
import ReceiptEmail from '../../emails/ReceiptEmail';
import admin from '../../lib/firebaseAdminConfig';
import { getFirestore } from 'firebase-admin/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

const db = getFirestore();

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
        const userId = session.client_reference_id;
        const userEmail = session.customer_details?.email;

        if (!userId) {
          console.error('ERRO GRAVE: O client_reference_id (User ID) não foi encontrado na sessão do Stripe. O histórico não será guardado.');
        } else {
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
          const products = lineItems.data.map(item => ({
            name: item.description,
            amount: item.amount_total / 100,
            currency: item.currency,
            quantity: item.quantity,
          }));

          const purchaseRef = db.collection('purchases').doc();
          await purchaseRef.set({
            userId: userId,
            userEmail: userEmail || 'Email não fornecido',
            purchaseId: session.id,
            amount: session.amount_total / 100,
            currency: session.currency,
            products: products,
            purchaseDate: admin.firestore.FieldValue.serverTimestamp(),
            status: session.payment_status,
            // ########## A ÚNICA ALTERAÇÃO ESTÁ AQUI ##########
            // Se session.shipping_details for indefinido, usamos 'null'
            shippingAddress: session.shipping_details || null,
            // ##################################################
          });
          console.log(`✅ Compra ${purchaseRef.id} do utilizador ${userId} guardada com sucesso no Firestore.`);
        }
      } catch (firestoreError) {
        console.error("❌ Erro ao guardar os dados da compra no Firestore:", firestoreError);
      }
      
      try {
        const customerId = session.customer;
        if (!customerId) throw new Error('ID do cliente não encontrado na sessão.');

        const customer = await stripe.customers.retrieve(customerId);
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
            console.error("❌ Email do cliente não encontrado para envio de recibo.");
        } else {
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
        }
      } catch (emailError) {
        console.error('❌ Erro ao enviar o email de recibo:', emailError);
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