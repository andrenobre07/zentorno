import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { car } = req.body;

    if (!car || !car.nome || !car.totalPrice) {
      return res.status(400).json({ error: 'Detalhes do carro em falta ou inválidos.' });
    }

    const amountInCents = Math.round(car.totalPrice * 100);
    if (amountInCents < 50) {
        return res.status(400).json({ error: 'O preço total deve ser de pelo menos €0.50.' });
    }

    try {
      const imageUrl = car.imagem.startsWith('/')
        ? 'https://i.imgur.com/803FTrl.png'
        : car.imagem;
      
      // --- NOVA LÓGICA AQUI ---
      // Criar uma string de descrição com os detalhes do carro.
      const productDescription = [
        car.tagline,
        `Motor: ${car.motor || 'N/A'}`,
        `Potência: ${car.potencia || 'N/A'}`,
        `Aceleração: ${car.aceleracao || 'N/A'}`
      ].filter(line => line).join('\n'); // Junta as linhas que existem.

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: car.nome,
                description: productDescription, // <-- USAR A NOVA DESCRIÇÃO
                images: [imageUrl],
              },
              unit_amount: amountInCents,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cancel`,
      });

      res.status(200).json({ id: session.id });
    } catch (err) {
      console.error('Stripe API Error:', err.message);
      res.status(500).json({ error: `Erro do Stripe: ${err.message}` });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}