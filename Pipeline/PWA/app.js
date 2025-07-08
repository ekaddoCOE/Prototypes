// DOM elements
const buildingSelect = document.getElementById('building');
const roomInput = document.getElementById('room');
const computerTypeSelect = document.getElementById('computerType');
const serialInput = document.getElementById('serial');
const form = document.getElementById('nameGeneratorForm');
const resultDiv = document.getElementById('result');
const generatedNameDiv = document.getElementById('generatedName');
const copyButton = document.getElementById('copyButton');
const copyFeedback = document.getElementById('copyFeedback');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    populateBuildingDropdown();
    setupEventListeners();
});

// Populate building dropdown with data from data.js
function populateBuildingDropdown() {
    buildingSelect.innerHTML = '<option value="">Select a building...</option>';
    BUILDINGS.forEach(building => {
        if (building.name.trim() === '') return;
        const option = document.createElement('option');
        option.value = building.code;
        option.textContent = `${building.code} - ${building.name}`;
        buildingSelect.appendChild(option);
    });
}

// Setup event listeners
function setupEventListeners() {
    form.addEventListener('submit', handleFormSubmit);
    copyButton.addEventListener('click', copyToClipboard);

    roomInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
    });

    serialInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.trim();
    });
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    const building = buildingSelect.value;
    const room = roomInput.value;
    const computerType = computerTypeSelect.value;
    const serial = serialInput.value;

    if (!building || !room || !computerType || !serial || serial.replace(/\s/g, '').length < 5) {
        alert('Please fill out all fields. The serial number must be at least 5 characters.');
        return;
    }

    const computerName = generateComputerName(building, room, computerType, serial);
    displayResult(computerName);
}

// Generate computer name
function generateComputerName(building, room, computerType, serial) {
    const paddedRoom = room.padStart(4, '0');
    const serialFirst5 = serial.replace(/\s/g, '').slice(0, 5).toUpperCase();
    return `${computerType}${building}${paddedRoom}${serialFirst5}`;
}

// Display the generated result
function displayResult(computerName) {
    generatedNameDiv.textContent = computerName;
    resultDiv.classList.remove('hidden');
    copyFeedback.classList.add('hidden');
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Copy to clipboard functionality
async function copyToClipboard() {
    const computerName = generatedNameDiv.textContent;
    try {
        await navigator.clipboard.writeText(computerName);
        showCopyFeedback();
    } catch (err) {
        console.error('Copy failed:', err);
        alert('Failed to copy. Please copy the text manually.');
    }
}

// Show copy feedback
function showCopyFeedback() {
    copyFeedback.classList.remove('hidden');
    setTimeout(() => {
        copyFeedback.classList.add('hidden');
    }, 2000);
}