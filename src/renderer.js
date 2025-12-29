const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const emptyState = document.getElementById('empty-state');
const previewContainer = document.getElementById('image-preview-container');
const previewImg = document.getElementById('preview-img');
const fileNameDisplay = document.getElementById('file-name');
const positivePromptArea = document.getElementById('positive-prompt');
const negativePromptArea = document.getElementById('negative-prompt');
const attributesList = document.getElementById('attributes-list');
const rawDataArea = document.getElementById('raw-data');
const promptModeSelector = document.getElementById('prompt-mode-selector');

// Buttons
const btnCopyPositive = document.getElementById('btn-copy-positive');
const btnCopyNegative = document.getElementById('btn-copy-negative');
const btnCopyAttributes = document.getElementById('btn-copy-attributes');
const btnReset = document.getElementById('btn-reset');

// State
let currentPromptData = {
    positive: { rendered: '', source: '' },
    negative: { rendered: '', source: '' }
};

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
    if (files.length > 0) {
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

// Prompt Mode Selector
promptModeSelector.addEventListener('change', (e) => {
    updatePromptDisplay(e.target.value);
});

// Copy Buttons
btnCopyPositive.addEventListener('click', () => copyToClipboard(positivePromptArea.value, btnCopyPositive));
btnCopyNegative.addEventListener('click', () => copyToClipboard(negativePromptArea.value, btnCopyNegative));
btnCopyAttributes.addEventListener('click', () => {
    // Construct a string of attributes
    const rows = Array.from(attributesList.querySelectorAll('.attr-row'));
    const tags = rows.map(row => {
        const label = row.querySelector('.attr-label').innerText;
        const value = row.querySelector('.attr-value').innerText;
        return `${label}: ${value}`;
    }).filter(s => !s.includes('No image loaded')).join(', ');
    copyToClipboard(tags, btnCopyAttributes);
});

btnReset.addEventListener('click', resetUI);


// --- Core Logic ---

function processFile(file) {
    resetUI(); // Clear previous state immediately

    if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/webp') {
        alert('Supported formats: PNG, JPEG, WebP');
        return;
    }

    // 1. Show Preview & Get Dimensions
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImg.src = e.target.result;
        previewContainer.classList.remove('hidden');
        emptyState.classList.add('hidden');
        fileNameDisplay.innerText = file.name;

        // Image Dimensions
        previewImg.onload = () => {
            const width = previewImg.naturalWidth;
            const height = previewImg.naturalHeight;
            createAttributeTag('Size', `${width}x${height}`);
        };
    };
    reader.readAsDataURL(file);

    // 2. Parse Metadata
    const bufferReader = new FileReader();
    bufferReader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        try {
            const tags = await window.electronAPI.parseMetadata(arrayBuffer);
            displayMetadata(tags);
        } catch (error) {
            console.error("Metadata parsing failed:", error);
            attributesList.innerHTML = '<div class="attr-row placeholder">Error reading metadata</div>';
        }
    };
    bufferReader.readAsArrayBuffer(file);
}

function displayMetadata(tags) {
    clearMetadataFields();
    
    // Clear previous - handled by resetUI but specific fields might need explicit clearing if not fully covered
    // Actually resetUI handles everything, so we just use that.
    
    // Wait, resetUI clears the image too. But here we just want to clear metadata fields before populating them?
    // No, displayMetadata is called after processFile. processFile sets the image.
    // If we call resetUI here, we clear the image we just set!
    
    // Let's NOT call resetUI here. Instead, clearMetadataFields().
    clearMetadataFields();

    if (!tags) {
        return; // Size will be added by img.onload
    }

    // Check for ComfyUI
    if (tags['prompt'] || tags['workflow']) {
        handleComfyUI(tags);
        return;
    }

    // Fallback logic for A1111 / Standard
    if (!tags['parameters'] && !tags['UserComment']) {
        console.log("No standard parameters found", tags);
        // Size added by processFile
        return;
    }

    let rawText = '';
    if (tags['parameters']) {
        rawText = tags['parameters'].description;
    } else if (tags['UserComment']) {
        let uc = tags['UserComment'].description;
        if (uc.includes('Steps:')) {
            rawText = uc;
        }
    }

    if (!rawText) {
        rawDataArea.value = JSON.stringify(tags, null, 2);
        return;
    }

    rawDataArea.value = rawText;

    // Parse SD Prompt Format
    let positive = '';
    let negative = '';
    let params = '';

    const lines = rawText.split('\n');
    let mode = 'positive';

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

    // For A1111, rendered and source are usually same (no templates)
    currentPromptData.positive.rendered = positive.trim();
    currentPromptData.positive.source = positive.trim();
    currentPromptData.negative.rendered = negative.trim();
    currentPromptData.negative.source = negative.trim();

    updatePromptDisplay(promptModeSelector.value);

    // Parse Parameters line
    if (params) {
        const paramItems = params.split(',').map(p => p.trim()).filter(p => p);
        paramItems.forEach(item => {
            const splitIdx = item.indexOf(':');
            if (splitIdx > -1) {
                const key = item.substring(0, splitIdx).trim();
                const value = item.substring(splitIdx + 1).trim();
                // Skip Size if already handled manually, but A1111 metadata size is also good
                if (key !== 'Size') createAttributeTag(key, value);
            }
        });
    }
}

function updatePromptDisplay(mode) {
    // Mode: 'rendered' or 'source'
    positivePromptArea.value = currentPromptData.positive[mode] || currentPromptData.positive.rendered || "";
    negativePromptArea.value = currentPromptData.negative[mode] || currentPromptData.negative.rendered || "";
}

function createAttributeTag(key, value) {
    // Check if exists
    const existing = Array.from(attributesList.querySelectorAll('.attr-label')).find(el => el.innerText === key);
    if (existing) return;

    const div = document.createElement('div');
    div.className = 'attr-row';
    div.innerHTML = `
        <span class="attr-label">${key}</span>
        <span class="attr-value" title="${value}">${value}</span>
    `;
    attributesList.appendChild(div);
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

function clearMetadataFields() {
    positivePromptArea.value = '';
    negativePromptArea.value = '';
    attributesList.innerHTML = '';
    rawDataArea.value = '';
    currentPromptData = {
        positive: { rendered: '', source: '' },
        negative: { rendered: '', source: '' }
    };
}

function resetUI() {
    // Clear Image
    previewImg.src = '';
    previewContainer.classList.add('hidden');
    emptyState.classList.remove('hidden');
    fileInput.value = ''; // Reset input so same file can be selected again
    fileNameDisplay.innerText = '';
    
    // Clear Metadata
    clearMetadataFields();
}

function handleComfyUI(tags) {
    let promptJson = null;
    let workflowJson = null;

    try {
        if (tags['prompt']) {
            promptJson = JSON.parse(tags['prompt'].description);
        }
        if (tags['workflow']) {
            workflowJson = JSON.parse(tags['workflow'].description);
        }
    } catch (e) {
        console.error("Failed to parse ComfyUI JSON", e);
    }

    // Display Raw Data
    rawDataArea.value = JSON.stringify(workflowJson || promptJson, null, 2);

    // Separated Storage
    let posRendered = new Set();
    let posSource = new Set();
    let negRendered = new Set();
    let negSource = new Set();

    let seed = 'Unknown';
    let steps = 'Unknown';
    let cfg = 'Unknown';
    let sampler = 'Unknown';
    let model = 'Unknown';

    if (promptJson) {
        const nodes = promptJson;

        // Helper: Recursive Trace
        const collectText = (inputVal, targetRendered, targetSource, direction, visited = new Set(), depth = 0) => {
            if (!Array.isArray(inputVal)) return;
            const linkNodeId = inputVal[0];

            if (visited.has(linkNodeId)) return;
            visited.add(linkNodeId);

            const linkNode = nodes[linkNodeId];
            if (!linkNode) return;

            const type = linkNode.class_type;

            // 1. Text Node Candidates
            const textNodeTypes = [
                'CLIPTextEncode', 'CLIPTextEncodeSDXL', 'ShowText', 'PrimitiveNode',
                'ImpactWildcardProcessor', 'ImpactWildcardEncode', 'WildcardEncode'
            ];

            const isTextNode = textNodeTypes.includes(type) || type.includes('TextEncode') || type.includes('WildcardProcessor');

            if (isTextNode) {
                // Check Populated (Rendered)
                const popText = linkNode.inputs.populated_text;
                if (popText && typeof popText === 'string' && popText.trim()) {
                    targetRendered.add(popText.trim());
                }

                // Check Source (Template)
                // If populated_text exists, we want 'text'/'wildcard_text' to go to Source Set.
                // If NO populated_text, then 'text' goes to BOTH (as it is effectively both source and result).

                const sourceInputs = [
                    linkNode.inputs.text,
                    linkNode.inputs.text_g,
                    linkNode.inputs.text_l,
                    linkNode.inputs.string_field,
                    linkNode.inputs.prompt,
                    linkNode.inputs.wildcard,
                    linkNode.inputs.wildcard_text
                ];

                let hasSource = false;
                sourceInputs.forEach(t => {
                    if (t && typeof t === 'string' && t.trim()) {
                        targetSource.add(t.trim());
                        if (!popText) targetRendered.add(t.trim()); // If no specific result, source is result
                        hasSource = true;
                    }
                });

                if (hasSource || popText) return; // Stop tracing if we found content

                // Check for Linked Text Inputs (e.g. Primitive->CLIPTextEncode)
                const linkedLabels = ['text', 'text_g', 'text_l', 'wildcard_text', 'wildcard', 'populated_text', 'prompt'];
                let linkedFound = false;
                linkedLabels.forEach(label => {
                    if (Array.isArray(linkNode.inputs[label])) {
                        collectText(linkNode.inputs[label], targetRendered, targetSource, direction, visited, depth + 1);
                        linkedFound = true;
                    }
                });
                if (linkedFound) return;
            }

            // 2. Traversal inputs
            let nextInputs = ['conditioning', 'conditioning_1', 'conditioning_2', 'conditioning_from', 'conditioning_to', 'source'];

            if (direction === 'positive') nextInputs.push('positive', 'a', 'base_ctx', 'refiner_ctx', 'refiner_positive', 'clip');
            if (direction === 'negative') nextInputs.push('negative', 'b', 'refiner_negative', 'clip');

            nextInputs.push('bus', 'pipe', 'basic_pipe');

            let continued = false;
            nextInputs.forEach(key => {
                if (linkNode.inputs[key]) {
                    continued = true;
                    collectText(linkNode.inputs[key], targetRendered, targetSource, direction, visited, depth + 1);
                }
            });

            if (!continued) {
                // Check ALL inputs for Reroute/Note
                if (type === 'Reroute' || type === 'Note' || type.includes('Reroute')) {
                    Object.values(linkNode.inputs).forEach(val => collectText(val, targetRendered, targetSource, direction, visited, depth + 1));
                    continued = true;
                }
            }
        };

        // 1. Find KSamplers
        Object.values(nodes).forEach(node => {
            if (node.class_type.includes('KSampler')) {
                // Attributes
                if (node.inputs.seed) seed = node.inputs.seed;
                if (node.inputs.steps) steps = node.inputs.steps;
                if (node.inputs.cfg) cfg = node.inputs.cfg;
                if (node.inputs.sampler_name) sampler = node.inputs.sampler_name;

                // Trace Prompts
                if (node.inputs.positive) {
                    collectText(node.inputs.positive, posRendered, posSource, 'positive');
                }
                if (node.inputs.negative) {
                    collectText(node.inputs.negative, negRendered, negSource, 'negative');
                }
            }

            if (node.class_type === 'CheckpointLoaderSimple' || node.class_type === 'CheckpointLoader') {
                if (node.inputs.ckpt_name) model = node.inputs.ckpt_name;
            }
        });
    }

    // Update State
    currentPromptData.positive.rendered = Array.from(posRendered).join('\n\n') || "No Positive Prompt Found";
    currentPromptData.positive.source = Array.from(posSource).join('\n\n') || "No Source Prompt Found";

    currentPromptData.negative.rendered = Array.from(negRendered).join('\n\n');
    currentPromptData.negative.source = Array.from(negSource).join('\n\n');

    // Render Initial View
    updatePromptDisplay(promptModeSelector.value);

    // Attributes
    if (seed !== 'Unknown') createAttributeTag('Seed', seed);
    if (steps !== 'Unknown') createAttributeTag('Steps', steps);
    if (cfg !== 'Unknown') createAttributeTag('CFG', cfg);
    if (sampler !== 'Unknown') createAttributeTag('Sampler', sampler);
    if (model !== 'Unknown') createAttributeTag('Model', model);

    createAttributeTag('Generator', 'ComfyUI');
}
