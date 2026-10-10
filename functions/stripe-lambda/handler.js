// STRIPE_API_URL points the client at another Stripe API, such as stripe-mock in the offline tests
function apiConfig(url) {
  if (!url) return {};
  const { hostname, port, protocol } = new URL(url);
  return { host: hostname, port, protocol: protocol.replace(':', '') };
}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, apiConfig(process.env.STRIPE_API_URL));

module.exports.stripe = async (event) => {
  const data = JSON.parse(event.body);

  try {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: data,
      currency: 'cad',
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
      }),
    };
  } catch (err) {
    console.log(err);

    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: err,
      }),
    };
  }
};
