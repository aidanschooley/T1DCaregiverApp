require('dotenv').config();

const BASE_URL = 'https://sandbox-api.dexcom.com';

module.exports = {
  BASE_URL,
  authorizationEndpoint: `${BASE_URL}/v3/oauth2/login`,
  tokenEndpoint: `${BASE_URL}/v3/oauth2/token`,
  clientId: process.env.DEXCOM_CLIENT_ID,
  clientSecret: process.env.DEXCOM_CLIENT_SECRET,
  redirectUri: process.env.DEXCOM_REDIRECT_URI,
};

