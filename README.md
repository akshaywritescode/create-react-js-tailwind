# create-react-js-tailwind

![Demo of the project](https://raw.githubusercontent.com/akshaywritescode/create-react-js-tailwind/refs/heads/main/sample.gif)

`create-react-js-tailwind` is an NPX script that scaffolds a React project with Vite and Tailwind CSS. It generates a complete boilerplate with configurations for ESLint, PostCSS, and TailwindCSS, providing you with a modern development setup out of the box.

## Features
- React with JSX
- Vite for fast development and builds and no need to delete vite boilerplate
- Preconfigured Tailwind CSS for utility-first styling
- Preconfigured ESLint for linting

## Installation
You can use this script directly with NPX, without needing to install it globally.

Create a folder and execute on that
```bash
npx create-react-js-tailwind my-app
```

Execute on current directory
```bash
npx create-react-js-tailwind .
```

Replace `my-app` with the desired name for your project folder. If you don't provide a name, it will scaffold the project in the current directory.

## Usage
After running the command, navigate to your project folder (if created in a new directory) and install dependencies:

```bash
cd my-app
npm install
npm run dev
```

## File Structure
The script creates the following file structure:

```
my-app/
├── public/
├── src/
│   ├── assets/
│   ├── App.jsx
│   ├── Index.jsx
│   ├── index.css
├── package.json
├── vite.config.js
├── index.html
├── eslint.config.js
├── tailwind.config.js
├── postcss.config.js
```

## Scripts
The generated `package.json` includes the following scripts:

- `dev`: Starts the Vite development server.
- `build`: Builds the project for production.
- `lint`: Lints the project using ESLint.
- `preview`: Previews the production build locally.

## Configuration

### Vite Configuration
The `vite.config.js` file is preconfigured with the React SWC plugin for fast builds.

### ESLint Configuration
The `eslint.config.js` file includes recommended configurations for React and JSX.

### Tailwind CSS
The `tailwind.config.js` file is set up to scan all relevant files for class names and includes a default theme that you can customize.

## License
This project is licensed under the [MIT License](LICENSE).
