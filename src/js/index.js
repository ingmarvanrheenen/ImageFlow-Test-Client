// Quick config presets
function setLocalConfig() {
    document.getElementById('apiUrl').value = 'http://localhost:3000';
    document.getElementById('secretLabel').textContent = 'Proxy Secret';
    document.getElementById('proxySecret').value = 'test-secret';
    document.getElementById('apiUser').value = 'test-user-123';
    document.getElementById('apiSubscription').value = 'BASIC';
    alert('✅ Configured for local development!\n\nMake sure your API is running: npm run dev');
}

function setProductionConfig() {
    // Already pre-filled with Render URL
    document.getElementById('apiUrl').value = 'https://imageflow-api.onrender.com';
    document.getElementById('secretLabel').textContent = 'Proxy Secret';

    const secret = prompt('Enter your RapidAPI Proxy Secret:\n\nGet it from:\n1. Render Dashboard → Your Service → Environment\n2. Or RapidAPI Dashboard → Your API → Settings', '');
    if (secret) {
        document.getElementById('proxySecret').value = secret;
        document.getElementById('apiUser').value = 'test-user-123';
        document.getElementById('apiSubscription').value = 'BASIC';
        alert('✅ Configured for production testing!\n\nYou can now test your live API on Render.');
    }
}

function setRapidApiConfig() {
    let host, key;

    // Use local env if available
    if (typeof LOCAL_ENV !== 'undefined') {
        host = LOCAL_ENV.RAPIDAPI_HOST;
        key = LOCAL_ENV.RAPIDAPI_KEY;
    }

    // Fallback to prompts if not found
    if (!host) {
        host = prompt('Enter RapidAPI Host (e.g., imageflow-api.p.rapidapi.com):');
    }
    if (!host) return;

    document.getElementById('apiUrl').value = `https://${host}`;

    // Update Label for visibility
    document.getElementById('secretLabel').textContent = 'RapidAPI Key';

    if (!key) {
        key = prompt('Enter your RapidAPI Key:', '');
    }

    if (key) {
        document.getElementById('proxySecret').value = key;
        document.getElementById('apiUser').value = 'test-user-123';
        document.getElementById('apiSubscription').value = 'BASIC'; // Ignored by RapidAPI but good for consistency
        alert(`✅ Configured for RapidAPI Proxy!\n\nHost: ${host}`);
    }
}

function getHeaders() {
    const url = document.getElementById('apiUrl').value;
    const isRapidProxy = url.includes('rapidapi.com');
    const secretOrKey = document.getElementById('proxySecret').value;

    if (isRapidProxy) {
        // Extract host from URL
        const host = url.replace('https://', '').replace('http://', '').split('/')[0];
        return {
            'x-rapidapi-key': secretOrKey,
            'x-rapidapi-host': host,
            'useQueryString': 'true'
        };
    }

    return {
        'X-RapidAPI-Proxy-Secret': secretOrKey,
        'X-RapidAPI-User': document.getElementById('apiUser').value,
        'X-RapidAPI-Subscription': document.getElementById('apiSubscription').value
    };
}

function getBaseUrl() {
    return document.getElementById('apiUrl').value;
}

function updateFileName(inputId, displayId) {
    const input = document.getElementById(inputId);
    const display = document.getElementById(displayId);
    if (input.files.length > 0) {
        display.textContent = `Selected: ${input.files[0].name}`;
    }
}

function displayResponse(data, status) {
    const statusBadge = document.getElementById('statusBadge');
    const responseContent = document.getElementById('responseContent');
    const imagePreview = document.getElementById('imagePreview');

    statusBadge.style.display = 'block';
    statusBadge.textContent = `Status: ${status}`;
    statusBadge.className = `status-badge ${status < 400 ? 'status-success' : 'status-error'}`;

    responseContent.textContent = JSON.stringify(data, null, 2);

    // Clear previous image
    imagePreview.innerHTML = '';

    // Show image if present
    if (data.data && (data.data.qrcode || data.data.image)) {
        const imgSrc = data.data.qrcode || data.data.image;
        imagePreview.innerHTML = `<img src="${imgSrc}" alt="Result">`;
    }
}

async function testHealth() {
    try {
        const response = await fetch(`${getBaseUrl()}/health`, {
            headers: getHeaders()
        });
        const data = await response.json();
        displayResponse(data, response.status);
    } catch (error) {
        displayResponse({ error: error.message }, 500);
    }
}

async function generateQRCode() {
    try {
        const response = await fetch(`${getBaseUrl()}/api/v1/qrcode/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getHeaders()
            },
            body: JSON.stringify({
                data: document.getElementById('qrData').value,
                size: parseInt(document.getElementById('qrSize').value),
                format: 'png'
            })
        });
        const data = await response.json();
        displayResponse(data, response.status);
    } catch (error) {
        displayResponse({ error: error.message }, 500);
    }
}

async function readQRCode() {
    const fileInput = document.getElementById('qrImage');
    if (!fileInput.files[0]) {
        alert('Please select an image file');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);

        const response = await fetch(`${getBaseUrl()}/api/v1/qrcode/read`, {
            method: 'POST',
            headers: getHeaders(),
            body: formData
        });
        const data = await response.json();
        displayResponse(data, response.status);
    } catch (error) {
        displayResponse({ error: error.message }, 500);
    }
}

async function optimizeImage() {
    const fileInput = document.getElementById('optimizeImage');
    if (!fileInput.files[0]) {
        alert('Please select an image file');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        formData.append('quality', document.getElementById('optimizeQuality').value);

        const maxWidth = document.getElementById('optimizeMaxWidth').value;
        if (maxWidth) {
            formData.append('maxWidth', maxWidth);
        }

        const response = await fetch(`${getBaseUrl()}/api/v1/image/optimize`, {
            method: 'POST',
            headers: getHeaders(),
            body: formData
        });
        const data = await response.json();
        displayResponse(data, response.status);
    } catch (error) {
        displayResponse({ error: error.message }, 500);
    }
}

async function convertImage() {
    const fileInput = document.getElementById('convertImage');
    if (!fileInput.files[0]) {
        alert('Please select an image file');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        formData.append('outputFormat', document.getElementById('convertFormat').value);

        const response = await fetch(`${getBaseUrl()}/api/v1/image/convert`, {
            method: 'POST',
            headers: getHeaders(),
            body: formData
        });
        const data = await response.json();
        displayResponse(data, response.status);
    } catch (error) {
        displayResponse({ error: error.message }, 500);
    }
}

// Keep your existing setLocalConfig, setProductionConfig, getHeaders, and updateFileName as they are.

function displayResponse(data, status) {
    const statusBadge = document.getElementById('statusBadge');
    const responseContent = document.getElementById('responseContent');
    const imagePreview = document.getElementById('imagePreview');

    // 1. Update Status UI
    statusBadge.style.display = 'inline-block';
    statusBadge.textContent = `HTTP ${status}`;
    statusBadge.className = `status-pill ${status < 400 ? 'status-success' : 'status-error'}`;

    // 2. Pretty print the raw JSON in the console
    responseContent.textContent = JSON.stringify(data, null, 2);

    // 3. Clear previous preview
    imagePreview.innerHTML = '';

    if (!data.success) return;

    // 4. Handle Text-based Data (QR Read Output)
    if (data.data && data.data.decoded) {
        const resultBox = document.createElement('div');
        resultBox.style.padding = '20px';
        resultBox.style.color = '#4ade80';
        resultBox.style.border = '1px solid #334155';
        resultBox.style.borderRadius = '8px';
        resultBox.style.background = '#1e293b';

        resultBox.innerHTML = `
            <div style="font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px;">Decoded Content:</div>
            <div style="font-family: 'JetBrains Mono', monospace; word-break: break-all; font-size: 1.1rem;">${data.data.data}</div>
        `;
        imagePreview.appendChild(resultBox);
    }

    // 5. Handle Image/QR Rendering (Optimization, Generation, Conversion)
    const rawImage = data.data?.image || data.data?.qrcode;
    if (rawImage) {
        if (rawImage.includes('<svg')) {
            imagePreview.innerHTML = rawImage;
        } else {
            const img = document.createElement('img');
            img.src = rawImage.startsWith('data:') ? rawImage : `data:image/png;base64,${rawImage}`;
            imagePreview.appendChild(img);
        }
    }
}

// Optimized Endpoint Functions
async function testHealth() {
    try {
        const response = await fetch(`${getBaseUrl()}/health`, { headers: getHeaders() });
        const data = await response.json();
        displayResponse(data, response.status);
    } catch (error) {
        displayResponse({ success: false, error: error.message }, 500);
    }
}

async function generateQRCode() {
    const payload = {
        data: document.getElementById('qrData').value,
        size: parseInt(document.getElementById('qrSize').value),
        format: 'base64' // Use base64 for direct browser rendering
    };

    try {
        const response = await fetch(`${getBaseUrl()}/api/v1/qrcode/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getHeaders() },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        displayResponse(data, response.status);
    } catch (error) {
        displayResponse({ success: false, error: error.message }, 500);
    }
}

async function readQRCode() {
    const fileInput = document.getElementById('qrImage');
    if (!fileInput.files[0]) return alert('Select a QR image');

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        const response = await fetch(`${getBaseUrl()}/api/v1/qrcode/read`, {
            method: 'POST',
            headers: getHeaders(), // No Content-Type header! Browser sets it for FormData
            body: formData
        });
        const data = await response.json();
        displayResponse(data, response.status);
    } catch (error) {
        displayResponse({ success: false, error: error.message }, 500);
    }
}

async function optimizeImage() {
    const fileInput = document.getElementById('optimizeImage');
    if (!fileInput.files[0]) return alert('Select an image');

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('quality', document.getElementById('optimizeQuality').value);

    const maxWidth = document.getElementById('optimizeMaxWidth').value;
    if (maxWidth) formData.append('maxWidth', maxWidth);

    try {
        const response = await fetch(`${getBaseUrl()}/api/v1/image/optimize`, {
            method: 'POST',
            headers: getHeaders(),
            body: formData
        });
        const data = await response.json();
        displayResponse(data, response.status);
    } catch (error) {
        displayResponse({ success: false, error: error.message }, 500);
    }
}

async function convertImage() {
    const fileInput = document.getElementById('convertImage');
    if (!fileInput.files[0]) return alert('Select an image');

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('outputFormat', document.getElementById('convertFormat').value);

    try {
        const response = await fetch(`${getBaseUrl()}/api/v1/image/convert`, {
            method: 'POST',
            headers: getHeaders(),
            body: formData
        });
        const data = await response.json();
        displayResponse(data, response.status);
    } catch (error) {
        displayResponse({ success: false, error: error.message }, 500);
    }
}

function toggleWatermarkInputs() {
    const type = document.getElementById('watermarkType').value;
    const textInput = document.getElementById('wmTextInput');
    const imageInput = document.getElementById('wmImageInput');

    if (type === 'text') {
        textInput.style.display = 'block';
        imageInput.style.display = 'none';
        document.getElementById('wmResizeOptions').style.display = 'none';
    } else {
        textInput.style.display = 'none';
        imageInput.style.display = 'block';
        document.getElementById('wmResizeOptions').style.display = 'block';
    }
}

async function applyWatermark() {
    const fileInput = document.getElementById('watermarkMainImage');
    if (!fileInput.files[0]) return alert('Select a base image');

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('position', document.getElementById('watermarkPosition').value);
    formData.append('opacity', document.getElementById('watermarkOpacity').value);

    const type = document.getElementById('watermarkType').value;

    if (type === 'text') {
        const text = document.getElementById('watermarkText').value;
        if (!text) return alert('Enter watermark text');
        formData.append('watermarkText', text);
        formData.append('fontSize', document.getElementById('watermarkFontSize').value);
        formData.append('fontColor', document.getElementById('watermarkColor').value);
    } else {
        const wmInput = document.getElementById('watermarkOverlayImage');
        if (!wmInput.files[0]) return alert('Select a watermark image');
        formData.append('watermarkImage', wmInput.files[0]);

        // Add Resize Options for Image
        const fullScreen = document.getElementById('watermarkFullScreen').checked;
        formData.append('watermarkFullScreen', fullScreen);

        if (!fullScreen) {
            const width = document.getElementById('watermarkWidth').value;
            const height = document.getElementById('watermarkHeight').value;
            if (width) formData.append('watermarkWidth', width);
            if (height) formData.append('watermarkHeight', height);
        }
    }

    try {
        const response = await fetch(`${getBaseUrl()}/api/v1/image/watermark`, {
            method: 'POST',
            headers: getHeaders(),
            body: formData
        });
        const data = await response.json();
        displayResponse(data, response.status);
    } catch (error) {
        displayResponse({ success: false, error: error.message }, 500);
    }
}

function toggleResizeInputs() {
    const isFull = document.getElementById('watermarkFullScreen').checked;
    const resizeInputs = document.getElementById('wmResizeInputs');
    if (isFull) {
        resizeInputs.style.display = 'none';
    } else {
        resizeInputs.style.display = 'grid';
    }
}