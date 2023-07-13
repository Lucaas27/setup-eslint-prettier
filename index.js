import fs from 'fs';
import { execSync } from 'child_process';
import readline from 'readline';

function runSetup() {
  console.log('Running project setup...');

  // Install eslint
  execSync('npm i -D eslint@latest');

  // Install prettier and related plugins
  execSync('npm i -D prettier@latest eslint-plugin-prettier@latest eslint-config-prettier@latest');

  // Install eslint-config-airbnb-base or eslint-config-airbnb based on project type
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Is this a React project? (y/n): ', answer => {
    rl.close();

    let eslintConfig;

    if (answer.toLowerCase() === 'y' || answer === '') {
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
          es2021: true,
          node: true,
        },
        extends: ['airbnb-base', 'prettier'],
        parserOptions: {
          ecmaVersion: 'latest',
          sourceType: 'module',
        },
        ignorePatterns: ['dist/', 'node_modules/'],
        plugins: ['prettier'],
        rules: {
          'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
          'prettier/prettier': 'error',
          'no-unused-vars': 'warn',
          'no-console': 'off',
          'no-underscore-dangle': ['error', { allow: ['_id', '__v'] }],
        },
      };
    }

    // Create .prettierrc file
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

    // Create .eslintrc.json file
    fs.writeFileSync('.eslintrc.json', JSON.stringify(eslintConfig, null, 2));

    // Prompt the user for .editorconfig file creation
    const editorConfigReadline = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    editorConfigReadline.question(
      'Do you want to create an .editorconfig file? (y/n): ',
      editorConfigAnswer => {
        editorConfigReadline.close();

        if (editorConfigAnswer.toLowerCase() === 'y' || editorConfigAnswer === '') {
          // Create .editorconfig file
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

        console.log('Project setup completed successfully!');
      },
    );
  });
}

runSetup();
