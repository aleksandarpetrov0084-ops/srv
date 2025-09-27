const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles = []) {
    let files;
    try {
        files = fs.readdirSync(dirPath);
    } catch (err) {
        console.warn(`Cannot access folder: ${dirPath} — ${err.message}`);
        return arrayOfFiles; // skip this folder
    }

    files.forEach(function(file) {
        const fullPath = path.join(dirPath, file);
        let stat;
        try {
            stat = fs.statSync(fullPath);
        } catch (err) {
            console.warn(`Cannot stat file: ${fullPath} — ${err.message}`);
            return;
        }

        if (stat.isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            arrayOfFiles.push(fullPath);
        }
    });

    return arrayOfFiles;
}
exports.getAllFiles = getAllFiles;
