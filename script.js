const demoUser = { username: 'provider', password: 'care' };
const requiredFields = [
  'patientName', 'patientDob', 'dateOfService', 'timeOfService', 'mrn', 'location', 'referring', 'supervising',
  'chiefComplaint', 'hpi', 'psh', 'symptoms',
  'vitals', 'exam', 'diagnostics', 'functional',
  'assessment', 'diagnoses', 'necessity',
  'planGoals', 'planSteps', 'planVerification', 'prognosis'
];

const sections = ['subjective', 'objective', 'assessment', 'plan', 'billing'];

const loginGate = document.getElementById('loginGate');
const app = document.getElementById('app');
const loginForm = document.getElementById('loginForm');
const saveDraft = document.getElementById('saveDraft');
const printNote = document.getElementById('printNote');
const logout = document.getElementById('logout');
const completionSummary = document.getElementById('completionSummary');
const previewContent = document.getElementById('previewContent');

function getFormData() {
  const data = {};
  requiredFields.forEach(id => {
    const element = document.getElementById(id);
    data[id] = element ? element.value : '';
  });
  const visitType = document.querySelector('input[name="visitType"]:checked');
  data.visitType = visitType ? visitType.value : '';
  data.addendum = document.getElementById('addendum').value || '';
  data.attest = document.getElementById('attest').checked;
  return data;
}

function populateForm(data) {
  if (!data) return;
  Object.keys(data).forEach(key => {
    const el = document.getElementById(key);
    if (el) {
      if (el.type === 'checkbox') {
        el.checked = data[key];
      } else {
        el.value = data[key];
      }
    }
  });
  if (data.visitType) {
    const radio = document.querySelector(`input[name="visitType"][value="${data.visitType}"]`);
    if (radio) radio.checked = true;
  }
}

function saveToLocalStorage() {
  const payload = getFormData();
  localStorage.setItem('ric-note-data', JSON.stringify(payload));
}

function loadFromLocalStorage() {
  const stored = localStorage.getItem('ric-note-data');
  if (stored) {
    populateForm(JSON.parse(stored));
    validateAllSections();
    renderPreview();
  }
}

function authenticate(username, password) {
  return username === demoUser.username && password === demoUser.password;
}

loginForm.addEventListener('submit', event => {
  event.preventDefault();
  const username = document.getElementById('loginUser').value.trim();
  const password = document.getElementById('loginPass').value.trim();

  if (authenticate(username, password)) {
    localStorage.setItem('ric-auth', 'true');
    loginGate.classList.add('hidden');
    app.classList.remove('hidden');
    loadFromLocalStorage();
  } else {
    alert('Invalid credentials. Use provider / care for demo access.');
  }
});

logout.addEventListener('click', () => {
  localStorage.removeItem('ric-auth');
  app.classList.add('hidden');
  loginGate.classList.remove('hidden');
});

saveDraft.addEventListener('click', () => {
  saveToLocalStorage();
  alert('Draft saved locally on this device.');
});

printNote.addEventListener('click', () => {
  if (validateAllSections(true)) {
    window.print();
  }
});

function validateSection(section) {
  let valid = true;
  const sectionEl = document.querySelector(`[data-section="${section}"]`);
  const statusEl = document.getElementById(`status-${section}`);

  if (section === 'billing') {
    const visitType = document.querySelector('input[name="visitType"]:checked');
    const attest = document.getElementById('attest').checked;
    valid = Boolean(visitType) && attest;
  } else {
    const fields = sectionEl.querySelectorAll('[required]');
    fields.forEach(field => {
      if (!field.value.trim()) {
        valid = false;
      }
    });
  }

  statusEl.textContent = valid ? 'Complete' : 'Incomplete';
  statusEl.classList.toggle('complete', valid);
  return valid;
}

function validateAllSections(showAlerts = false) {
  let complete = 0;
  let allValid = true;
  sections.forEach(section => {
    const valid = validateSection(section);
    if (valid) complete += 1; else allValid = false;
  });
  completionSummary.textContent = `${complete}/${sections.length} sections complete`;
  if (showAlerts && !allValid) {
    alert('Please complete all required sections before printing.');
  }
  return allValid;
}

function renderPreview() {
  const data = getFormData();
  const visitLabel = data.visitType || '—';
  const attestLabel = data.attest ? 'Yes' : 'No';

  previewContent.innerHTML = `
    <div class="preview-grid">
      <div>
        <p class="eyebrow">Patient</p>
        <p><strong>${data.patientName || '—'}</strong></p>
        <p>DOB: ${data.patientDob || '—'}</p>
        <p>DOS: ${data.dateOfService || '—'} @ ${data.timeOfService || '—'}</p>
        <p>MRN: ${data.mrn || '—'}</p>
        <p>Location: ${data.location || '—'}</p>
      </div>
      <div>
        <p class="eyebrow">Providers</p>
        <p>Referring: ${data.referring || '—'}</p>
        <p>Supervising: ${data.supervising || '—'}</p>
        <p>Visit type: ${visitLabel}</p>
        <p>Attested: ${attestLabel}</p>
      </div>
    </div>
    <div class="preview-columns">
      <div>
        <h4>Subjective</h4>
        <p><strong>Chief Complaint</strong><br>${data.chiefComplaint || '—'}</p>
        <p><strong>HPI</strong><br>${data.hpi || '—'}</p>
        <p><strong>Past Surgical History</strong><br>${data.psh || '—'}</p>
        <p><strong>Symptoms</strong><br>${data.symptoms || '—'}</p>
      </div>
      <div>
        <h4>Objective</h4>
        <p><strong>Vitals</strong><br>${data.vitals || '—'}</p>
        <p><strong>Exam</strong><br>${data.exam || '—'}</p>
        <p><strong>Diagnostics</strong><br>${data.diagnostics || '—'}</p>
        <p><strong>Functional Impact</strong><br>${data.functional || '—'}</p>
      </div>
    </div>
    <div class="preview-columns">
      <div>
        <h4>Assessment</h4>
        <p>${data.assessment || '—'}</p>
        <p><strong>Diagnoses / Codes</strong><br>${data.diagnoses || '—'}</p>
        <p><strong>Medical Necessity</strong><br>${data.necessity || '—'}</p>
      </div>
      <div>
        <h4>Plan</h4>
        <p><strong>Goals</strong><br>${data.planGoals || '—'}</p>
        <p><strong>Steps</strong><br>${data.planSteps || '—'}</p>
        <p><strong>Verification</strong><br>${data.planVerification || '—'}</p>
        <p><strong>Prognosis</strong><br>${data.prognosis || '—'}</p>
        <p><strong>Notes</strong><br>${data.planNotes || '—'}</p>
        <p><strong>Addendum</strong><br>${data.addendum || '—'}</p>
      </div>
    </div>
  `;
}

function handleAccordion() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const body = header.nextElementSibling;
      body.classList.toggle('open');
    });
  });
}

function bindFormListeners() {
  document.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('input', () => {
      validateAllSections();
      renderPreview();
    });
    el.addEventListener('blur', saveToLocalStorage);
  });
}

(function bootstrap() {
  handleAccordion();
  bindFormListeners();
  renderPreview();
  validateAllSections();

  if (localStorage.getItem('ric-auth') === 'true') {
    loginGate.classList.add('hidden');
    app.classList.remove('hidden');
    loadFromLocalStorage();
  }
})();
