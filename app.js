const express = require('express');
require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const Discord = require('discord.js');
const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  ActivityType,
} = require('discord.js');

const client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

let stateStore = {
  currentUser: 'none',
  linesToMemorize: '',
  lineMemorized: false,
  isdirty: true,
  debug: false,
};

let initialState = {
  currentUser: 'none',
  linesToMemorize: '',
  lineMemorized: false,
  isdirty: true,
  debug: false,
};

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  client.user.setActivity('Now Rebooting....', { type: 'WATCHING' });
  client.user.setPresence({
    activities: [{ name: 'Rocky Horror SHow' }],
    status: 'online',
  });
});
client.on('messageCreate', (msg) => {
  if (!stateStore.debug) {
    if (msg.content === 'ping') {
      console.log('ping');
      msg.channel.send('pong');
    }
    if (msg.content.includes('DEBUG')) {
      console.log('Debugging Mode');
      msg.channel.send('Entering Debugging mode...');
      stateStore['debug'] = true;
      msg.channel.send('Debug mode Active');
    }

    if (msg.content.includes('MEMO')) {
      console.log('memorized');
      msg.channel.send('Memorizing...');
      stateStore['linesToMemorize'] = msg.content.slice(5);
      msg.channel.send('Memorized');
      stateStore['lineMemorized'] = true;
    }
    if (msg.content.includes('RECITE')) {
      console.log('reciting...');
      msg.channel.send('reciting...');
      if (stateStore.lineMemorized) {
        msg.channel.send('lines successfully found');
        msg.channel.send(`${stateStore.linesToMemorize}`);
        console.log('Line Recited');
        msg.channel.send('Line Recited');
        stateStore['lineMemorized'] = false;
      } else {
        msg.channel.send('No lines found');
        stateStore['lineMemorized'] = false;
      }
    }
    if (msg.content.includes('CLEAR CACHE')) {
      console.log('clearing cache');
      msg.channel.send('clearing cache...');
      stateStore = initialState;
      msg.channel.send('cache cleared');
    }
  } else {
    console.log(msg.content);
    console.log('logged');
    if (msg.content.includes('DEBUGEND')) {
      console.log('Leaving Debugging Mode ');
      msg.channel.send('Exiting Debugging mode...');
      stateStore['isdirty'] = false;
      msg.channel.send('Debug mode Deactived');
    }
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  console.log('Test');
  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    });
  }
});

client.login(process.env.DISCORD_TOKEN);

const app = express();
const port = process.env.PORT || 3001;

app.get('/', (req, res) => res.type('html').send(html));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render!
    </section>
  </body>
</html>
`;
