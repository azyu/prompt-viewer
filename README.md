# Prompt Viewer

A Stable Diffusion Prompt Reader designed for macOS and Windows with a dark-themed UI.

![Screenshot](https://via.placeholder.com/800x600?text=Prompt+Viewer+Screenshot)

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
