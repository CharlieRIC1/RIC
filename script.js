// FULLY RESTORED script.js (fixed missing curettage, copy button, selectedTeeth, and dynamic clearing)

const boneGraftChart = document.getElementById("boneGraftChart");
const curettageChart = document.getElementById("curettageChart");
const boneGraftOutput = document.getElementById("boneGraftOutput");
const curettageOutput = document.getElementById("curettageOutput");
const clearBtn = document.getElementById("clearBtn");
const toothPresentSwitch = document.getElementById("toothPresentSwitch");

const toothNames = {
  1: "right third molar", 2: "right second molar", 3: "right first molar", 4: "right second premolar", 5: "right first premolar",
  6: "right canine", 7: "right lateral incisor", 8: "right central incisor", 9: "left central incisor", 10: "left lateral incisor",
  11: "left canine", 12: "left first premolar", 13: "left second premolar", 14: "left first molar", 15: "left second molar",
  16: "left third molar", 17: "left third molar", 18: "left second molar", 19: "left first molar", 20: "left second premolar",
  21: "left first premolar", 22: "left canine", 23: "left lateral incisor", 24: "left central incisor", 25: "right central incisor",
  26: "right lateral incisor", 27: "right canine", 28: "right first premolar", 29: "right second premolar", 30: "right first molar",
  31: "right second molar", 32: "right third molar"
};

const graftingDescriptionsByTooth = {};
for (let i = 1; i <= 32; i++) {
  graftingDescriptionsByTooth[i] = [
    `on the crestal defect of the ${toothNames[i]}`,
    `on the crest and lateral ridge deficiency of the ${toothNames[i]}`,
    `in the defect of the interalveolar septum of the ${toothNames[i]}`,
    `on the lateral ridge defect of the ${toothNames[i]}`,
    `in and on the lateral ridge defect of the ${toothNames[i]}`,
    `lateral ridge defect of the ${toothNames[i]}`,
    `in the deficiency of the interalveolar septum of the ${toothNames[i]}`,
    `on the crest and lateral ridge deformity of the ${toothNames[i]}`,
    `on the crest and lateral ridge defect of the ${toothNames[i]}`,
    `in the deformity of the interalveolar septum of the ${toothNames[i]}`
  ];
}

const curettageStructures = [
  "in the apex of the {tooth}",
  "apical to the {tooth}",
  "apical and lateral to the {tooth}",
  "medial to the apex of the {tooth}",
  "lateral to the apex of the {tooth}",
  "{tooth} apex"
];

let selectedTeeth = { boneGraft: new Set(), curettage: new Set() };
let previousDescriptions = {};

function getRandomElement(array) {
  return array && array.length > 0 ? array[Math.floor(Math.random() * array.length)] : "";
}

function createDescriptionCard(tooth, type, container) {
  const toothName = toothNames[tooth] || `Tooth ${tooth}`;
  let descriptionText = "";

  if (type === "boneGraft") {
    const allDescriptions = graftingDescriptionsByTooth[tooth] || [];
    let availableDescriptions;

    if (toothPresentSwitch.checked) {
      availableDescriptions = allDescriptions;
    } else {
      availableDescriptions = allDescriptions.filter((desc, idx) => ![2, 6, 9].includes(idx));
    }

    descriptionText = getRandomElement(availableDescriptions);
  } else if (type === "curettage") {
    const structure = getRandomElement(curettageStructures);
    descriptionText = structure.replace(/{tooth}/g, toothName);
  }

  previousDescriptions[tooth] = descriptionText;

  const card = document.createElement("div");
  card.classList.add("output-card");
  card.setAttribute("data-tooth", tooth);
  card.style.background = toothPresentSwitch.checked 
    ? "linear-gradient(135deg, #d0f0fd, #e0f7fa)" 
    : "linear-gradient(135deg, #ffd6d6, #ffe0e0)";
  card.style.borderRadius = "12px";
  card.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
  card.style.padding = "16px";
  card.style.marginBottom = "12px";
  card.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";

  card.addEventListener("mouseenter", () => {
    card.style.transform = "scale(1.03)";
    card.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "scale(1)";
    card.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
  });

  card.innerHTML = `
    <span class="tooth-number">${tooth}</span>
    <span class="description-text">${descriptionText}</span>
    <button class="copy-btn">Copy</button>
  `;

  const copyBtn = card.querySelector(".copy-btn");
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(descriptionText).then(() => {
      copyBtn.textContent = "Copied!";
      copyBtn.style.backgroundColor = "#28a745";
      copyBtn.disabled = true;
    });
  });

  container.appendChild(card);
}

function removeDescriptionCard(tooth, container) {
  const cards = container.querySelectorAll(".output-card");
  cards.forEach(card => {
    if (card.getAttribute("data-tooth") == tooth) {
      card.remove();
    }
  });
  delete previousDescriptions[tooth];
}

function clearOutputs() {
  selectedTeeth.boneGraft.clear();
  selectedTeeth.curettage.clear();

  document.querySelectorAll(".tooth").forEach(button => button.classList.remove("selected"));

  boneGraftOutput.innerHTML = "";
  curettageOutput.innerHTML = "";

  previousDescriptions = {};
}

clearBtn.addEventListener("click", clearOutputs);

function createToothChart(chart, type, outputContainer) {
  chart.style.gridTemplateColumns = "repeat(11, 1fr)";
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

createToothChart(boneGraftChart, "boneGraft", boneGraftOutput);
createToothChart(curettageChart, "curettage", curettageOutput);