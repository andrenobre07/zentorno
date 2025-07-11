import Stripe from 'stripe';
import admin from '../../lib/firebaseAdminConfig';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (car, configuration) => {
    let total = car.preco;
    if (configuration.color && typeof configuration.color.price === 'number') {
        total += configuration.color.price;
    }
    if (configuration.interior && typeof configuration.interior.price === 'number') {
        total += configuration.interior.price;
    }
    if (configuration.packages && Array.isArray(configuration.packages)) {
        configuration.packages.forEach(pkgName => {
            const packageData = car.packages.find(p => p.name === pkgName);
            if (packageData && typeof packageData.price === 'number') {
                total += packageData.price;
            }
        });
    }
    return Math.round(total * 100);
};


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { car, configuration, token } = req.body;

    if (!token) {
      return res.status(401).json({ error: 'Acesso negado. O utilizador não está autenticado.' });
    }
    if (!car || !configuration) {
        return res.status(400).json({ error: 'Detalhes do carro ou da configuração em falta.' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;
    const userEmail = decodedToken.email;

    const amountInCents = calculateOrderAmount(car, configuration);

    if (amountInCents < 50) {
        return res.status(400).json({ error: 'O preço total deve ser de pelo menos €0.50.' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'eur',
        payment_method_types: ['card'],
        metadata: {
            userId: uid,
            userEmail: userEmail,
            carId: car.id,
            carName: car.nome,
            color: configuration.color.name,
            interior: configuration.interior.name,
            packages: configuration.packages.join(', ') || 'Nenhum',
        },
        // ########## A CORREÇÃO ESTÁ AQUI ##########
        // O bloco 'shipping' foi REMOVIDO para evitar conflitos.
        // O frontend agora é o único responsável pela morada.
        // ###########################################
    });

    res.status(200).json({
        clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: `Erro do servidor: ${error.message}` });
  }
}