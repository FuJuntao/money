module.exports = {
	extends: ['react-app', 'plugin:prettier/recommended'],
	plugins: ['prettier'],
	rules: {
		'prettier/prettier': 'warn',
		'@typescript-eslint/no-explicit-any': 'error',
	},
	ignorePatterns: ['generated*'],
};
