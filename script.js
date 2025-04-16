const boneGraftChart = document.getElementById("boneGraftChart");
const curettageChart = document.getElementById("curettageChart");
const boneGraftOutput = document.getElementById("boneGraftOutput");
const curettageOutput = document.getElementById("curettageOutput");
const clearBtn = document.getElementById("clearBtn");

// Mapping of tooth numbers to cleaned anatomical names (no "Upper" or "Lower")
const toothNames = {
    1: "right third molar", 2: "right second molar", 3: "right first molar",
    4: "right second premolar", 5: "right first premolar", 6: "right canine",
    7: "right lateral incisor", 8: "right central incisor", 9: "left central incisor",
    10: "left lateral incisor", 11: "left canine", 12: "left first premolar",
    13: "left second premolar", 14: "left first molar", 15: "left second molar",
    16: "left third molar", 17: "left third molar", 18: "left second molar",
    19: "left first molar", 20: "left second premolar", 21: "left first premolar",
    22: "left canine", 23: "left lateral incisor", 24: "left central incisor",
    25: "right central incisor", 26: "right lateral incisor", 27: "right canine",
    28: "right first premolar", 29: "right second premolar", 30: "right first molar",
    31: "right second molar", 32: "right third molar"
};

// Descriptors and sentence structures for Bone Graft and Excision/Curettage
const graftingStructures = [
    "in and on the defect of the {tooth}",
    "on the crest and lateral ridge deficiency of the {tooth}",
    "in the defect of the interalveolar septum of the {tooth}",
    "in and on the deficiency of the {tooth}",
    "in the deficiency of the {tooth}",
    "on the alveolar jugum of the {tooth}"
];

const curettageStructures = [
    "in the apex of the {tooth}",
    "apical to the {tooth}",
    "apical and lateral to the {tooth}",
    "medial to the apex of the {tooth}",
    "lateral to the apex of the {tooth}",
    "{tooth} apex"
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
        const structure = getRandomElement(graftingStructures, "on the crest of ridge defect near the {tooth}");
        descriptionText = structure.replace("{tooth}", toothName);
    } else if (type === "curettage") {
        const structure = getRandomElement(curettageStructures, "lateral to the apex of the {tooth}");
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

// initialize tooth charts
createToothChart(boneGraftChart, "boneGraft", boneGraftOutput);
createToothChart(curettageChart, "curettage", curettageOutput);
