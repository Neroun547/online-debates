module.exports = {
	apps: [
		{
			name: "Client",
			script: "./.output/server/index.mjs",
			exec_mode: "fork",
			instances: 1,
			env: {
				NODE_ENV: "production",
				PORT: 3000,
				HOST: "0.0.0.0"
			}
		}
	]
}
