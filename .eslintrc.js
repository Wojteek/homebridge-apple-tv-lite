module.exports = {
    root: true,
    env: {
        browser: true,
    },
    extends: [
        'plugin:@typescript-eslint/recommended',
    ],
    'plugins': [
        '@typescript-eslint',
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'strict': 'off',
    },
    parserOptions: {
        parser: '@typescript-eslint/parser',
    },
};
