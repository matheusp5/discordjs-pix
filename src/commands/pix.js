import { SlashCommandBuilder } from '@discordjs/builders';

const pixCommand = new SlashCommandBuilder()
  .setName('pix')
  .setDescription('Cria um pagamento PIX')

export default pixCommand.toJSON();
