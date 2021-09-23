const { spawnSync } = require('child_process');
const path = require('path');

const gitPull = (folderPath) => {
    const args = [
        "pull",
        "origin",
        "main",
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
    const args = [
        "run",
        options,
        "--progress"
    ];
    const pull = spawnSync("npm", args, { cwd: folderPath });
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

    try {
        gitPull(pathDirectoryProd);
        npmInstall(pathDirectoryProd);
        npmFunct(pathDirectoryProd, "stop");
        npmFunct(pathDirectoryProd, "purge");
        npmFunct(pathDirectoryProd, "build");
        npmFunct(pathDirectoryProd, "start");

        return "Todo Ok"
    } catch (error) {
        return error
    }
};

module.exports = deployment