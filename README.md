# TwoGether 💕
> A private, end-to-end encrypted video call app — designed for couples.

---

## How it works

| Layer         | Technology          | Privacy                              |
|---------------|---------------------|--------------------------------------|
| Media streams | WebRTC (P2P)        | ✅ DTLS-SRTP encrypted, never touches server |
| Signaling     | Socket.io over TLS  | Only SDP metadata, no media data     |
| Data stored   | Nothing             | Server stores no user data at all    |

---

## Free Hosting – Step by Step

### Step 1 — Deploy the Signaling Server to Render.com (free)

1. Go to **https://github.com** and create a free account if you don't have one.
2. Create a **new repository**, name it `twogether-server`, set it to **Public**.
3. Upload these two files into that repo:
   - `server.js`
   - `package.json`
4. Go to **https://render.com** and sign up for free (use your GitHub).
5. Click **"New +"** → **"Web Service"**
6. Connect your GitHub repo `twogether-server`.
7. Set these settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free
8. Click **"Create Web Service"**.
9. Wait ~2 minutes. Render gives you a URL like:
   `https://twogether-server.onrender.com`
10. **Copy this URL**.

> ⚠️ Free Render servers "sleep" after 15 minutes of inactivity.
> The first connection may take ~30 seconds to wake up. That's normal.

---

### Step 2 — Update app.js with your server URL

Open `app.js` and find this line (around line 12):

```js
return "https://twogether-server.onrender.com";
```

Replace `twogether-server` with the actual name Render gave your service.

---

### Step 3 — Deploy the Frontend to Netlify (free)

1. Go to **https://netlify.com** and sign up free.
2. From your dashboard, click **"Add new site"** → **"Deploy manually"**.
3. Drag the entire **frontend folder** (containing `index.html`, `style.css`, `app.js`) into the drop zone.
4. Done! Netlify gives you a URL like: `https://twogether-abc123.netlify.app`
5. Share this URL with your partner 💕

> **Custom domain?** Netlify lets you connect a free `.netlify.app` subdomain or your own domain.

---

### Step 4 — Using the App

1. **Person A** opens the Netlify URL and clicks **"Create a Room"**.
2. A shareable link + room code appears. Copy the link.
3. **Person B** opens that link in any browser.
4. Both grant camera + microphone access.
5. The call connects with end-to-end encrypted media 💕.

---

## Features

| Feature           | Details                                           |
|-------------------|---------------------------------------------------|
| 🔒 E2E Encrypted  | WebRTC DTLS-SRTP (media never touches server)     |
| 👥 1-to-1 only    | Room rejects 3rd connections                      |
| 🎙️ Mute/Unmute   | With partner status indicator                     |
| 📷 Camera toggle  | Overlay shown to partner when off                 |
| 🖥️ Screen Share  | Camera PiP stays visible while sharing            |
| 🎮 Truth or Dare  | Synced game, 35 questions + dares                 |
| 📱 Mobile Ready   | Responsive, touch-friendly, safe-area aware       |
| 🌌 Cosmic UI      | Animated stars, nebula glows, draggable PiP       |

---

## Local Development

```bash
# Install dependencies
npm install

# Start server
node server.js
# Server runs at http://localhost:3000

# Open index.html in your browser (use Live Server extension or similar)
```

---

## Files

```
twogether/
├── index.html     ← All UI (landing, call, game screens)
├── style.css      ← Romantic cosmic design system
├── app.js         ← WebRTC + game logic (frontend)
├── server.js      ← Signaling server (backend – deploy to Render)
├── package.json   ← Server dependencies
└── README.md      ← This file
```

---

## Privacy Notes

- The signaling server **never sees** your video, audio, or screen share. It only relays WebRTC connection setup messages (SDP + ICE candidates).
- All media travels **directly peer-to-peer**, encrypted with DTLS-SRTP — the same standard used by Google Meet, Zoom, and WhatsApp calls.
- No accounts, no login, no data stored anywhere.
- TURN relay servers (openrelay.metered.ca) are only used when direct P2P fails due to firewalls. Your media is still DTLS-SRTP encrypted even via TURN.

---

Made with 💕 for two people who deserve their own universe.
