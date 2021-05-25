const randomGenerator = require('../include/randomGenerator');

module.exports = {
    execute(message) {
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
}