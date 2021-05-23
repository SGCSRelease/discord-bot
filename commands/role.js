const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'help',
    description: '',
    execute(message) {
        const embed = new MessageEmbed();
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
}