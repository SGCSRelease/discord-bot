const discord = require('discord.js');
const client = new discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const path, { join } = require('path');
const { readdirSync } = require('fs');
const config = require('./config.json');
const data = require('./resources/data.json');

const relativePath = './resources/cnt.json';
const jsonProcessor = require('./include/jsonProcessor');
const randomGenerator = require('./include/randomGenerator');

/* Import all commands */
const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(join(__dirname, "commands", `${file}`));
    client.commands.set(command.name, command);
}

/* Client Events */
client.on('ready', () => {
    console.log(`I am Ready ${client.user.tag}`);
});
client.on("warn", (info) => console.log(info));
client.on("error", console.error);

client.login(config.token);

client.on('message', async (message) => {
    if (message.author.bot) return;
    if (message.content === '!role' && message.author.id === config.admin_id) {}
    else if (message.content === '!pick' && message.author.id === config.admin_id) {}
    else if (message.content.startsWith('!git ')) {}
    else if (message.content === '!check' && message.author.id === config.admin_id) {}
    else {}
});

// client.on('messageDelete', (message) => {
//     if (message.author === null) return;
//     if (message.author.bot) return;

//     let id = message.author.id;
//     let cntJson = jsonProcessor.getJson(relativePath);

//     if (cntJson[id] === undefined) {
//         console.error("Uncaught Reference Error: " + id + " is not defined");
//         return;
//     }
//     else if (cntJson[id] <= 0) {
//         console.error("Invalid value error: " + id + " is zero or negative");
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
    if (reaction.message.embeds[0].title !== "역할 설정") return;
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

    if (reaction.message.embeds[0].title !== "역할 설정") return;
    let emoji = reaction.emoji.name;
    let emojiIndex = data.imoji.findIndex(e => e === emoji);
    let role = reaction.message.guild.roles.cache.find(r => r.name === data.role[emojiIndex]);
    reaction.message.guild.members.cache.find(m => m.user.id === user.id).roles.remove(role);
});