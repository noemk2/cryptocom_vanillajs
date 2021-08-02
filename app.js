const crypto = require("crypto-js");
const axios = require("axios");

const signRequest = (request, apiKey, apiSecret) => {
  const { id, method, params, nonce } = request;

  const paramsString =
    params == null
      ? ""
      : Object.keys(params)
          .sort()
          .reduce((a, b) => {
            return a + b + params[b];
          }, "");

  const sigPayload = method + id + apiKey + paramsString + nonce;
  request.sig = crypto
    .HmacSHA256(sigPayload, apiSecret)
    .toString(crypto.enc.Hex);
  return request;
};

const apiKey = "User API Key"; /* User API Key */
const apiSecret = "Secret API Key"; /* Secret API Key */
let request = {
  id: 11,
  method: "private/get-account-summary",
  api_key: apiKey,
  params: {},
  nonce: Date.now(),
};

async function main() {
  const requestBody = JSON.stringify(signRequest(request, apiKey, apiSecret));
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const datos = await axios
    .post(
      "https://api.crypto.com/v2/private/get-account-summary",
      requestBody,
      options
    )
    .then(
      (response) => {
        console.log(
          response.data.result.accounts.filter((a) => a.currency === "USDT")
        );
      },
      (error) => {
        console.log(error);
      }
    );
}

main();
