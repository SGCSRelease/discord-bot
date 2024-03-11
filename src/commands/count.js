module.exports = {
    execute(message) {
        let id = message.author.id;
        let cntJson = jsonProcessor.getJson(relativePath);

        if (cntJson[id] === undefined) cntJson[id] = 1;
        else cntJson[id]++;
        fs.writeFileSync(jsonProcessor.getAbsolutePath(relativePath), JSON.stringify(cntJson));
    }
}