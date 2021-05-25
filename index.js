const { Client, Collection } = require('discord.js');
const { join } = require('path');
const { readdirSync } = require('fs');
const config = require('./config.json');
const data = require('./resources/data.json');


// modify
const relativePath = './resources/cnt.json';
const jsonProcessor = require('./include/jsonProcessor');

const client = new Client({
    disableMentions: 'everyone',
    restTimeOffset: 0,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

client.login(config.token);
client.commands = new Collection();
client.prefix = '!'; // modify
const cooldowns = new Collection();

/* Import all commands */
const commandFiles = readdirSync(join(__dirname, 'commands')).filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(join(__dirname, 'commands', `${file}`));
    client.commands.set(command.name, command);
}

/* Client Events */
client.on('ready', () => {
    console.log(`I am Ready ${client.user.tag}`);
});
client.on('warn', (info) => console.log(info));
client.on('error', console.error);

client.on('message', async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return; // what is this?

    // const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);
    // if (!prefixRegex.test(message.content)) return;

    // const [, matchedPrefix] = message.content.match(prefixRegex);

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
        client.commands.get(commandName) ||
        client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 1) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(
                i18n.__mf('common.cooldownMessage', { time: timeLeft.toFixed(1), name: command.name })
            );
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply(i18n.__('common.errorCommend')).catch(console.error);
    }

    /// previous
    if (message.content === '!role' && message.author.id === config.admin_id) { }
    else if (message.content === '!pick' && message.author.id === config.admin_id) { }
    else if (message.content.startsWith('!git ')) { }
    else if (message.content === '!check' && message.author.id === config.admin_id) { }
    else { }
});

// client.on('messageDelete', (message) => {
//     if (message.author === null) return;
//     if (message.author.bot) return;

//     let id = message.author.id;
//     let cntJson = jsonProcessor.getJson(relativePath);

//     if (cntJson[id] === undefined) {
//         console.error('Uncaught Reference Error: ' + id + ' is not defined');
//         return;
//     }
//     else if (cntJson[id] <= 0) {
//         console.error('Invalid value error: ' + id + ' is zero or negative');
//         return;
//     }
//     else cntJson[id]--;
//     fs.writeFileSync(jsonProcessor.getAbsolutePath(relativePath), JSON.stringify(cntJson));
// });

client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return;

    if (reaction.partial) {
        try {
            await reaction.message.fetch();
        } catch (err) {
            console.error(err);
            return;
        }
    }

    if (reaction.message.embeds[0] === undefined) return;
    if (reaction.message.embeds[0].title !== '역할 설정') return;
    let emoji = reaction.emoji.name;
    let emojiIndex = data.imoji.findIndex(e => e === emoji);
    let role = reaction.message.guild.roles.cache.find(r => r.name === data.role[emojiIndex]);
    reaction.message.guild.members.cache.find(m => m.user.id === user.id).roles.add(role);
});

client.on('messageReactionRemove', async (reaction, user) => {
    if (user.bot) return;
    if (reaction.message.embeds[0] === undefined) return;

    if (reaction.message.partial) {
        try {
            await reaction.message.fetch();
        } catch (err) {
            console.error(err);
            return;
        }
    }

    if (reaction.message.embeds[0].title !== '역할 설정') return;
    let emoji = reaction.emoji.name;
    let emojiIndex = data.imoji.findIndex(e => e === emoji);
    let role = reaction.message.guild.roles.cache.find(r => r.name === data.role[emojiIndex]);
    reaction.message.guild.members.cache.find(m => m.user.id === user.id).roles.remove(role);
});