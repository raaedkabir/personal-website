const AWS = require('aws-sdk');
const SES = new AWS.SES();

function sendEmail(formData, callback) {
  const emailParams = {
    Source: 'raaed.kabir@gmail.com', // send from
    ReplyToAddresses: [formData.email],
    Destination: {
      ToAddresses: ['raaed.kabir@gmail.com'], // send to
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
          `,
        },
        Html: {
          Charset: 'UTF-8',
          Data: `
        <!DOCTYPE html>
          <html lang="en">
            <head>
              <title>Thank You for Getting in Touch!</title>

              <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />

              <style type="text/css">
                /* CLIENT-SPECIFIC STYLES */

                body,
                table,
                td,
                a {
                  -webkit-text-size-adjust: 100%;
                  -ms-text-size-adjust: 100%;
                }
                table,
                td {
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
                }
                img {
                  -ms-interpolation-mode: bicubic;
                }

                /* RESET STYLES */
                img {
                  border: 0;
                  height: auto;
                  line-height: 100%;
                  outline: none;
                  text-decoration: none;
                }
                table {
                  border-collapse: collapse !important;
                }
                body {
                  height: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  width: 100% !important;
                }

                /* iOS BLUE LINKS */
                a[x-apple-data-detectors] {
                  color: inherit !important;
                  text-decoration: none !important;
                  font-size: inherit !important;
                  font-family: inherit !important;
                  font-weight: inherit !important;
                  line-height: inherit !important;
                }

                /* GMAIL BLUE LINKS */
                u + #body a {
                  color: inherit;
                  text-decoration: none;
                  font-size: inherit;
                  font-family: inherit;
                  font-weight: inherit;
                  line-height: inherit;
                }

                /* SAMSUNG MAIL BLUE LINKS */
                #MessageViewBody a {
                  color: inherit;
                  text-decoration: none;
                  font-size: inherit;
                  font-family: inherit;
                  font-weight: inherit;
                  line-height: inherit;
                }

                /* Universal Styles for Links */
                a {
                  color: #00afe0;
                  font-weight: bold;
                }

                a:hover {
                  color: #ff8400;
                  text-decoration: none;
                }

                /* Responsive Styles */
                @media screen and (max-width: 650px) {
                  .mobile {
                    width: 100% !important;
                    background-color: #fff !important;
                    border-radius: 0 !important;
                    color: #1e1e20 !important;
                  }

                  .mobile-bg {
                    background-color: #fff !important;
                  }

                  .block {
                    display: block !important;
                    width: 100% !important;
                  }

                  h1 {
                    font-size: 24px !important;
                  }
                }
              </style>
            </head>

            <body id="body" style="margin: 0 !important; padding: 0 !important">
              <table
                class="mobile-bg"
                border="0"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                width="100%"
                style="background-color: #00afe0"
              >
                <tr>
                  <td align="center">
                    <table class="mobile" border="0" cellpadding="0" cellspacing="0" role="presentation" width="600">
                      <!-- Logo image -->
                      <tr>
                        <td align="center" style="padding: 20px 0 20px 0">
                          <img
                            src="https://raaedkabir-assets.s3.amazonaws.com/logo+v2.png"
                            alt=""
                            width="60"
                            border="0"
                            style="display: block; margin: 0 auto"
                          />
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <table
                      class="mobile"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      width="600"
                      style="
                        background-color: #fff;
                        border-radius: 10px;
                        color: #1e1e20;
                        font-family: sans-serif;
                        font-size: 18px;
                        line-height: 36px;
                        margin-bottom: 20px;
                        padding: 0;
                      "
                    >
                      <!-- Headline -->
                      <tr>
                        <td style="padding: 20px">
                          <h1 style="margin: 0; font-size: 32px; text-align: center">${formData.subject}</h1>
                        </td>
                      </tr>

                      <!-- Body copy -->
                      <tr>
                        <td style="padding: 20px 20px 0 20px">
                          <p style="margin: 0 0 20px 0">First Name: ${formData.firstName}</p>
                          <p style="margin: 0 0 20px 0">Last Name: ${formData.lastName}</p>
                          <p style="margin: 0 0 0 0">Message:</p>
                          <p style="margin: 0 0 20px 0">${formData.message}</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                            <tr>
                              <td>
                                <!-- Left column -->
                                <table
                                  class="block"
                                  align="left"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  role="presentation"
                                  width="48%"
                                >
                                  <tr>
                                    <td>
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                        <tr>
                                          <td style="width: 100px">
                                            <img
                                              src="https://raaedkabir-assets.s3.amazonaws.com/codepen-icon-orange.png"
                                              alt=""
                                              width="60"
                                              border="0"
                                              style="display: block; margin: 0 0 0 20px"
                                            />
                                          </td>
                                          <td style="padding: 0px; line-height: 24px">
                                            <p style="font-size: 16px; margin: 0">
                                              <a href="https://codepen.io/toddlowell">Visit my CodePen</a>
                                            </p>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                                <!-- Right column -->
                                <table
                                  class="block"
                                  align="right"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  role="presentation"
                                  width="48%"
                                  style="padding-top: 20px"
                                >
                                  <tr>
                                    <td>
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                        <tr>
                                          <td style="width: 100px">
                                            <img
                                              src="https://raaedkabir-assets.s3.amazonaws.com/github-icon-orange.png"
                                              alt=""
                                              width="60"
                                              border="0"
                                              style="display: block; margin: 0 0 0 20px"
                                            />
                                          </td>
                                          <td style="padding: 0px; line-height: 24px">
                                            <p style="font-size: 16px; margin: 0">
                                              <a href="https://github.com/ToddLowell">Visit my GitHub</a>
                                            </p>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 20px 20px 0 20px">
                          <div style="border-bottom: 1px solid #888"></div>
                        </td>
                      </tr>

                      <!-- Footer information: Always include an unsubscribe link! -->
                      <tr>
                        <td style="color: #888; font-size: 16px; text-align: center; padding: 10px">
                          <p style="margin: 0"><a href="mailto:raaed.kabir@gmail.com">raaed.kabir@gmail.com</a></p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <table
                      class="mobile"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      width="550"
                      style="color: #f5f5f5; font-family: sans-serif; font-size: 14px; margin-bottom: 20px; padding: 0"
                    >
                      <tr>
                        <td align="center" style="padding: 0 20px">
                          <p class="mobile" style="margin: 0 0 20px 0">
                            You're receiving this email because you have an awesome idea to bring to life or just looking for a
                            chat. If you didn't intend to receive this then please ignore this email.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>        
        `,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `Message Received from Portfolio Site | ${formData.subject}`,
      },
    },
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
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: err ? err.message : data,
      }),
    };

    callback(null, response);
  });
};
