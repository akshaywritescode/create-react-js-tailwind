#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const args = process.argv.slice(2);

const projectName =
  args.find((arg) => !arg.startsWith("--")) || ".";

const flags = args.filter((arg) =>
  arg.startsWith("--"),
);

const isTS = flags.includes("--ts");
const isJS = flags.includes("--js");

const useTypeScript = isTS || !isJS;

const projectPath =
  projectName === "."
    ? process.cwd()
    : path.join(process.cwd(), projectName);

if (
  projectName !== "." &&
  fs.existsSync(projectPath)
) {
  console.error(
    `Error: The folder '${projectName}' already exists!`,
  );

  process.exit(1);
}

if (projectName !== ".") {
  fs.mkdirSync(projectPath);
}

console.log(
  `Creating ${
    useTypeScript
      ? "React + TypeScript"
      : "React + JavaScript"
  } app in ${projectPath}...`,
);

process.chdir(projectPath);

const runCommand = (command) =>
  execSync(command, {
    stdio: "inherit",
  });

try {
  runCommand("npm init -y");

  const packageJsonPath = path.join(
    projectPath,
    "package.json",
  );

  const packageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, "utf-8"),
  );

  packageJson.name =
    projectName === "."
      ? path.basename(projectPath)
      : projectName;

  packageJson.private = true;

  packageJson.version = "0.0.0";

  packageJson.type = "module";

  packageJson.scripts = {
    dev: "vite",
    build: "vite build",
    lint: "eslint .",
    preview: "vite preview",
  };

  packageJson.dependencies = {
    react: "^19.2.6",
    "react-dom": "^19.2.6",
  };

  if (useTypeScript) {
    packageJson.devDependencies = {
      "@babel/core": "^7.29.0",
      "@eslint/js": "^10.0.1",
      "@rolldown/plugin-babel": "^0.2.3",
      "@tailwindcss/vite": "^4.1.7",
      "@types/babel__core": "^7.20.5",
      "@types/node": "^24.12.3",
      "@types/react": "^19.2.14",
      "@types/react-dom": "^19.2.3",
      "@vitejs/plugin-react": "^6.0.1",
      "babel-plugin-react-compiler":
        "^1.0.0",
      eslint: "^10.3.0",
      "eslint-plugin-react-hooks":
        "^7.1.1",
      "eslint-plugin-react-refresh":
        "^0.5.2",
      globals: "^17.6.0",
      tailwindcss: "^4.1.7",
      typescript: "~6.0.2",
      "typescript-eslint": "^8.59.2",
      vite: "^8.0.12",
    };
  } else {
    packageJson.devDependencies = {
      "@babel/core": "^7.29.0",
      "@eslint/js": "^10.0.1",
      "@rolldown/plugin-babel": "^0.2.3",
      "@tailwindcss/vite": "^4.1.7",
      "@types/react": "^19.2.14",
      "@types/react-dom": "^19.2.3",
      "@vitejs/plugin-react": "^6.0.1",
      "babel-plugin-react-compiler":
        "^1.0.0",
      eslint: "^10.3.0",
      "eslint-plugin-react-hooks":
        "^7.1.1",
      "eslint-plugin-react-refresh":
        "^0.5.2",
      globals: "^17.6.0",
      tailwindcss: "^4.1.7",
      vite: "^8.0.12",
    };
  }

  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2),
  );

  ["public", "src", "src/assets"].forEach(
    (dir) => {
      fs.mkdirSync(
        path.join(projectPath, dir),
        {
          recursive: true,
        },
      );
    },
  );

  const files = useTypeScript
    ? {
        "src/App.tsx": `function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <h1 className="text-5xl font-bold">
        React + TypeScript + Tailwind v4
      </h1>
    </div>
  );
}

export default App;
`,

        "src/main.tsx": `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`,

        "src/index.css": `@import "tailwindcss";
`,

        "vite.config.ts": `import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    tailwindcss(),
  ],
});
`,

        "tsconfig.json": `{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
`,

        "tsconfig.app.json": `{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "es2023",
    "lib": ["ES2023", "DOM"],
    "module": "esnext",
    "types": ["vite/client"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
`,

        "tsconfig.node.json": `{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "es2023",
    "lib": ["ES2023"],
    "module": "esnext",
    "types": ["node"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
`,

        "eslint.config.js": `import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import {
  defineConfig,
  globalIgnores,
} from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
]);
`,

        "index.html": `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>React App</title>
  </head>

  <body>
    <div id="root"></div>

    <script
      type="module"
      src="/src/main.tsx"
    ></script>
  </body>
</html>
`,
      }
    : {
        "src/App.jsx": `function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <h1 className="text-5xl font-bold">
        React + JavaScript + Tailwind v4
      </h1>
    </div>
  );
}

export default App;
`,

        "src/main.jsx": `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`,

        "src/index.css": `@import "tailwindcss";
`,

        "vite.config.js": `import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    tailwindcss(),
  ],
});
`,

        "eslint.config.js": `import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  {
    ignores: ['dist'],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
];
`,

        "index.html": `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>React App</title>
  </head>

  <body>
    <div id="root"></div>

    <script
      type="module"
      src="/src/main.jsx"
    ></script>
  </body>
</html>
`,
      };

  const sharedFiles = {
    ".gitignore": `node_modules
dist
.DS_Store
.vscode
.idea
`,

    "README.md": `# ${
      useTypeScript
        ? "React + TypeScript"
        : "React + JavaScript"
    } + Vite

Modern React starter powered by:

- React 19
- Vite 8
- Rolldown
- Tailwind CSS v4
- React Compiler
- ESLint
`,
  };

  Object.entries({
    ...files,
    ...sharedFiles,
  }).forEach(([filePath, content]) => {
    fs.writeFileSync(
      path.join(projectPath, filePath),
      content,
    );
  });

  try {
    execSync("bun --version", {
      stdio: "ignore",
    });

    console.log(
      "Bun is installed. Running 'bun install'...",
    );

    runCommand("bun install");
  } catch {
    console.log("Bun not found. Installing...");

    runCommand("npm install -g bun");

    runCommand("bun install");
  }

  ["bun.lock", "bun.lockb"].forEach(
    (file) => {
      const lockPath = path.join(
        projectPath,
        file,
      );

      if (fs.existsSync(lockPath)) {
        fs.unlinkSync(lockPath);
      }
    },
  );

  runCommand(
    "npm install --package-lock-only",
  );

  console.log("");
  console.log(
    "Project setup complete!",
  );
  console.log("");

  if (projectName === ".") {
    console.log("Run:");
    console.log("npm run dev");
  } else {
    console.log("Run:");
    console.log(`cd ${projectName}`);
    console.log("npm run dev");
  }
} catch (error) {
  console.error(
    "Error setting up project:",
    error,
  );

  process.exit(1);
}