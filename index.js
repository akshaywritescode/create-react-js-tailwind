#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
const projectName = args[0] || ".";
const projectPath = projectName === "." ? process.cwd() : path.join(process.cwd(), projectName);

if (projectName !== "." && fs.existsSync(projectPath)) {
  console.error(`Error: The folder '${projectName}' already exists!`);
  process.exit(1);
}

if (projectName !== ".") fs.mkdirSync(projectPath);

console.log(`Creating React + Tailwind project in ${projectPath}...`);
process.chdir(projectPath);

const runCommand = (command) => execSync(command, { stdio: "inherit" });

try {
  runCommand("npm init -y");

  const packageJsonPath = path.join(projectPath, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

  packageJson.scripts = {
    dev: "vite",
    build: "vite build",
    lint: "eslint .",
    preview: "vite preview"
  };

  packageJson.dependencies = {
    react: "^18.3.1",
    "react-dom": "^18.3.1"
  };

  packageJson.devDependencies = {
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
    autoprefixer: "^10.4.4"
  };

  packageJson.type = "module";
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  ["public", "src", "src/assets"].forEach(dir => fs.mkdirSync(path.join(projectPath, dir)));

  const files = {
    "src/App.jsx": `function App() {
  return <div>Hello, React with Tailwind CSS!</div>;
}
export default App;`,

    "src/Index.jsx": `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,

    "vite.config.js": `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
export default defineConfig({ plugins: [react()] });`,

    "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React + Vite + Tailwind</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="./src/Index.jsx"></script>
</body>
</html>`,

    "eslint.config.js": `import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true }, sourceType: 'module' }
    },
    settings: { react: { version: '18.3' } },
    plugins: { react, 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: { ...js.configs.recommended.rules, ...react.configs.recommended.rules, ...reactHooks.configs.recommended.rules }
  }
];`,

    "src/index.css": `@tailwind base;
@tailwind components;
@tailwind utilities;`,

    "tailwind.config.js": `export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: []
};`,

    "postcss.config.js": `export default { plugins: { tailwindcss: {}, autoprefixer: {} } };`,

    ".gitignore": `node_modules
dist
.DS_Store
.vscode/
.idea/`,

    "README.md": `# React + Vite + Tailwind
This template provides a minimal setup to get React working in Vite with HMR and ESLint.`
  };

  Object.entries(files).forEach(([filePath, content]) => {
    fs.writeFileSync(path.join(projectPath, filePath), content);
  });

  try {
    execSync("bun --version", { stdio: "ignore" });
    console.log("Bun is installed. Running 'bun install'...");
    runCommand("bun install");
  } catch {
    console.log("Bun not found. Installing...");
    runCommand("npm install -g bun");
    runCommand("bun install");
  }

  console.log("Project setup complete!");
} catch (error) {
  console.error("Error setting up project:", error);
  process.exit(1);
}
