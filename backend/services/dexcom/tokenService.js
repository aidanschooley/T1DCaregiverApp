import pool from '../../config/database.js';
import config from '../../config/dexcomClient.js';

async function tokenService() {
  const { rows } = await pool.query(
    'SELECT access_token, refresh_token, token_expires_at FROM patient WHERE id = 1'
  );

  const patient = rows[0];
  const isExpired = new Date() >= new Date(patient.token_expires_at);

  if (!isExpired) {
    return patient.access_token;
  }

  const response = await fetch(config.tokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: patient.refresh_token,
      grant_type: 'refresh_token',
      redirect_uri: config.redirectUri
    }).toString()
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Token refresh failed: ${err}`);
  }

  const data = await response.json();

  await pool.query(
    'UPDATE patient SET access_token = $1, refresh_token = $2, token_expires_at = $3 WHERE id = 1',
    [
      data.access_token,
      data.refresh_token,
      new Date(Date.now() + data.expires_in * 1000).toISOString()
    ]
  );

  console.log('Token refreshed successfully');
  return data.access_token;
}

export default tokenService;