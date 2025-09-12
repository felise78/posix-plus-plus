# Utilise Node.js 20 Alpine (plus récent, fetch natif)
FROM node:20-alpine

# Crée le répertoire de l'app
WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./

# Installe les dépendances + node-fetch pour compatibilité
RUN npm ci --only=production && npm install node-fetch

# Copie le code source
COPY . .

# Expose le port (si nécessaire pour des webhooks)
EXPOSE 3000

# Commande pour démarrer le bot
CMD ["node", "."]