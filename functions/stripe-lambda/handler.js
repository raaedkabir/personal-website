const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
};

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
      headers,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
      }),
    };
  } catch (err) {
    console.log(err);

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        status: err,
      }),
    };
  }
};
