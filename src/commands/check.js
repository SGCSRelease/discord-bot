module.exports = {
    execute(message) {
        let sendMessage = '';
        for (let member of config.active_member) {
            sendMessage += await git.parseCommitinLastMonth(member);
        }
        message.channel.send(sendMessage);
    }
}