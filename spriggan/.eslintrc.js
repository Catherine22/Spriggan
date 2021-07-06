module.exports = {
    root: true,
    env: {
        node: true,
        webextensions: true,
        browser: true
    },
    extends: ['@vue/prettier', 'plugin:vue/vue3-essential', 'eslint:recommended'],
    parserOptions: {
        ecmaVersion: 2020
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    },
    overrides: [
        {
            files: ['**/__tests__/*.js?(x)', '**/tests/unit/**/*.spec.js?(x)'],
            env: {
                jest: true
            }
        }
    ]
};
