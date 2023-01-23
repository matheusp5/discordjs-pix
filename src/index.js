import { config } from 'dotenv';
import {
  ActionRowBuilder,
  Client,
  GatewayIntentBits,
  InteractionType,
  ModalBuilder,
  Routes,
  SelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
} from 'discord.js';
import { REST } from '@discordjs/rest';
import pix from './commands/pix.js';
import source from "./database/source.js"
import create_payment from './service/pix.js';

config();

const TOKEN = process.env.TUTORIAL_BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

source.sql.sync().then(() => {
  console.log("Banco de dados sincronizado com sucesso!")
})

source.sql.authenticate().then(() => {
  console.log('Coneção estabelecida com sucesso ao banco de dados!');
}).catch((error) => {
  console.error('Erro ocorreu: ', error);
});

const rest = new REST({ version: '10' }).setToken(TOKEN);

client.on('ready', () => {
  console.log(`${client.user.tag} autenticado!`)
});

client.on('interactionCreate', (interaction) => {
  if (interaction.isChatInputCommand()) {

    if (interaction.commandName === 'pix') {
      create_payment(interaction)
    }

  }
})

async function main() {
  const commands = [
    pix
  ];
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });
    client.login(TOKEN);
  } catch (err) {
    console.log(err);
  }
}

export async function sendMessage(user_id, message) {
  let user = await client.users.fetch(user_id)
  user.send(message)
}

main();
