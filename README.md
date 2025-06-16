Aternos Unofficial API An unofficial API client for Aternos that allows you to manage and interact with your Minecraft servers using Puppeteer under the hood.
✨ FeaturesLog in to your Aternos account.
Fetch a list of all your servers. Manage a Server: Start, stop, or restart a server.
Get Server Info: Retrieve the address, port, software, and other details.
Live Console Viewer: View the server console in real-time and automatically send welcome/goodbye messages to players.🚀 InstallationTo use this library in your project, install it via npm:npm install aternos-unofficial-api
⚙️ How to UseHere is a basic example of how to import and use the functions.import * as Aternos from 'aternos-unofficial-api';
```javascript
const Aternos require("aternos-unofficial-api")
const main = async () => {
  try {
    const cookies = await Aternos.loginToAternos("YourUsername", "YourPassword");

    const { servers } = await Aternos.getServerList(cookies);
    if (!servers || servers.length === 0 || !servers[0]?.id) {
      throw new Error("No servers found.");
    }
    
    const serverId = servers[0].id;
    console.log(`Operating on server: ${servers[0].name} (${serverId})`);

    const result = await Aternos.manageServer(cookies, serverId, "start"); // stop, restart, info
    console.log(result);

    if (result.success) {
      await Aternos.viewConsoleLive(cookies, serverId);
    }

  } catch (error) {
    console.error(error);
  }
};

main();
```
🐳 Hosting with DockerTo easily host your bot 24/7 on platforms like Render, Railway, or Fly.io, you can use the provided Dockerfile.
Hosting StepsClone your project that uses this library.
Create an index.js file in your root directory. 
This is where you'll put your bot's code (like the example above).
Place the Dockerfile (provided below) in your root directory.
Deploy on your hosting provider.
Simply point your hosting service to your GitHub repository, and it will automatically use the Dockerfile to build and run your bot.
IMPORTANT: Do not hardcode your Aternos username and password. Use Environment Variables on your hosting provider to keep your credentials secure.
DockerfileHere is the Dockerfile you will need. Copy and save this as Dockerfile (no extension) in your project's root directory.# Step 1: Base Image
FROM node:20-slim

# Step 2: Install Puppeteer Dependencies
# These are required for Chromium to run correctly inside the container
```Dockerfile
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils \
    --no-install-recommends

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "npm", "start" ]
```
📜 LicenseThis project is licensed under the MIT License - see the LICENSE file for details.