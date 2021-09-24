const { spawnSync, spawn } = require('child_process');
const path = require('path');

const gitPull = (folderPath, branch) => {
    const args = [
        "pull",
        "origin",
        branch,
        "--progress"
    ];
    const pull = spawnSync("git", args, { cwd: folderPath });
    if (pull.error) {
        console.error(pull.error)
    }
    console.log("git pull:", `${pull.stdout}`);
};

//options: stop, start, purge, restart, build
const npmFunct = (folderPath, options) => {
    let opcionsStart = { cwd: folderPath }
    if (options === "start") {
        opcionsStart = {
            cwd: folderPath,
            detached: true,
            stdio: ['pipe', process.stdout, process.stderr]
        }
    }

    const args = [
        "run",
        options,
        "--progress"
    ];
    const pull = spawnSync("npm", args, opcionsStart);
    if (pull.error) {
        console.error(pull.error)
    }
    console.log(`npm ${options}`, `${pull.stdout}`);
}

const npmInstall = (folderPath) => {
    const args = [
        "install",
        "--progress"
    ];
    const pull = spawnSync("npm", args, { cwd: folderPath });
    if (pull.error) {
        console.error(pull.error)
    }
    console.log(`npm install`, `${pull.stdout}`);
}

const deployment = (folderProyect, branch) => {

    const pathDirectoryProd = path.join(__dirname, "..", "..", "..", "..", folderProyect, branch);

    console.log(`pathDirectoryProd`, pathDirectoryProd);
    let rama = "main";
    if (branch === "test") {
        rama = "dev"
    }
    try {
        gitPull(pathDirectoryProd, rama);
        npmInstall(pathDirectoryProd);
        npmFunct(pathDirectoryProd, "stop");
        npmFunct(pathDirectoryProd, "purge");
        npmFunct(pathDirectoryProd, "build");
        npmFunct(pathDirectoryProd, "start");
        pm2Save();

        return "Todo Ok"
    } catch (error) {
        return error
    }
};

module.exports = deployment