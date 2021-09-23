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
    console.log("git pull:", `${pull.stderr}`);
};

//options: stop, start, purge, restart, build
const npmFunct = (folderPath, options) => {
    const args = [
        "run",
        options
    ];
    const pull = spawnSync("npm", args, { cwd: folderPath });
    console.log(`npm ${options}`, `${pull.stderr}`);
}

const npmInstall = (folderPath, options) => {
    const args = [
        "install",
    ];
    const pull = spawnSync("npm", args, { cwd: folderPath });
    console.log(`npm ${options}`, `${pull.stderr}`);
}

const deployment = (folderProyect, branch) => {

    const pathDirectoryProd = path.join(__dirname, "..", folderProyect, branch);

    console.log(`pathDirectoryProd`, pathDirectoryProd);

    gitPull(pathDirectoryProd);
    npmInstall(pathDirectoryProd);
    npmFunct(pathDirectoryProd, "stop");
    npmFunct(pathDirectoryProd, "purge");
    npmFunct(pathDirectoryProd, "build");
    npmFunct(pathDirectoryProd, "start");
    return 'Todo Ok'

};

module.exports = deployment