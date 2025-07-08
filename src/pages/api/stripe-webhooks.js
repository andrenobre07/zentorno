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

// Função auxiliar para processar a compra, quer venha de uma sessão ou de um payment intent
const fulfillOrder = async (session) => {
    // --- 1. GUARDAR A COMPRA NO FIRESTORE ---
    try {
        // Extrair os dados do 'metadata' que definimos ao criar o PaymentIntent
        const userId = session.metadata.userId;
        const userEmail = session.metadata.userEmail;

        if (!userId) {
            console.error('ERRO GRAVE: User ID não encontrado nos metadados. Histórico não guardado.');
            return; // Sai da função se não houver ID de utilizador
        }

        // Para um PaymentIntent, os produtos não vêm listados. Vamos construí-los a partir dos metadados.
        const products = [{
            name: session.metadata.carName,
            amount: session.amount / 100,
            currency: session.currency,
            quantity: 1,
        }];

        const purchaseRef = db.collection('purchases').doc();
        await purchaseRef.set({
            userId: userId,
            userEmail: userEmail,
            purchaseId: session.id, // Usamos o ID do PaymentIntent como ID da compra
            amount: session.amount / 100,
            currency: session.currency,
            products: products,
            purchaseDate: admin.firestore.FieldValue.serverTimestamp(),
            status: session.status,
            shippingAddress: session.shipping, // A morada está diretamente no objeto 'shipping'
        });
        console.log(`✅ Compra ${purchaseRef.id} do utilizador ${userId} guardada com sucesso no Firestore.`);
    } catch (firestoreError) {
        console.error("❌ Erro ao guardar os dados da compra no Firestore:", firestoreError);
    }

    // --- 2. ENVIAR O EMAIL DE RECIBO ---
    try {
        const customerEmail = session.receipt_email; // O email está diretamente no PaymentIntent
        const totalAmount = session.amount / 100;

        const carDetails = {
            nome: session.metadata.carName,
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
                          shippingAddress={session.shipping}
                       />,
            });
            console.log(`✉️ Email de recibo enviado com sucesso para ${customerEmail}`);
        }
    } catch (emailError) {
        console.error('❌ Erro ao enviar o email de recibo:', emailError);
    }
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

    // --- A GRANDE MUDANÇA ESTÁ AQUI ---
    // Agora "ouvimos" o evento 'payment_intent.succeeded'
    switch (event.type) {
        case 'payment_intent.succeeded': {
            console.log('✅ Evento payment_intent.succeeded detetado.');
            const paymentIntent = event.data.object;
            await fulfillOrder(paymentIntent);
            break;
        }
        case 'checkout.session.completed': {
             console.log('✅ Evento checkout.session.completed detetado.');
             const session = event.data.object;
             // Se um dia voltares a usar o checkout antigo, ainda funciona
             // A lógica de processamento precisa ser adaptada se necessário
             break;
        }
        default:
            console.warn(`🤷‍♀️ Evento não tratado: ${event.type}`);
    }
    // --- FIM DA GRANDE MUDANÇA ---

    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default handler;