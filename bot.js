// const { Client, Events, GatewayIntentBits } = require('discord.js');
// const OpenAI = require('openai');
// require('dotenv').config();

import { Client, Events, GatewayIntentBits } from 'discord.js';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.DISCORD_TOKEN;

if (!token) {
    console.error('DISCORD_TOKEN manquant dans le fichier .env');
    process.exit(1);
}

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function getGoodNews() {
    try {
        // Vérifier que la clé API est présente
        if (!process.env.OPENAI_API_KEY) {
            console.error('OPENAI_API_KEY manquant dans le fichier .env');
            return "🌸 Configuration manquante ! Vérifie les variables d'environnement ✨";
        }

        // Utiliser la nouvelle API responses avec GPT-5
        const response = await openai.responses.create({
            model: "gpt-5-nano", // ou "gpt-5" selon ce qui est disponible
            input: "Tu es Posix++, un bot positif. Partage une bonne nouvelle du monde reel en etant tres specifique (cite le village ou le scientifique concerne) et avec des emojis floraux. ca peut etre une nouvelle ancienne mais une histoire vraie stp. essaie que ce soit assez recent quand meme. Maximum 1000 caractères. et ne commence pas par 'Voici une bonne nouvelle' ou une autre tournure du genre.",
        });

        // Utiliser la propriété output_text directement comme dans la doc
        return response.output_text;
    } catch (error) {
        console.error('❌ Erreur API:', error.message);
        
        // Messages d'erreur plus spécifiques
        if (error.status === 401) {
            return "🌸 Problème d'authentification API ! Vérifie ta clé OpenAI ✨";
        } else if (error.status === 429) {
            return "🌸 Trop de requêtes ! Réessaye dans quelques instants ✨";
        } else {
            return "🌸 Petite pause technique ! Réessaye bientôt ✨";
        }
    }
}

client.once(Events.ClientReady, () => {
    console.log(`🌸 ${client.user.username} est prêt !`);
});

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    if (message.content === '!goodnews') {
        const goodNews = await getGoodNews();
        await message.reply(`🌸 ${goodNews}`);
    }

    if (message.content === '!help') {
        await message.reply(`🌸 **Posix++**\n\n\`!goodnews\` - Une bonne nouvelle\n\`!help\` - Cette aide\n\n*Bot positif qui répand les bonnes vibes ! 🌻*`);
    }
});

// Mode test sans connexion Discord
if (process.env.NODE_ENV === 'development') {
    console.log('Mode développement - pas de connexion Discord');
    // Test tes fonctions ici
    const result = await getGoodNews();
    console.log(result);
    process.exit(0);
}

client.login(token);