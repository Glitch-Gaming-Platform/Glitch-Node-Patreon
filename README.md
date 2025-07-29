# Small OAuth Application for Patreon Access Tokens

This repository contains a small example application (frontend + backend) demonstrating how users can log in with Patreon (via OAuth), retrieve an **access token**, and then store that token wherever needed—such as in your Game with Godot, Unity, or Unreal projects. The goal is be able to accept payment and restrict access with Patreon, and prevent users from playing the game unless they are subscriber. With this approach, you can also have wider distribution because players can download the game anywhere but will face the same restrictions.

Below you’ll find:
1.  **Overview** of the OAuth flow.
2.  **Instructions** for setting up the backend (Node/Express).
3.  **Instructions** for integrating the frontend (HTML + Tailwind).
4.  **How to store the resulting token** in your GitHub repos:
    *   [Glitch-Godot-Patreon](https://github.com/Glitch-Gaming-Platform/Glitch-Godot-Patreon/tree/main)
    *   [Glitch-Unity-Patreon](https://github.com/Glitch-Gaming-Platform/Glitch-Unity-Patreon)
    *   [Glitch-Unreal-Patreon](https://github.com/Glitch-Gaming-Platform/Glitch-Unreal-Patreon)
5.  **Glitch Integration** info, including the Glitch website tracking script and an optional “opt-in” banner for user tracking consent.

---

## 1. Overview of the Flow

1.  **User clicks “Log in with Patreon.”**
2.  The browser goes to **Patreon**’s OAuth page, where the user authorizes your app.
3.  **Patreon** redirects back to your server with a temporary `code`.
4.  Your **backend** exchanges this `code` for an *access token* (and possibly a refresh token).
5.  The **backend** then returns the access token to your **frontend**, or stores it for future use.
6.  The **frontend** displays success to the user, and optionally writes the token somewhere secure (e.g., your GitHub repos or your plugin configuration).

> **Important:** For production, do **not** embed your **Client Secret** in any distributed build. Use server-side or secure environment storage.

---

## 2. Backend Setup (Node + Express)

Below is a minimal example of a Node/Express server handling the Patreon OAuth exchange.

### Project Structure:
```
patreon-oauth-example
├── server.js         (Node.js server)
├── public
│   ├── index.html    (Frontend page)
│   └── style.css     (Empty in this example)
├── .env              (Store your Patreon secrets here)
└── package.json      (Project dependencies)
```

### Installation and Setup:

1.  **Clone or download this repository.**

2.  **Install the dependencies** by running the following command in your terminal:
    ```bash
    npm install
    ```

3.  **Create a Patreon OAuth Application:**
    *   Go to the [Patreon Developers](https://www.patreon.com/portal/registration/register-clients) page.
    *   Click on "Register Client".
    *   Fill out the form:
        *   **App Name:** Give your application a name.
        *   **Redirect URIs:** Enter `http://localhost:3000/oauth/redirect`.
    *   Once created, you will get a `Client ID` and a `Client Secret`.

4.  **Configure your environment variables:**
    *   Rename the `.env.example` file to `.env`.
    *   Open the `.env` file and replace the placeholder values with your Patreon Client ID and Client Secret.

    ```
    PATREON_CLIENT_ID=your_client_id_here
    PATREON_CLIENT_SECRET=your_client_secret_here
    PATREON_REDIRECT_URI=http://localhost:3000/oauth/redirect
    ```

### Running the Application:

*   Start the server with the following command:
    ```bash
    npm start
    ```
*   Open your browser and navigate to `http://localhost:3000`.

---

## 3. Frontend Integration (HTML + Tailwind CSS)

The frontend is a simple HTML page styled with Tailwind CSS. The `public/index.html` file provides a "Log in with Patreon" button that initiates the OAuth flow.

When the user successfully authenticates, they are redirected to a page that displays their access token.

---

## 4. How to Store the Resulting Token

The access token returned is what you will use to make authenticated requests to the Patreon API on behalf of the user. For your game, you would need to securely store this token. How you do this will depend on your game engine and backend infrastructure.

---

## 5. Glitch Integration (Optional)

The provided `public/index.html` includes an optional banner for users to opt-in to analytics tracking with [Glitch](https://www.glitch.fun/). The `enableTracking()` function dynamically adds the Glitch tracking script to the page. Remember to replace the placeholder `data-title-id` and `data-tracking-token` with your actual Glitch project details. The purpose of this tracking implementation for if you do paid campaigns, use can use this as a touch point to fingerprint users and improve the data is sent to conversion apis to that will lower your player acquistion costs.

### What's Missing?

The current application is a minimal example. For a production environment, you should consider the following:

*   **Error Handling:** More robust error handling on both the client and server sides.
*   **Secure Token Storage:** In a real-world application, you would not display the access token to the user. Instead, you would store it securely in a database associated with the user's account and manage it via server-side sessions.
*   **Token Refresh:** Access tokens expire. The Patreon API provides a `refresh_token` that can be used to obtain a new `access_token` without requiring the user to log in again. This logic is not implemented in this simple example.
*   **User Experience:** A more polished user interface for the success and error pages.
*   **Scopes:** The current OAuth URL in `server.js` does not request any specific scopes. You will need to add the `scope` parameter to the authorization URL to request the permissions your application needs (e.g., `identity`, `identity[email]`, `campaigns`, `campaigns.members`). For example:

    ```javascript
    const oauthUrl = `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=identity%20identity[email]`;
    ```
