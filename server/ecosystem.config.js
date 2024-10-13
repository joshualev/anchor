module.exports = {
	apps: [
		{
			name: "anchor",
			script: "npm",
			args: "run dev",
			env: {
				NODE_ENV: "development"
			}
		}
	]
};
