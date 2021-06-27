module.exports = {
    apps: [{
        name: 'uptime-manager-backend',
        script: './index.js',
        env: {
            "NODE_ENV": "production"
        },
        cwd: "./dist"
    }]
}