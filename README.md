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

The built application (dmg, zip, or setup.exe) will be available in the `out/` directory.

## Technology Stack

- **Electron**: Cross-platform desktop framework.
- **Vanilla JS**: Lightweight core logic.
- **CSS3**: Modern flexbox/grid layouts and variables for styling.

## License

ISC
