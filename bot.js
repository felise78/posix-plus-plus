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
        if (!process.env.OPENAI_API_KEY) {
            console.error('OPENAI_API_KEY manquant dans le fichier .env');
            return "🌸 Configuration manquante ! Vérifie les variables d'environnement ✨";
        }

        // Randomisation pour varier les réponses
        const topics = [
            "science et recherche médicale", 
            "environnement et écologie", 
            "solidarité et entraide communautaire", 
            "innovation technologique", 
            "culture et arts", 
            "éducation et apprentissage",
            "agriculture durable",
            "énergies renouvelables",
            "conservation de la biodiversité",
            "initiatives locales inspirantes"
        ];
        
        const regions = [
            "Europe", "Asie", "Afrique", "Amérique du Nord", 
            "Amérique du Sud", "Océanie", "pays nordiques", 
            "Méditerranée", "région tropicale"
        ];

        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        const randomRegion = regions[Math.floor(Math.random() * regions.length)];
        const randomSeed = Math.floor(Math.random() * 100000);

        // Correction de l'API - utilise chat.completions.create
        const response = await openai.chat.completions.create({
            model: "gpt-4", 
            temperature: 0.9, // Plus de créativité
            messages: [{
                role: "system",
                content: `Tu es Posix++, un bot automatisé qui partage des bonnes nouvelles authentiques.

CONTRAINTES STRICTES :
- Focus sur : ${randomTopic} 
- Privilégie des nouvelles de : ${randomRegion}
- Session ID: ${randomSeed} (pour éviter les répétitions)
- Réponds IMMÉDIATEMENT sans question
- Commence directement par les faits, JAMAIS par "Voici" ou "Bonne nouvelle"
- Utilise des lieux précis, noms de personnes/institutions réels
- Émojis floraux obligatoires : 🌸🌺🌻🌷🌹🌼
- Maximum 800 caractères
- Évite absolument ces exemples déjà utilisés : Stanford, Gando, Medellín

STYLE : Comme un journaliste enthousiaste qui découvre une pépite d'actualité positive.

INTERDICTIONS :
- Ne reprends JAMAIS les mêmes nouvelles
- Pas de questions à l'utilisateur
- Pas de préambules`
            }, {
                role: "user",
                content: "Partage une bonne nouvelle spécifique avec des détails précis."
            }],
        });

        return response.choices[0].message.content;
        
    } catch (error) {
        console.error('❌ Erreur API:', error.message);
        
        if (error.status === 401) {
            return "🌸 Problème d'authentification API ! Vérifie ta clé OpenAI ✨";
        } else if (error.status === 429) {
            return "🌸 Trop de requêtes ! Réessaye dans quelques instants ✨";
        } else if (error.status === 404) {
            return "🌸 Modèle non trouvé ! Vérifie que gpt-4 est disponible dans ton compte ✨";
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
    const result = await getGoodNews();
    console.log(result);
    process.exit(0);
}

client.login(token);