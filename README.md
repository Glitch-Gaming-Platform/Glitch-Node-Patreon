# Small OAuth Application for Patreon Access Tokens  
  
This repository contains a small example application (frontend + backend) demonstrating how users can log in with Patreon (via OAuth), retrieve an **access token**, and then store that token wherever needed—such as in your Glitch-based Godot, Unity, or Unreal projects.  
  
Below you’ll find:  
1. **Overview** of the OAuth flow.    
2. **Instructions** for setting up the backend (Node/Express).    
3. **Instructions** for integrating the frontend (HTML + Tailwind).    
4. **How to store the resulting token** in your GitHub repos:    
   - [Glitch-Godot-Patreon](https://github.com/Glitch-Gaming-Platform/Glitch-Godot-Patreon/tree/main)    
   - [Glitch-Unity-Patreon](https://github.com/Glitch-Gaming-Platform/Glitch-Unity-Patreon)    
   - [Glitch-Unreal-Patreon](https://github.com/Glitch-Gaming-Platform/Glitch-Unreal-Patreon)  
5. **Glitch Integration** info, including the Glitch website tracking script and an optional “opt-in” banner for user tracking consent.  
  
---  
  
## 1. Overview of the Flow  
  
1. **User clicks “Log in with Patreon.”**    
2. The browser goes to **Patreon**’s OAuth page, where the user authorizes your app.    
3. **Patreon** redirects back to your server with a temporary `code`.    
4. Your **backend** exchanges this `code` for an *access token* (and possibly a refresh token).    
5. The **backend** then returns the access token to your **frontend**, or stores it for future use.    
6. The **frontend** displays success to the user, and optionally writes the token somewhere secure (e.g., your GitHub repos or your plugin configuration).  
  
> **Important:** For production, do **not** embed your **Client Secret** in any distributed build. Use server-side or secure environment storage.  
  
---  
  
## 2. Backend Setup (Node + Express)  
  
Below is a minimal example of a Node/Express server handling the Patreon OAuth exchange. Create a file named `server.js` (or similar) and install required dependencies:  
  
```bash  
npm init -y  
npm install express dotenv cors patreon  
```

patreon-oauth-example  
├── server.js         (Node.js server)  
├── public  
│   ├── index.html    (Frontend page)  
│   ├── style.css     (Tailwind + custom CSS)  
└── .env             (Store your Patreon secrets here)  