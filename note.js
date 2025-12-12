const demoUser = { username: 'provider', password: 'care' };
const requiredFields = [
  'patientName', 'patientDob', 'dateOfService', 'timeOfService', 'mrn', 'location', 'referring', 'supervising',
  'symptomDurationYears', 'painScore', 'chronicPainYears', 'conservativeDuration',
  'vitalDate', 'bp', 'heartRate', 'temperature', 'height', 'weight', 'bmi', 'spo2', 'inhaled', 'neck', 'headCirc', 'vitalComments',
  'orofacialPain', 'headPain', 'masticationPain', 'migrainePain',
  'maxOpeningRight', 'maxOpeningLeft', 'maxOpeningDeviation', 'maxOpeningProtrusive', 'overbite', 'overjet', 'reverseOverjet',
  'objectiveInfo', 'objectiveNotes', 'objectiveNotes2', 'periapicalLocation',
  'diagnostics', 'functional', 'imaging',
  'primaryDiagnosis', 'assessment', 'necessity',
  'planGoals', 'planVerification', 'followupInterval', 'prognosis', 'billingCode',
  'cephCompleted', 'panoCompleted', 'cephRecommended', 'panoRecommended',
  'cbctTeethCompleted', 'cbctSinusesCompleted', 'cbctFacialCompleted',
  'cbctTeethRecommended', 'cbctSinusesRecommended', 'cbctFacialRecommended'
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
    if (element) {
      data[id] = element.type === 'checkbox' ? element.checked : element.value;
    } else {
      data[id] = '';
    }
  });
  const visitType = document.querySelector('input[name="visitType"]:checked');
  data.visitType = visitType ? visitType.value : '';
  const painPattern = document.querySelector('input[name="painPattern"]:checked');
  data.painPattern = painPattern ? painPattern.value : '';
  const symptomCourse = document.querySelector('input[name="symptomCourse"]:checked');
  data.symptomCourse = symptomCourse ? symptomCourse.value : '';
  const symptomStatus = document.querySelector('input[name="symptomStatus"]:checked');
  data.symptomStatus = symptomStatus ? symptomStatus.value : '';
  const painFrequency = document.querySelector('input[name="painFrequency"]:checked');
  data.painFrequency = painFrequency ? painFrequency.value : '';
  data.addendum = document.getElementById('addendum').value || '';
  data.attest = document.getElementById('attest').checked;
  data.chiefComplaints = getCheckedValues('chiefComplaints');
  data.onsetMechanism = getCheckedValues('onsetMechanism');
  data.onsetSpeed = getCheckedValues('onsetSpeed');
  data.conservativeTherapies = getCheckedValues('conservativeTherapies');
  data.examFinding = getCheckedValues('examFinding');
  data.painQuality = getCheckedValues('painQuality');
  data.painConsistency = getCheckedValues('painConsistency');
  data.painExperience = getCheckedValues('painExperience');
  data.dailyDifficulty = getCheckedValues('dailyDifficulty');
  data.abscessQuadrant = getCheckedValues('abscessQuadrant');
  data.supportingDiagnosis = getCheckedValues('supportingDiagnosis');
  data.planProcedures = getCheckedValues('planProcedures');
  data.planAdjuncts = getCheckedValues('planAdjuncts');
  const authNeeded = document.querySelector('input[name="authNeeded"]:checked');
  data.authNeeded = authNeeded ? authNeeded.value : '';
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
    if (['chiefComplaints', 'onsetMechanism', 'onsetSpeed', 'conservativeTherapies', 'examFinding', 'painQuality', 'painConsistency', 'painExperience', 'dailyDifficulty', 'abscessQuadrant', 'supportingDiagnosis', 'planProcedures', 'planAdjuncts'].includes(key)) {
      document.querySelectorAll(`input[name="${key}"]`).forEach(input => {
        input.checked = Array.isArray(data[key]) && data[key].includes(input.value);
      });
    }
  });
  if (data.visitType) {
    const radio = document.querySelector(`input[name="visitType"][value="${data.visitType}"]`);
    if (radio) radio.checked = true;
  }
  if (data.painPattern) {
    const radio = document.querySelector(`input[name="painPattern"][value="${data.painPattern}"]`);
    if (radio) radio.checked = true;
  }
  if (data.symptomCourse) {
    const radio = document.querySelector(`input[name="symptomCourse"][value="${data.symptomCourse}"]`);
    if (radio) radio.checked = true;
  }
  if (data.symptomStatus) {
    const radio = document.querySelector(`input[name="symptomStatus"][value="${data.symptomStatus}"]`);
    if (radio) radio.checked = true;
  }
  if (data.painFrequency) {
    const radio = document.querySelector(`input[name="painFrequency"][value="${data.painFrequency}"]`);
    if (radio) radio.checked = true;
  }
  if (data.authNeeded) {
    const radio = document.querySelector(`input[name="authNeeded"][value="${data.authNeeded}"]`);
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
    syncPainScoreLabel();
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
    const billingCode = document.getElementById('billingCode').value.trim();
    const authNeeded = document.querySelector('input[name="authNeeded"]:checked');
    valid = Boolean(visitType) && attest && billingCode && authNeeded;
  } else {
    const fields = sectionEl.querySelectorAll('[required]');
    fields.forEach(field => {
      if (!field.value.trim()) {
        valid = false;
      }
    });
    const requiredGroups = sectionEl.querySelectorAll('[data-required-group]');
    requiredGroups.forEach(group => {
      const name = group.dataset.requiredGroup;
      const anyChecked = group.querySelectorAll(`input[name="${name}"]`).length
        ? Array.from(group.querySelectorAll(`input[name="${name}"]`)).some(input => input.checked)
        : false;
      if (!anyChecked) valid = false;
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
  const painPatternLabel = data.painPattern || '—';
  const authLabel = data.authNeeded || '—';
  const listOrDash = list => (list && list.length ? list.join(', ') : '—');
  const painQualityLabel = listOrDash(data.painQuality);
  const painConsistencyLabel = listOrDash(data.painConsistency);
  const painExperienceLabel = listOrDash(data.painExperience);
  const dailyDifficultyLabel = listOrDash(data.dailyDifficulty);
  const abscessLabel = listOrDash(data.abscessQuadrant);
  const records = [
    formatRecord('Cephalogram (CPT 70350)', data.cephCompleted, data.cephRecommended),
    formatRecord('Orthopantomagram (CPT 70355)', data.panoCompleted, data.panoRecommended),
    formatRecord('Full mouth x-ray of teeth', data.cbctTeethCompleted, data.cbctTeethRecommended),
    formatRecord('Scan of sinuses (CPT 70486)', data.cbctSinusesCompleted, data.cbctSinusesRecommended),
    formatRecord('Scan of facial bones (CPT 70460)', data.cbctFacialCompleted, data.cbctFacialRecommended)
  ].join('<br>');

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
        <p>CPT: ${data.billingCode || '—'}</p>
        <p>Prior auth: ${authLabel}</p>
        <p>Attested: ${attestLabel}</p>
      </div>
    </div>
    <div class="preview-columns">
      <div>
        <h4>Subjective</h4>
        <p><strong>Chief complaints</strong><br>${listOrDash(data.chiefComplaints)}</p>
        <p><strong>Symptom duration</strong><br>${data.symptomDurationYears || '0'} years ${data.symptomDurationMonths || '0'} months</p>
        <p><strong>Onset of symptoms</strong><br>${listOrDash(data.onsetMechanism)}</p>
        <p><strong>Onset speed</strong><br>${listOrDash(data.onsetSpeed)}</p>
        <p><strong>Course</strong><br>${data.symptomCourse || '—'}</p>
        <p><strong>Current status</strong><br>${data.symptomStatus || '—'}</p>
        <p><strong>Pain severity</strong><br>${data.painScore || '—'}/10 (${painPatternLabel})</p>
        <p><strong>Chronic pain duration</strong><br>${data.chronicPainYears || '0'} years ${data.chronicPainMonths || '0'} months</p>
        <p><strong>Conservative therapies</strong><br>${listOrDash(data.conservativeTherapies)}</p>
        <p><strong>Therapies duration</strong><br>${data.conservativeDuration || '—'}</p>
        <p><strong>Subjective notes</strong><br>${data.symptomNotes || '—'}</p>
      </div>
      <div>
        <h4>Objective</h4>
        <p><strong>Vitals</strong><br>${data.vitalDate || '—'} | BP ${data.bp || '—'}, HR ${data.heartRate || '—'} bpm, Temp ${data.temperature || '—'}°F, SpO₂ ${data.spo2 || '—'}%</p>
        <p><strong>Measurements</strong><br>Height ${data.height || '—'} in, Weight ${data.weight || '—'} lbs, BMI ${data.bmi || '—'}, Neck ${data.neck || '—'} in, Head Circ ${data.headCirc || '—'} in, Inhaled O₂ ${data.inhaled || '—'}</p>
        <p><strong>Exam findings</strong><br>${listOrDash(data.examFinding)}</p>
        <p><strong>Pain quality</strong><br>${painQualityLabel}</p>
        <p><strong>Pain pattern</strong><br>${painConsistencyLabel}; Frequency: ${data.painFrequency || '—'}; Experiences: ${painExperienceLabel}</p>
        <p><strong>Pain scores</strong><br>Orofacial ${data.orofacialPain || '—'}/10, Head ${data.headPain || '—'}/10, Mastication ${data.masticationPain || '—'}/10, Migraines ${data.migrainePain || '—'}/10</p>
        <p><strong>Daily activity difficulty</strong><br>${dailyDifficultyLabel}</p>
        <p><strong>Interincisal max opening</strong><br>Right ${data.maxOpeningRight || '—'} mm, Left ${data.maxOpeningLeft || '—'} mm, Deviation ${data.maxOpeningDeviation || '—'} mm, Protrusive ${data.maxOpeningProtrusive || '—'} mm</p>
        <p><strong>Range of motion</strong><br>Overbite ${data.overbite || '—'} mm, Overjet ${data.overjet || '—'} mm, Reverse overjet ${data.reverseOverjet || '—'} mm</p>
        <p><strong>Abscess / lesion</strong><br>${abscessLabel}; Location: ${data.periapicalLocation || '—'}</p>
        <p><strong>Objective notes</strong><br>${data.objectiveInfo || '—'}<br>${data.objectiveNotes || '—'}<br>${data.objectiveNotes2 || '—'}</p>
        <p><strong>Diagnostic records</strong><br>${records}</p>
        <p><strong>Imaging</strong><br>${data.imaging || '—'}</p>
        <p><strong>Diagnostics</strong><br>${data.diagnostics || '—'}</p>
        <p><strong>Functional Impact</strong><br>${data.functional || '—'}</p>
      </div>
    </div>
    <div class="preview-columns">
      <div>
        <h4>Assessment</h4>
        <p><strong>Primary diagnosis</strong><br>${data.primaryDiagnosis || '—'}</p>
        <p><strong>Supporting diagnoses</strong><br>${listOrDash(data.supportingDiagnosis)}</p>
        <p><strong>Assessment narrative</strong><br>${data.assessment || '—'}</p>
        <p><strong>Medical Necessity</strong><br>${data.necessity || '—'}</p>
      </div>
      <div>
        <h4>Plan</h4>
        <p><strong>Goals</strong><br>${data.planGoals || '—'}</p>
        <p><strong>Procedures</strong><br>${listOrDash(data.planProcedures)}</p>
        <p><strong>Adjuncts</strong><br>${listOrDash(data.planAdjuncts)}</p>
        <p><strong>Verification</strong><br>${data.planVerification || '—'}</p>
        <p><strong>Follow-up</strong><br>${data.followupInterval || '—'}</p>
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
  populatePainOptions();
  handleAccordion();
  bindFormListeners();
  renderPreview();
  validateAllSections();

  if (localStorage.getItem('ric-auth') === 'true') {
    loginGate.classList.add('hidden');
    app.classList.remove('hidden');
    loadFromLocalStorage();
  }
  document.getElementById('painScore').addEventListener('input', (e) => {
    document.getElementById('painScoreValue').textContent = `${e.target.value}/10`;
  });
  syncPainScoreLabel();
})();

function populatePainOptions() {
  const ids = ['orofacialPain', 'headPain', 'masticationPain', 'migrainePain'];
  ids.forEach(id => {
    const select = document.getElementById(id);
    if (!select) return;
    select.innerHTML = '';
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Select score';
    select.appendChild(placeholder);
    for (let i = 0; i <= 10; i += 1) {
      const opt = document.createElement('option');
      opt.value = `${i}`;
      opt.textContent = `${i}`;
      select.appendChild(opt);
    }
  });
}

function getCheckedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(input => input.value);
}

function syncPainScoreLabel() {
  const slider = document.getElementById('painScore');
  if (slider) {
    document.getElementById('painScoreValue').textContent = `${slider.value}/10`;
  }
}

function formatRecord(label, completed, recommended) {
  const status = [];
  if (completed) status.push('Completed');
  if (recommended) status.push('Recommended');
  return `${label}: ${status.length ? status.join(', ') : '—'}`;
}
