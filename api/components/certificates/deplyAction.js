const { spawnSync, spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const moment = require("moment")

console.log(`object`, moment(new Date("Feb 11 16:23:41 2022 GMT")).format("DD/MM/YYYY"))

const readCert = () => {
    const cert = path.join(__dirname, "..", "..", "..", "..", "..", "..", "Proyectos", "Certificados", "fullchain.pem");

    const certificate = fs.readFileSync(cert, { encoding: "utf8" });

    console.log(certificate)
}


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