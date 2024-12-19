const boneGraftChart = document.getElementById("boneGraftChart");
const curettageChart = document.getElementById("curettageChart");
const boneGraftOutput = document.getElementById("boneGraftOutput");
const curettageOutput = document.getElementById("curettageOutput");
const clearBtn = document.getElementById("clearBtn");

// Mapping of tooth numbers to cleaned anatomical names (no "Upper" or "Lower")
const toothNames = {
    1: "Right Third Molar", 2: "Right Second Molar", 3: "Right First Molar",
    4: "Right Second Premolar", 5: "Right First Premolar", 6: "Right Canine",
    7: "Right Lateral Incisor", 8: "Right Central Incisor", 9: "Left Central Incisor",
    10: "Left Lateral Incisor", 11: "Left Canine", 12: "Left First Premolar",
    13: "Left Second Premolar", 14: "Left First Molar", 15: "Left Second Molar",
    16: "Left Third Molar", 17: "Left Third Molar", 18: "Left Second Molar",
    19: "Left First Molar", 20: "Left Second Premolar", 21: "Left First Premolar",
    22: "Left Canine", 23: "Left Lateral Incisor", 24: "Left Central Incisor",
    25: "Right Central Incisor", 26: "Right Lateral Incisor", 27: "Right Canine",
    28: "Right First Premolar", 29: "Right Second Premolar", 30: "Right First Molar",
    31: "Right Second Molar", 32: "Right Third Molar"
};

// Descriptors and sentence structures for Bone Graft and Excision/Curettage
const graftingStructures = [
    "In and on the defect of the {tooth}",
    "On the crest and lateral ridge deficiency of the {tooth}",
    "In the defect of the interalveolar septum of the {tooth}",
    "In and on the deficiency of the {tooth}",
    "In the deficiency of the {tooth}",
    "On the alveolar jugum of the {tooth}"
];

const curettageStructures = [
    "In the apex of the {tooth}",
    "Apical to the {tooth}",
    "Apical and lateral to the {tooth}",
    "Medial to the apex of the {tooth}",
    "Lateral to the apex of the {tooth}",
    "{tooth} Apex"
];

// Selected teeth
let selectedTeeth = { boneGraft: new Set(), curettage: new Set() };
let previousDescriptions = {}; // Store previous descriptions

// Safely get a random value from an array
function getRandomElement(array, fallback) {
    return array && array.length > 0 ? array[Math.floor(Math.random() * array.length)] : fallback;
}

// Function to create tooth charts
function createToothChart(chart, type, outputContainer) {
    chart.style.gridTemplateColumns = "repeat(11, 1fr)"; // Adjust grid to 3 rows
    for (let i = 1; i <= 32; i++) {
        const btn = document.createElement("div");
        btn.classList.add("tooth");
        btn.textContent = i;

        btn.addEventListener("click", () => {
            if (selectedTeeth[type].has(i)) {
                selectedTeeth[type].delete(i);
                btn.classList.remove("selected");
                removeDescriptionCard(i, outputContainer);
            } else {
                selectedTeeth[type].add(i);
                btn.classList.add("selected");
                createDescriptionCard(i, type, outputContainer);
            }
        });

        chart.appendChild(btn);
    }
}

// Function to create description cards instantly
function createDescriptionCard(tooth, type, container) {
    const toothName = toothNames[tooth] || `Tooth ${tooth}`; // Default tooth name if missing
    let descriptionText;

    if (type === "boneGraft") {
        const structure = getRandomElement(graftingStructures, "On the crest of ridge defect near the {tooth}");
        descriptionText = structure.replace("{tooth}", toothName);
    } else if (type === "curettage") {
        const structure = getRandomElement(curettageStructures, "Lateral to the apex of the {tooth}");
        descriptionText = structure.replace("{tooth}", toothName);
    } else {
        descriptionText = `No valid description for ${toothName}`;
    }

    // Ensure description is always generated, even for the first click
    if (!previousDescriptions[tooth]) {
        previousDescriptions[tooth] = descriptionText;
    } else {
        // Always use the current description for consistency
        previousDescriptions[tooth] = descriptionText;
    }

    // Create the output card
    const card = document.createElement("div");
    card.classList.add("output-card");
    card.setAttribute("data-tooth", tooth);
    card.innerHTML = `
        <span class="tooth-number">${tooth}</span>
        <span class="description-text">${descriptionText}</span>
        <button class="copy-btn">Copy</button>
    `;

    // Copy to clipboard with visual confirmation
    const copyBtn = card.querySelector(".copy-btn");
    copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(descriptionText).then(() => {
            copyBtn.textContent = "Copied!";
            copyBtn.style.backgroundColor = "#28a745"; // Green color
            copyBtn.disabled = true;
        });
    });

    container.appendChild(card);
}

// Remove description card when tooth is deselected
function removeDescriptionCard(tooth, container) {
    const cards = container.querySelectorAll(".output-card");
    cards.forEach(card => {
        if (card.getAttribute("data-tooth") == tooth) {
            card.remove();
        }
    });
    delete previousDescriptions[tooth];
}

// Clear all selections and outputs
clearBtn.addEventListener("click", () => {
    selectedTeeth.boneGraft.clear();
    selectedTeeth.curettage.clear();

    // Clear all charts
    const allToothButtons = document.querySelectorAll(".tooth");
    allToothButtons.forEach(button => button.classList.remove("selected"));

    // Clear outputs
    boneGraftOutput.innerHTML = "";
    curettageOutput.innerHTML = "";

    // Reset descriptions
    previousDescriptions = {};
});

// Initialize tooth charts
createToothChart(boneGraftChart, "boneGraft", boneGraftOutput);
createToothChart(curettageChart, "curettage", curettageOutput);
