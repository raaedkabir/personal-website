const AWS = require('aws-sdk');
const SES = new AWS.SES();

function sendEmail(formData, callback) {
  const emailParams = {
    Source: 'raaed.kabir@gmail.com', // send from
    ReplyToAddresses: [formData.email],
    Destination: {
      ToAddresses: ['raaed.kabir@gmail.com'] // send to
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `
          First Name: ${formData.firstName}\n
          Last Name: ${formData.lastName}\n
          Email: ${formData.email}\n
          Message: ${formData.message}
          `
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `Message Received from Portfolio Site | ${formData.subject}`
      }
    }
  };

  SES.sendEmail(emailParams, callback);
}

module.exports.contact = (event, context, callback) => {
  const formData = JSON.parse(event.body);

  sendEmail(formData, (err, data) => {
    const response = {
      statusCode: err ? 500 : 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: err ? err.message : data
      })
    };

    callback(null, response);
  });
};
