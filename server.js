require('dotenv').config();  
const express = require('express');  
const cors = require('cors');  
const url = require('url');  
const { patreon, oauth } = require('patreon');  
  
const app = express();  
app.use(cors());  
app.use(express.static('public'));  
  
const CLIENT_ID = process.env.PATREON_CLIENT_ID;  
const CLIENT_SECRET = process.env.PATREON_CLIENT_SECRET;  
const REDIRECT_URI = process.env.PATREON_REDIRECT_URI;  
  
// Instantiate the Patreon OAuth client  
const patreonOAuthClient = oauth(CLIENT_ID, CLIENT_SECRET);  
  
/**  
 * 1. Direct user to /auth route -> We redirect them to Patreon’s OAuth.  
 */  
app.get('/auth', (req, res) => {  
  const oauthUrl = `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;  
  res.redirect(oauthUrl);  
});  
  
/**  
 * 2. Patreon redirects back here with a ?code=<...>.  
 */  
app.get('/oauth/redirect', async (req, res) => {  
  try {  
    const oauthGrantCode = url.parse(req.url, true).query.code;  
  
    // Exchange code for tokens  
    const tokensResponse = await patreonOAuthClient.getTokens(oauthGrantCode, REDIRECT_URI);  
    const accessToken = tokensResponse.access_token;  
  
    // For demonstration, we simply show the token in the browser.  
    // In production, you'd likely store it server-side or pass it to front-end safely.  
    res.send(`  
      <html>  
        <head><title>Patreon OAuth Success</title></head>  
        <body>  
          <h2>Success! Your Patreon Access Token is:</h2>  
          <p style="word-wrap:break-word;">${accessToken}</p>  
          <p>Store this token securely. <a href="/">Go back to homepage</a></p>  
        </body>  
      </html>  
    `);  
  } catch (err) {  
    console.error('Error getting tokens:', err);  
    res.status(500).send('Failed to exchange tokens. Check console or .env configs.');  
  }  
});  
  
app.listen(3000, () => {  
  console.log('Server running at http://localhost:3000 ...');  
});  