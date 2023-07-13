import fs from 'fs';
import { execSync } from 'child_process';
import inquirer from 'inquirer';

function runSetup() {
  console.log('Running project setup...');
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
  ];

  inquirer.prompt(questions).then(answers => {
    const { isReactProject, createEditorConfig } = answers;

    let eslintConfig;

    if (isReactProject) {
      eslintConfig = {
        env: {
          browser: true,
          es2021: true,
        },
        extends: ['plugin:react/recommended', 'airbnb', 'prettier'],
        // ... rest of the config
      };

      execSync('npx install-peerdeps --dev eslint-config-airbnb');
    } else {
      eslintConfig = {
        env: {
          es2021: true,
          node: true,
        },
        extends: ['airbnb-base', 'prettier'],
        // ... rest of the config
      };
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

    console.log('Project setup completed successfully!');
  });
}

runSetup();
