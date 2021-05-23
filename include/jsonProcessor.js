const fs = require('fs');
const path = require('path');

let getAbsolutePath = (jsonRelativePath) => {
    return path.resolve(__dirname, jsonRelativePath);
};

let getJson = (jsonRelativePath) => {
    let jsonPath = path.resolve(__dirname, jsonRelativePath);
    let dataBuffer = fs.readFileSync(jsonPath);
    let dataJson = dataBuffer.toString();
    let json = JSON.parse(dataJson);

    return json;
};

module.exports = {
    getAbsolutePath,
    getJson
};