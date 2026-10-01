# Quick Start Guide

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn

## Installation & Running

### 1. Clone the repository
```bash
git clone https://github.com/raju10uk-eng/3d-game-project.git
cd 3d-game-project
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

This will start a local server at **http://localhost:8080**

### 4. Open in browser
Open your browser and go to: **http://localhost:8080**

## Available Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Create production build in `/dist` folder
- `npm test` - Run test suite
- `npm run lint` - Run ESLint code checker

## Controls

- **W/A/S/D** - Move around
- **SPACE** - Jump
- **Mouse** - Look around
- **Left Click** - Attack
- **E** - Interact

## Difficulty Selection

Use the dropdown in the bottom-right corner to select:
- **Normal** - Easy mode (good for learning)
- **Hard** - Medium difficulty (challenging)
- **Nightmare** - Expert mode (very hard!)

## Troubleshooting

### Port 8080 already in use?
Edit `webpack.config.js` and change the port number:
```javascript
devServer: {
  port: 3000, // Change this to a different port
}
```

### Module not found errors?
Try clearing node_modules and reinstalling:
```bash
rm -rf node_modules
npm install
```

### Build issues?
Make sure you have the correct Node.js version:
```bash
node --version
```

Should be v14.0.0 or higher.

## System Requirements

- Modern browser with WebGL support (Chrome, Firefox, Edge)
- Discrete GPU recommended for best performance
- Minimum 4GB RAM
- Stable internet connection (for CDN resources)

---

**Ready to play? Run `npm install && npm run dev` and open http://localhost:8080** 🎮
