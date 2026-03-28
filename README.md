# YT Popup Player

YT Popup Player is a neat browser extension that adds a "play-in-popup" button to YouTube thumbnails. It allows you to watch videos in a floating popup overlay or a customizable miniplayer without ever leaving your current page.

GitHub: https://github.com/kuronekony4n/ytpop

## Features

- **Play in Popup**: A sleek play button appears on YouTube video thumbnails across the site (Homepage, Channel Pages, Search Results, Shorts Grid). Click it to open the video in a floating overlay.
- **Picture-in-Picture Miniplayer**: Expand or shrink the active overlay into a miniplayer. Perfect for watching a video while you continue to browse YouTube.
- **Seamless Video Swapping**: Click another video's "Play in Popup" button while the overlay is open, and it instantly swaps the video in the active player without reloading the UI.
- **Settings & Customization**: A dedicated settings popup allows you to tweak your viewing experience:
  - **Blur Backdrop**: Toggle the blurred background effect behind the popup overlay.
  - **Popup Mode**: Choose between "On Page" (in-page overlay) or "New Window" (standalone browser window).
  - **Popup Size**: Scale the main video overlay (0.75x, 1x, 1.5x).
  - **Miniplayer Size**: Scale the miniplayer from 0.75x up to 3x.
  - **Miniplayer Position**: Snap the miniplayer to Bottom Right, Bottom Left, Top Right, or Top Left.
- **Persistent Preferences**: All settings are saved securely using `chrome.storage` and applied automatically.
- **Smart Element Detection**: Built to be sturdy against YouTube's dynamic page routing and Polymer DOM recycling.

## Installation

*(Once published to the Chrome Web Store, add the link here.)*

To install the extension manually for development or testing:

1. Download or clone this repository.
2. Build the extension (see Build Instructions below).
3. Open Google Chrome and navigate to `chrome://extensions/`.
4. Enable **Developer mode** by toggling the switch in the top right corner.
5. Click **Load unpacked** and select the built extension directory (typically `.output/chrome-mv3` or whatever the `extension` CLI outputs).

## Build Instructions

This project is built using the [`extension`](https://www.npmjs.com/package/extension) CLI tool for modern cross-browser extension development.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- npm (v8.8.0 or compatible)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ytpop.git
   cd ytpop
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Available Scripts

- **Start Development Server**:
  Watches for files changes and hot-reloads the extension for rapid development.
  ```bash
  npm run dev
  ```
- **Build for Production**:
  Compiles and bundles the extension for production use.
  ```bash
  npm run build
  ```
- **Browser-Specific Builds**:
  If you want to target a specific browser:
  - Chrome: `npm run build:chrome`
  - Firefox: `npm run build:firefox`
  - Edge: `npm run build:edge`

## How It Works

- The extension injects a content script that observes YouTube's DOM and attaches a small play button to video thumbnails.
- The play button is rendered inside a **Shadow DOM** to prevent YouTube's complex global CSS rules from breaking the button's styling.
- Upon clicking the button, an overlay is injected into the page containing a YouTube embed `iframe`.
- The user's settings (blur intensity, player dimensions, and positioning) are synced from the extension's popup UI seamlessly via Chrome's storage API.

## Contributing

Contributions, issues, and feature requests are always welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
