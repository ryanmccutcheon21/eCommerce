import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const params = {
                submit_type: 'pay',
                mode: 'payment',
                payment_method_types: ['card'],
                billing_address_collection: 'auto',
                shipping_options: [
                    { shipping_rate: 'shr_1LvPz8ATt5eQgwtXRdqrJVeg' },
                    { shipping_rate: 'shr_1LvQ2UATt5eQgwtXY0pIKvA8' },
                    { shipping_rate: 'shr_1LvQ3SATt5eQgwtXtFGYL9wk' },
                    { shipping_rate: 'shr_1LvQ4aATt5eQgwtXKmTZ757r' },
                ],
                line_items: req.body.map(item => {
                    const img = item.image[0].asset._ref
                    const newImage = img.replace('image-', `https://cdn.sanity.io/images/3s689tud/production/`).replace('-webp', '.webp')
                    return {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: item.name,
                                images: [newImage]
                            },
                            unit_amount: item.price * 100,
                        },
                        adjustable_quantity: {
                            enable: true,
                            minimum: 1,
                        },
                        quantity: item.quantity
                    }
                }),
                success_url: `${req.headers.origin}/?success=true`,
                cancel_url: `${req.headers.origin}/?canceled=true`,
            }
            // Create Checkout Sessions from body params.
            const session = await stripe.checkout.sessions.create(params);
            res.status(200).json(session)
        } catch (err) {
            res.status(err.statusCode || 500).json(err.message);
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}