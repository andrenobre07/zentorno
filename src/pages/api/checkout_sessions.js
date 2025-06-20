import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { car, configuration } = req.body;

    if (!car || !configuration) {
        return res.status(400).json({ error: 'Detalhes do carro ou da configuração em falta.' });
    }
    const amountInCents = Math.round(configuration.totalPrice * 100);
     if (amountInCents < 50) {
        return res.status(400).json({ error: 'O preço total deve ser de pelo menos €0.50.' });
    }

    try {
      const imageUrl = car.imagem.startsWith('/') ? 'https://i.imgur.com/803FTrl.png' : car.imagem;
      const productDescription = [car.tagline, `Motor: ${car.motor || 'N/A'}`].filter(Boolean).join(' | ');

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
              currency: 'eur',
              product_data: {
                name: car.nome,
                description: productDescription,
                images: [imageUrl],
              },
              unit_amount: amountInCents,
            },
            quantity: 1,
        }],
        metadata: {
          car_id: car.id,
          car_name: car.nome,
          color: configuration.color?.name || 'Padrão',
          interior: configuration.interior?.name || 'Padrão',
          packages: configuration.packages?.join(', ') || 'Nenhum',
        },
        mode: 'payment',
        // --- ADICIONE ESTA LINHA ---
        // Força a criação de um cliente, o que ajuda a associar a morada de forma mais fiável.
        customer_creation: 'always', 
        
        shipping_address_collection: {
          allowed_countries: ['PT', 'ES', 'FR', 'DE', 'GB', 'US', 'CA', 'BR', 'AO', 'MZ', 'CH'],
        },
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