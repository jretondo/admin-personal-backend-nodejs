module.exports = {
  apps: [{
    name: "admin-apps",
    script: "api/index.js",
    env: {
      "PORT": 3000
    },
  }]
}