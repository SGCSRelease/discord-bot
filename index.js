const config = require('./config/config.json');
const data = require('./resources/data.json');

const discord = require('discord.js');
const client = new discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

client.on('ready', () => {
    console.log(`I am Ready ${client.user.tag}`);
});

// 임원단 이외의 사람이 message했을 때에는 반응 X
client.on('message', async message => {{
    if (message.content === '!role') {
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
}});

client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.partial) {
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
    reaction.message.guild.members.cache.find(m => m.user.id === user.id).roles.add(role);
})

client.on('messageReactionRemove', async (reaction, user) => {
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
})

client.login(config.token);