# Prompt Viewer

A Stable Diffusion Prompt Reader designed for macOS and Windows with a dark-themed UI.

![screenshot](https://github.com/user-attachments/assets/e627c259-6ea9-4eeb-a1ab-9d0330171fbe)

## Features

- **Drag & Drop**: Easily load images by dragging them into the app.
- **Broad Format Support**: Reads metadata from **PNG**, **JPEG**, and **WebP** files.
- **Workflow Support**: Native compatibility for **Automatic1111** and **ComfyUI** generation data.
- **Smart View Modes**:
  - **Rendered**: View the final prompt with wildcards resolved.
  - **Source**: View the original dynamic template.
- **One-Click Copy**: Quickly copy positive prompts, negative prompts, or generation attributes.
- **Clean UI**: Modern dark mode interface.

## Installation

Ensure you have [Node.js](https://nodejs.org/) installed.

```bash
# Clone the repository
git clone https://github.com/azyu/prompt-viewer.git

# Go into the app directory
cd prompt-viewer

# Install dependencies
npm install
```

## Usage

### Development Mode

```bash
npm start
```

### Build Application

```bash
npm run make
```

### Automated Builds (GitHub Actions)

This repository uses **GitHub Actions** to automatically build for:

- **Windows** (`.exe`, `.zip`)
- **macOS** (`.zip`)
- **Linux** (`.deb`, `.rpm`, `.zip`)

Artifacts are generated on every push to `main` and can be downloaded from the "Actions" tab in GitHub.

## Technology Stack

- **Electron**: Cross-platform desktop framework.
- **Vanilla JS**: Lightweight core logic.
- **CSS3**: Modern flexbox/grid layouts and variables for styling.

## License

ISC

## Troubleshooting

### macOS: "App is damaged" or cannot be opened

On macOS, locally built unsigned apps may be blocked by Gatekeeper. To fix this, remove the quarantine attribute:

```bash
xattr -cr out/prompt-viewer-darwin-arm64/Prompt\ Viewer.app
# OR
xattr -cr /path/to/your/Prompt\ Viewer.app
```

## Disclaimer

This application was created by me and **Antigravity (Gemini 3 Pro)**. Please do not expect the highest code quality in this repo (yet).

This project isn't endorsed by Google and doesn't reflect the views or opinions of Google or anyone officially involved in producing or managing Google/Antigravity properties.
