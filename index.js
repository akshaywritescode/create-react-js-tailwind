#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const projectName = process.argv[2];

if (!projectName) {
  console.error("Please provide a project name.");
  console.error("Example: npx create-react-js-tailwind my-app");
  process.exit(1);
}

const projectPath = path.join(process.cwd(), projectName);

// Check if the directory exists
if (fs.existsSync(projectPath)) {
  console.error(`Error: The folder '${projectName}' already exists!`);
  process.exit(1);
}

// Create the project folder
fs.mkdirSync(projectPath, { recursive: true });

// Change the working directory to the new project folder
process.chdir(projectPath);

// Now your script will continue in the new project directory
console.log(`Creating project in: ${projectPath}`);

try {
  // Step 1: Run `npm init --yes` to create package.json dynamically
  execSync("npm init --yes");

  // Step 2: Read the generated package.json
  const packageJsonPath = path.join(process.cwd(), "package.json");
  const packageJson = require(packageJsonPath);

  // Step 3: Modify package.json to include necessary fields
  packageJson.scripts = {
    dev: "vite",
    build: "vite build",
    lint: "eslint .",
    preview: "vite preview",
  };

  packageJson.dependencies = {
    ...packageJson.dependencies,
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
  };

  packageJson.devDependencies = {
    ...packageJson.devDependencies,
    "@eslint/js": "^9.17.0",
    "@types/react": "^18.3.17",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react-swc": "^3.5.0",
    eslint: "^9.17.0",
    "eslint-plugin-react": "^7.37.2",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.16",
    globals: "^15.13.0",
    vite: "^6.0.3",
    tailwindcss: "^3.0.0",
    postcss: "^8.4.6",
    autoprefixer: "^10.4.4",
  };

  // Add "type" as "module"
  packageJson.type = "module";

  // Write the modified package.json back
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  // Step 4: Create 'public' and 'src' folders
  fs.mkdirSync(path.join(process.cwd(), "public"));
  fs.mkdirSync(path.join(process.cwd(), "src"));

  // Create assets folder inside src
  fs.mkdirSync(path.join(process.cwd(), "src", "assets"));

  // Step 5: Create App.jsx and Index.jsx inside src
  const appJsxContent = `function App() {
  return <div>Hello, React with Tailwind CSS!</div>;
}

export default App;`;

  const indexJsxContent = `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
    <App />
</React.StrictMode>)`;

  fs.writeFileSync(path.join(process.cwd(), "src", "App.jsx"), appJsxContent);
  fs.writeFileSync(
    path.join(process.cwd(), "src", "Index.jsx"),
    indexJsxContent
  );

  // Step 6: Create vite.config.js file
  const viteConfigContent = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc'; // React SWC plugin for fast builds

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});`;

  fs.writeFileSync(
    path.join(process.cwd(), "vite.config.js"),
    viteConfigContent
  );

  // Step 7: Create index.html file
  const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React + JS + Vite + Tailwind</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="./src/Index.jsx"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(process.cwd(), "index.html"), indexHtmlContent);

  // Step 8: Create eslint.config.js file
  const eslintConfigContent = `import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]`;

  fs.writeFileSync(
    path.join(process.cwd(), "eslint.config.js"),
    eslintConfigContent
  );

  // Step 9: Create index.css in src with Tailwind directives
  const indexCssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;
@tailwind variants;`;

  fs.writeFileSync(
    path.join(process.cwd(), "src", "index.css"),

    indexCssContent
  );

  // Step 10: Create tailwind.config.js file

  const tailwindConfigContent = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;

  fs.writeFileSync(
    path.join(process.cwd(), "tailwind.config.js"),

    tailwindConfigContent
  );

  // Step 11: Create postcss.config.js file
  const postcssConfigContent = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`;

  fs.writeFileSync(
    path.join(process.cwd(), "postcss.config.js"),
    postcssConfigContent
  );

  //Step 12: Create .gitignore file
  const gitIgnoreContent = `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
`;
  fs.writeFileSync(path.join(process.cwd(), ".gitignore"), gitIgnoreContent);

  // Step 13: Create postcss.config.js file
  const readMeContent = `# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

The Boilerplate created using create-react-js-tailwind
- [create-react-js-tailwind on github](https://github.com/akshaywritescode/create-react-js-tailwind)`;

  fs.writeFileSync(path.join(process.cwd(), "README.md"), readMeContent);

  // Step14: Check for Bun and install Bun
  const isWindows = process.platform === "win32";

  try {
    // Check if Bun is installed
    execSync("bun --version", { stdio: "ignore" });
    console.log("Bun is already installed. Running 'bun install'...");
    execSync("bun install", { stdio: "inherit" });
  } catch {
    console.log(
      "Bun is not installed. Installing Bun...(This is one time process)"
    );

    if (isWindows) {
      console.log("Detected Windows environment.");
      try {
        // Install Bun for Windows using PowerShell
        console.log("Installing Bun using npm...");
        execSync("npm install -g bun", { stdio: "inherit" });

        console.log("Bun installed successfully. Running 'bun install'...");
        execSync("bun install", { stdio: "inherit" });
      } catch (error) {
        console.error(
          "Error installing or running Bun on Windows:",
          error.message
        );
        process.exit(1);
      }
    } else {
      console.log("Detected Linux/MacOS environment.");
      try {
        // Install Bun for Unix-like systems
        execSync("npm install -g bun", { stdio: "inherit" });


        console.log("Bun installed successfully. Running 'bun install'...");
        execSync("bun install", { stdio: "inherit" });
      } catch (error) {
        console.error(
          "Error installing or running Bun on Linux/MacOS:",
          error.message
        );
        process.exit(1);
      }
    }

    console.log("Bun installed successfully. Running 'bun install'...");
    execSync("bun install", { stdio: "inherit" });
  }

  // Step15: Delete bun.lockb and create package-lock.json
  console.log("Deleting bun.lock...");
  fs.unlinkSync(path.join(process.cwd(), "bun.lock"));

  console.log("Creating package-lock.json...");
  execSync("npm i --package-lock-only", { stdio: "inherit" });

  // Final message
  console.log("\nDone. Now:\n\n  Starting Dev Server...");
  execSync("npm run dev", { stdio: "inherit" });
} catch (error) {
  console.error("Error creating directories and files:", error.message);
}
