const { spawnSync, spawn, exec } = require('child_process');
const path = require('path');

const getFolder = () => {
    const documentos = path.join(__dirname, "..", "..", "..", "..", "..", "..");
    console.log(`documentos`, documentos);

    exec("ls -d */", { cwd: documentos }, (err, stdout, sterr) => {
        if (err) {
            console.error(err)
            return false
        }
        let foldArray = []
        let folders = stdout.replace(/[/]/g, "");
        folders = folders.split("\n");
        foldArray = folders
        foldArray.pop()
        console.log(`foldArray`, foldArray)
    })
}

getFolder();

const getFolders = () => {
    const documentos = path.join("/etc/letsencrypt/live/");
    console.log(`documentos`, documentos);

    exec("ls -d */", { cwd: documentos }, (err, stdout, sterr) => {
        if (err) {
            console.error(err)
            return false
        }
        let foldArray = []
        let folders = stdout.replace(/[/]/g, "");
        folders = folders.split("\n");
        foldArray = folders
        foldArray.pop()
        console.log(`foldArray`, foldArray)
        return foldArray
    })
}

module.exports = getFolders