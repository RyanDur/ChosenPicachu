import tsEslint from 'typescript-eslint';
import eslint from '@eslint/js';
import hooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import vitest from 'eslint-plugin-vitest';
import react from 'eslint-plugin-react';
import globals from 'globals';

export default tsEslint.config(
    {ignores: ['dist']},
    eslint.configs.recommended,
    {
        files: ['**/*.{js,ts,tsx}'],
        plugins: {
            '@typescript-eslint': tsEslint.plugin,
            'react-hooks': hooksPlugin,
            'react-refresh': reactRefreshPlugin,
            vitest,
            react,
        },
        languageOptions: {
            parser: tsEslint.parser,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
            globals: {
                ...vitest.environments.env.globals,
                ...globals.browser,
                fetchMock: false,
            },
            ecmaVersion: 2023,
            sourceType: 'module',
        },
        rules: {
            '@typescript-eslint/no-unsafe-argument': 'error',
            '@typescript-eslint/no-unsafe-call': 'error',
            '@typescript-eslint/no-unsafe-member-access': 'error',
            'react/jsx-uses-react': 'off',
            'react/react-in-jsx-scope': 'off',
            'react-refresh/only-export-components': [
                'warn',
                {allowConstantExport: true},
            ],
            semi: ['error', 'always', {'omitLastInOneLineBlock': true}],
            ...hooksPlugin.configs.recommended.rules,
            quotes: ['error', 'single', {'avoidEscape': true}],
            ...vitest.configs.recommended.rules,
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    'args': 'all',
                    'argsIgnorePattern': '^_',
                    'caughtErrors': 'all',
                    'caughtErrorsIgnorePattern': '^_',
                    'destructuredArrayIgnorePattern': '^_',
                    'varsIgnorePattern': '^_',
                    'ignoreRestSiblings': true
                }
            ]
        },
        settings: {
            vitest: {
                typecheck: true
            }
        },
    },
    {
        // disable type-aware linting on JS files
        files: ['**/*.js'],
        ...tsEslint.configs.disableTypeChecked,
    },
);