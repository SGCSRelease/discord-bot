const config = require('./config/config.json');
const data = require('./resources/data.json');
const relativePath = './resources/cnt.json';

const fs = require('fs');
const discord = require('discord.js');
const client = new discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const jsonProcessor = require('./jsonProcessor');
const randomGenerator = require('./randomGenerator');
const git = require('./git');

client.on('ready', () => {
    console.log(`I am Ready ${client.user.tag}`);
});

client.on('message', async (message) => {
    // SetRole
    if (message.content === '!role' && message.author.id === config.admin_id) {
        const embed = new discord.MessageEmbed();
        embed.setTitle('역할 설정');
        embed.setColor(0xff0000);
        let description = "Emoji를 눌러 해당 역할을 획득할 수 있습니다.\n\n";
        for (let i = 0; i < data.role_size; i++) {
            description += data.imoji[i];
            description += data.role[i];
            description += '\n';
        }
        embed.setDescription(description);

        message.channel.send(embed).then(embedMessage => {
            Promise.all([
                embedMessage.react('1️⃣'),
                embedMessage.react('2️⃣'),
                embedMessage.react('3️⃣'),
                embedMessage.react('4️⃣'),
                embedMessage.react('5️⃣'),
                embedMessage.react('6️⃣'),
                embedMessage.react('7️⃣')
                // message.react('8️⃣'),
                // message.react('9️⃣'),
                // message.react('🔟')
            ])
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    }
    // Pick
    else if (message.content === '!pick' && message.author.id === config.admin_id) {
        let cntJson = jsonProcessor.getJson(relativePath);
        let conditioningUsers = new Array();
        let sendMessage = '';

        Object.keys(cntJson).forEach((key) => {
            if (cntJson[key] >= 3) {
                conditioningUsers.push(key);
            }
        });

        for (let i = 0; i < 3; i++) {
            let randomIndex = randomGenerator.getRandomInt(0, conditioningUsers.length);
            sendMessage += conditioningUsers[randomIndex] + '\n';
            conditioningUsers.splice(randomIndex, 1);
        }

        message.channel.send(sendMessage);
    }
    else if (message.content.startsWith('!git ')) {
        let contributionDay = await git.parseContributionDayinLastMonth(message.content.substring(5, message.content.length));
        message.channel.send(contributionDay);
    }
    // CountMessage
    // else {
    //     let id = message.author.id;
    //     let cntJson = jsonProcessor.getJson(relativePath);

    //     if (cntJson[id] === undefined) cntJson[id] = 1;
    //     else cntJson[id]++;
    //     fs.writeFileSync(jsonProcessor.getAbsolutePath(relativePath), JSON.stringify(cntJson));
    // }
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

client.login(config.token);