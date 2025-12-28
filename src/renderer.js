const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const emptyState = document.getElementById('empty-state');
const previewContainer = document.getElementById('image-preview-container');
const previewImg = document.getElementById('preview-img');
const fileNameDisplay = document.getElementById('file-name');
const positivePromptArea = document.getElementById('positive-prompt');
const negativePromptArea = document.getElementById('negative-prompt');
const attributesGrid = document.getElementById('attributes-grid');
const rawDataArea = document.getElementById('raw-data');

// Buttons
const btnCopyPositive = document.getElementById('btn-copy-positive');
const btnCopyNegative = document.getElementById('btn-copy-negative');
const btnCopyAttributes = document.getElementById('btn-copy-attributes');

// --- Event Listeners ---

// Drag & Drop
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('drag-over');

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'image/png') {
        processFile(files[0]);
    }
});

// Click to Open
emptyState.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        processFile(e.target.files[0]);
    }
});

// Copy Buttons
btnCopyPositive.addEventListener('click', () => copyToClipboard(positivePromptArea.value, btnCopyPositive));
btnCopyNegative.addEventListener('click', () => copyToClipboard(negativePromptArea.value, btnCopyNegative));
btnCopyAttributes.addEventListener('click', () => {
    // Construct a string of attributes
    const tags = Array.from(attributesGrid.querySelectorAll('.attr-tag')).map(tag => {
        const label = tag.querySelector('.attr-label').innerText;
        const value = tag.querySelector('.attr-value').innerText;
        return `${label}: ${value}`;
    }).join(', ');
    copyToClipboard(tags, btnCopyAttributes);
});


// --- Core Logic ---

function processFile(file) {
    // 1. Show Preview
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImg.src = e.target.result;
        previewContainer.classList.remove('hidden');
        emptyState.classList.add('hidden');
        fileNameDisplay.innerText = file.name;
    };
    reader.readAsDataURL(file);

    // 2. Parse Metadata
    const bufferReader = new FileReader();
    bufferReader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        const tags = await window.electronAPI.parseMetadata(arrayBuffer);

        displayMetadata(tags);
    };
    bufferReader.readAsArrayBuffer(file);
}

function displayMetadata(tags) {
    // Clear previous
    positivePromptArea.value = '';
    negativePromptArea.value = '';
    attributesGrid.innerHTML = '';

    if (!tags || !tags['parameters']) {
        // Fallback or No Data
        console.log("No parameters tag found", tags);
        if (tags && tags['UserComment']) {
            // Sometimes stored in UserComment (Exif)
            // Handle if necessary
        }
        attributesGrid.innerHTML = '<div class="attr-item">No SD metadata found</div>';
        return;
    }

    const rawText = tags['parameters'].description; // ExifReader returns object with description
    rawDataArea.value = rawText; // For debug

    // Parse SD Prompt Format
    // Format usually:
    // Positive Prompt
    // Negative prompt: ...
    // Steps: 20, Sampler: ...

    let positive = '';
    let negative = '';
    let params = '';

    const lines = rawText.split('\n');
    let mode = 'positive'; // positive, negative, params

    lines.forEach(line => {
        if (line.startsWith('Negative prompt:')) {
            mode = 'negative';
            negative += line.replace('Negative prompt:', '').trim() + '\n';
        } else if (line.startsWith('Steps:')) {
            mode = 'params';
            params += line + '\n';
        } else {
            if (mode === 'positive') positive += line + '\n';
            if (mode === 'negative') negative += line + '\n';
            if (mode === 'params') params += line + '\n';
        }
    });

    positivePromptArea.value = positive.trim();
    negativePromptArea.value = negative.trim();

    // Parse Parameters line (comma separated key: value)
    // Eg: Steps: 20, Sampler: Euler a, CFG scale: 7, Seed: 3514731873, Size: 512x768, Model hash: ...
    if (params) {
        const paramItems = params.split(',').map(p => p.trim()).filter(p => p);
        paramItems.forEach(item => {
            const splitIdx = item.indexOf(':');
            if (splitIdx > -1) {
                const key = item.substring(0, splitIdx).trim();
                const value = item.substring(splitIdx + 1).trim();
                createAttributeTag(key, value);
            }
        });
    }
}

function createAttributeTag(key, value) {
    const div = document.createElement('div');
    div.className = 'attr-tag';
    div.innerHTML = `
        <span class="attr-label">${key}</span>
        <span class="attr-value" title="${value}">${value}</span>
    `;
    attributesGrid.appendChild(div);
}

function copyToClipboard(text, btnElement) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
        const originalText = btnElement.innerText;
        btnElement.innerText = 'Copied!';
        btnElement.style.backgroundColor = '#22c55e'; // Green
        btnElement.style.color = 'white';
        setTimeout(() => {
            btnElement.innerText = originalText;
            btnElement.style.backgroundColor = '';
            btnElement.style.color = '';
        }, 1500);
    });
}
