import fs from 'fs';
import { execSync } from 'child_process';
import inquirer from 'inquirer';

function runSetup() {
  console.log('Running ESlint project setup...');
  // Install eslint
  execSync('npm i -D eslint@latest');

  // Install prettier and related plugins
  execSync('npm i -D prettier@latest eslint-plugin-prettier@latest eslint-config-prettier@latest');

  const questions = [
    {
      type: 'confirm',
      name: 'isReactProject',
      message: 'Is this a React project?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'createEditorConfig',
      message: 'Do you want to create an .editorconfig file?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'createPrettierConfig',
      message: 'Do you want to create a .prettierrc file?',
      default: true,
    },
  ];

  inquirer.prompt(questions).then(answers => {
    const { isReactProject, createEditorConfig, createPrettierConfig } = answers;

    let eslintConfig;

    if (isReactProject) {
      eslintConfig = {
        env: {
          browser: true,
          es2021: true,
        },
        extends: ['plugin:react/recommended', 'airbnb', 'prettier'],
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          ecmaVersion: 'latest',
          sourceType: 'module',
        },
        ignorePatterns: ['dist/', 'node_modules/'],
        plugins: ['react', 'prettier'],
        rules: {
          'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
          'prettier/prettier': 'error',
          'no-unused-vars': 'warn',
          'no-console': 'off',
          'no-underscore-dangle': ['error', { allow: ['_id', '__v'] }],
          'no-alert': 'off',
          'no-param-reassign': ['error', { props: false }],
          'react/prop-types': 'off',
          'import/extensions': [
            'error',
            'ignorePackages',
            {
              js: 'never',
              jsx: 'never',
              ts: 'never',
              tsx: 'never',
            },
          ],
        },
      };

      execSync('npx install-peerdeps --dev eslint-config-airbnb');
    } else {
      eslintConfig = {
        env: {
          node: true,
          es2021: true,
        },
        extends: ['airbnb-base', 'prettier'],
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          ecmaVersion: 'latest',
          sourceType: 'module',
        },
        ignorePatterns: ['node_modules/'],
        plugins: ['prettier'],
        rules: {
          'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
          'prettier/prettier': 'error',
          'no-unused-vars': 'warn',
          'no-console': 'off',
          'no-underscore-dangle': ['error', { allow: ['_id', '__v'] }],
          'no-alert': 'off',
          'no-param-reassign': ['error', { props: false }],
          'import/extensions': [
            'error',
            'ignorePackages',
            {
              js: 'always',
              jsx: 'always',
              ts: 'always',
              tsx: 'always',
            },
          ],
        },
      };
      execSync('npx install-peerdeps --dev eslint-config-airbnb-base');
    }

    fs.writeFileSync('.eslintrc.json', JSON.stringify(eslintConfig, null, 2));

    if (createEditorConfig) {
      const editorConfigContent = `# top-most EditorConfig file
    root = true

    [*]
    indent_style = space
    indent_size = 2
    end_of_line = lf
    charset = utf-8
    trim_trailing_whitespace = true
    insert_final_newline = true

    [*.md]
    trim_trailing_whitespace = false
    `;
      fs.writeFileSync('.editorconfig', editorConfigContent);
    }

    if (createPrettierConfig) {
      const prettierConfig = {
        arrowParens: 'avoid',
        bracketSpacing: true,
        htmlWhitespaceSensitivity: 'css',
        insertPragma: false,
        jsxSingleQuote: true,
        singleQuote: true,
        printWidth: 100,
        proseWrap: 'preserve',
        quoteProps: 'as-needed',
        requirePragma: false,
        tabWidth: 2,
        trailingComma: 'all',
        useTabs: false,
        endOfLine: 'lf',
      };
      fs.writeFileSync('.prettierrc', JSON.stringify(prettierConfig, null, 2));
    }

    console.log('Project setup completed successfully!');
  });
}

runSetup();
