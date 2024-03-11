module.exports = {
    execute(message) {
        let contributionDay = await git.parseContributionDayinLastMonth(message.content.substring(5, message.content.length));
        message.channel.send(contributionDay);
    }
}