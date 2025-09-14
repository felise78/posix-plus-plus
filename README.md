## 🌸 Posix++ 
A positive Discord bot that shares good news! A quick personal project to learn discord.js and work with OpenAI's LLM API

## ✨ Features

- Shares good news on command (`!goodnews`)
- OpenAI API integration for AI-generated content

![Posix++ Bot in action](./assets/screenshot.png)


## 🚀 Getting Started

### Prerequisites
- Docker is installed on your system
- Get a Discord Bot Token
- Get an OpenAI API Key

### Setup
1. Clone this repository:
   ```bash
   git clone git@github.com:felise78/posix-plus-plus.git
   cd posix-plus-plus
   ```

2. Configure your environment variables:
    ```bash
   cp .env.example .env
   ```

   Then edit the `.env` file with your actual values:
   ```
   DISCORD_TOKEN=your_discord_token
   OPENAI_API_KEY=your_openai_api_key
   ```

### Running with Docker
1. Build the Docker image:
   ```bash
   docker build -t posix-bot .
   ```

2. Run the container:
   ```bash
   docker run posix-bot
   ```

## 🛠️ Built With

- **Node.js** - JavaScript runtime
- **Discord.js** - Discord API library
- **OpenAI API** - AI content generation
- **Docker** - Containerization