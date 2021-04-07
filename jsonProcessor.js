export function getAbsolutePath(jsonRelativePath) {
    return path.resolve(__dirname, jsonRelativePath);
}

export function getJson(jsonRelativePath) {
    let jsonPath = path.resolve(__dirname, jsonRelativePath);
    let dataBuffer = fs.readFileSync(jsonPath);
    let dataJson = dataBuffer.toString();
    let json = JSON.parse(dataJson);
    return json;
}