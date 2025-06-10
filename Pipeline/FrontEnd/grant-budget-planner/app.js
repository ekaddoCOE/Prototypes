// Grant Budget Planning Tool - Application Logic

// Application Constants
const APP_DATA = {
  fringe_rates: {
    faculty_staff: 0.36,
    postdoc: 0.36,
    grad_student_academic: 0.0,
    grad_student_summer: 0.0765
  },
  health_fees: {
    academic: 4.5,
    academic_half: 2.25
  },
  indirect_rate: 0.45,
  effort_conversion: {
    academic_year: 9,
    calendar_year: 12,
    summer: 3
  },
  budget_categories: [
    "Personnel",
    "Fringe Benefits", 
    "Tuition",
    "Participant Support",
    "Equipment",
    "Travel",
    "Other Direct Costs",
    "Subcontractors",
    "Indirect Costs"
  ],
  personnel_types: [
    "PI (Academic)",
    "PI (Summer)",
    "EHRA Staff",
    "SHRA Staff",
    "Postdoc",
    "Graduate Student (Academic)",
    "Graduate Student (Summer)"
  ],
  validation_rules: {
    student_support_minimum: 0.5,
    subcontractor_indirect_cap: 25000
  }
};

// Main Application State
const appState = {
  currentYear: 1,
  totalYears: 1,
  budgetData: {
    // Will store data for each year
    1: initializeYearData(),
    2: initializeYearData(),
    3: initializeYearData(),
    4: initializeYearData(),
    5: initializeYearData()
  },
  projectInfo: {
    title: "",
    sponsor: "",
    piName: "",
    startDate: "",
    endDate: ""
  }
};

// Initialize empty year data
function initializeYearData() {
  return {
    personnel: [],
    equipment: [],
    otherCosts: [],
    subcontractors: [],
    tuition: {
      inState: 0,
      outState: 0,
      healthFees: 0
    },
    travel: {
      domestic: 0,
      foreign: 0
    },
    participantSupport: {
      travel: 0,
      subsistence: 0,
      other: 0
    },
    // Calculated values will be added during updates
    totalPersonnel: 0,
    totalFringe: 0,
    totalEquipment: 0,
    totalTravel: 0,
    totalParticipantSupport: 0,
    totalOtherCosts: 0,
    totalSubcontractors: 0,
    totalTuition: 0,
    totalDirectCosts: 0,
    mtdcBase: 0,
    indirectCosts: 0,
    totalProjectCost: 0
  };
}

// DOM Elements
const elements = {
  // Project Info
  projectTitle: document.getElementById('project-title'),
  sponsor: document.getElementById('sponsor'),
  piName: document.getElementById('pi-name'),
  startDate: document.getElementById('start-date'),
  endDate: document.getElementById('end-date'),
  projectYears: document.getElementById('project-years'),
  
  // Budget Summary
  totalDirect: document.getElementById('total-direct'),
  totalIndirect: document.getElementById('total-indirect'),
  totalProject: document.getElementById('total-project'),
  mtdcBase: document.getElementById('mtdc-base'),
  
  // Year Tabs
  yearTabs: document.querySelectorAll('.tab'),
  
  // Personnel Section
  personnelList: document.getElementById('personnel-list'),
  addPersonnelBtn: document.getElementById('add-personnel'),
  
  // Effort Calculator
  effortCalculatorBtn: document.getElementById('effort-calculator'),
  effortModal: document.getElementById('effort-modal'),
  closeModalBtn: document.getElementById('close-modal'),
  effortPercent: document.getElementById('effort-percent'),
  appointmentType: document.getElementById('appointment-type'),
  personMonthsResult: document.getElementById('person-months-result'),
  personMonthsInput: document.getElementById('person-months-input'),
  appointmentTypeReverse: document.getElementById('appointment-type-reverse'),
  effortPercentResult: document.getElementById('effort-percent-result'),
  
  // Fringe Benefits
  fringeTotal: document.getElementById('fringe-total'),
  fringeBreakdown: document.getElementById('fringe-breakdown'),
  
  // Tuition
  inStateTuition: document.getElementById('in-state-tuition'),
  outStateTuition: document.getElementById('out-state-tuition'),
  healthFees: document.getElementById('health-fees'),
  
  // Equipment
  equipmentList: document.getElementById('equipment-list'),
  addEquipmentBtn: document.getElementById('add-equipment'),
  
  // Travel
  domesticTravel: document.getElementById('domestic-travel'),
  foreignTravel: document.getElementById('foreign-travel'),
  
  // Participant Support
  participantTravel: document.getElementById('participant-travel'),
  participantSubsistence: document.getElementById('participant-subsistence'),
  participantOther: document.getElementById('participant-other'),
  
  // Other Costs
  otherCostsList: document.getElementById('other-costs-list'),
  addOtherCostBtn: document.getElementById('add-other-cost'),
  
  // Subcontractors
  subcontractorList: document.getElementById('subcontractor-list'),
  addSubcontractorBtn: document.getElementById('add-subcontractor'),
  
  // Validation
  validationAlerts: document.getElementById('validation-alerts'),
  
  // Action Buttons
  saveButton: document.getElementById('save-button'),
  exportButton: document.getElementById('export-button')
};

// Initialize the application
function initApp() {
  // Set up event listeners
  setupEventListeners();
  
  // Load saved data if it exists
  loadSavedData();
  
  // Initial render
  renderCurrentYear();
}

// Set up all event listeners
function setupEventListeners() {
  // Project info changes
  elements.projectTitle.addEventListener('input', updateProjectInfo);
  elements.sponsor.addEventListener('input', updateProjectInfo);
  elements.piName.addEventListener('input', updateProjectInfo);
  elements.startDate.addEventListener('change', updateProjectInfo);
  elements.endDate.addEventListener('change', updateProjectInfo);
  elements.projectYears.addEventListener('change', handleYearChange);
  
  // Year tab switching
  elements.yearTabs.forEach(tab => {
    tab.addEventListener('click', switchYear);
  });
  
  // Personnel actions
  elements.addPersonnelBtn.addEventListener('click', addPersonnel);
  
  // Effort calculator
  elements.effortCalculatorBtn.addEventListener('click', openEffortCalculator);
  elements.closeModalBtn.addEventListener('click', closeEffortCalculator);
  elements.effortPercent.addEventListener('input', calculatePersonMonths);
  elements.appointmentType.addEventListener('change', calculatePersonMonths);
  elements.personMonthsInput.addEventListener('input', calculateEffortPercent);
  elements.appointmentTypeReverse.addEventListener('change', calculateEffortPercent);
  
  // Tuition inputs
  elements.inStateTuition.addEventListener('input', updateTuition);
  elements.outStateTuition.addEventListener('input', updateTuition);
  elements.healthFees.addEventListener('input', updateTuition);
  
  // Equipment
  elements.addEquipmentBtn.addEventListener('click', addEquipment);
  
  // Travel
  elements.domesticTravel.addEventListener('input', updateTravel);
  elements.foreignTravel.addEventListener('input', updateTravel);
  
  // Participant Support
  elements.participantTravel.addEventListener('input', updateParticipantSupport);
  elements.participantSubsistence.addEventListener('input', updateParticipantSupport);
  elements.participantOther.addEventListener('input', updateParticipantSupport);
  
  // Other Costs
  elements.addOtherCostBtn.addEventListener('click', addOtherCost);
  
  // Subcontractors
  elements.addSubcontractorBtn.addEventListener('click', addSubcontractor);
  
  // Save/Export
  elements.saveButton.addEventListener('click', saveData);
  elements.exportButton.addEventListener('click', exportBudget);
}

// Handle project info updates
function updateProjectInfo() {
  appState.projectInfo = {
    title: elements.projectTitle.value,
    sponsor: elements.sponsor.value,
    piName: elements.piName.value,
    startDate: elements.startDate.value,
    endDate: elements.endDate.value
  };
  
  // Save data after update
  saveData();
}

// Handle year selection change
function handleYearChange() {
  const years = parseInt(elements.projectYears.value);
  appState.totalYears = years;
  
  // Update visibility of year tabs
  elements.yearTabs.forEach(tab => {
    const yearNum = parseInt(tab.getAttribute('data-year'));
    if (yearNum <= years) {
      tab.style.display = 'block';
    } else {
      tab.style.display = 'none';
    }
  });
  
  // If current year is greater than total years, switch to year 1
  if (appState.currentYear > years) {
    switchToYear(1);
  }
  
  // Save data after update
  saveData();
}

// Switch between years
function switchYear(e) {
  const year = parseInt(e.target.getAttribute('data-year'));
  switchToYear(year);
}

function switchToYear(year) {
  // Update active tab
  elements.yearTabs.forEach(tab => {
    const tabYear = parseInt(tab.getAttribute('data-year'));
    if (tabYear === year) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
  
  // Update current year
  appState.currentYear = year;
  
  // Render the current year data
  renderCurrentYear();
}

// Render the current year's data
function renderCurrentYear() {
  const yearData = appState.budgetData[appState.currentYear];
  
  // Render personnel
  renderPersonnel(yearData.personnel);
  
  // Render tuition
  elements.inStateTuition.value = yearData.tuition.inState || '';
  elements.outStateTuition.value = yearData.tuition.outState || '';
  elements.healthFees.value = yearData.tuition.healthFees || '';
  
  // Render equipment
  renderEquipment(yearData.equipment);
  
  // Render travel
  elements.domesticTravel.value = yearData.travel.domestic || '';
  elements.foreignTravel.value = yearData.travel.foreign || '';
  
  // Render participant support
  elements.participantTravel.value = yearData.participantSupport.travel || '';
  elements.participantSubsistence.value = yearData.participantSupport.subsistence || '';
  elements.participantOther.value = yearData.participantSupport.other || '';
  
  // Render other costs
  renderOtherCosts(yearData.otherCosts);
  
  // Render subcontractors
  renderSubcontractors(yearData.subcontractors);
  
  // Update summary values
  updateBudgetSummary();
  
  // Run validations
  validateBudget();
}

// Personnel Management
function addPersonnel() {
  const yearData = appState.budgetData[appState.currentYear];
  const newPersonnel = {
    id: generateId(),
    type: APP_DATA.personnel_types[0],
    name: '',
    baseSalary: 0,
    effortPercent: 0,
    personMonths: 0,
    totalSalary: 0
  };
  
  yearData.personnel.push(newPersonnel);
  renderPersonnel(yearData.personnel);
  updatePersonnelTotals();
  saveData();
}

function renderPersonnel(personnelList) {
  elements.personnelList.innerHTML = '';
  
  if (personnelList.length === 0) {
    elements.personnelList.innerHTML = '<div class="empty-state">No personnel added yet. Click "Add Personnel" to begin.</div>';
    return;
  }
  
  personnelList.forEach(personnel => {
    const personnelItem = document.createElement('div');
    personnelItem.className = 'personnel-item';
    personnelItem.dataset.id = personnel.id;
    
    personnelItem.innerHTML = `
      <div class="personnel-header">
        <div class="personnel-title">${personnel.name || 'New Personnel'}</div>
        <div class="personnel-controls">
          <button class="delete-button" data-id="${personnel.id}">×</button>
        </div>
      </div>
      <div class="personnel-details">
        <div class="form-group">
          <label class="form-label" for="personnel-type-${personnel.id}">Personnel Type</label>
          <select id="personnel-type-${personnel.id}" class="form-control personnel-type" data-id="${personnel.id}">
            ${APP_DATA.personnel_types.map(type => 
              `<option value="${type}" ${personnel.type === type ? 'selected' : ''}>${type}</option>`
            ).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="personnel-name-${personnel.id}">Name</label>
          <input type="text" id="personnel-name-${personnel.id}" class="form-control personnel-name" 
            data-id="${personnel.id}" value="${personnel.name || ''}">
        </div>
        <div class="form-group">
          <label class="form-label" for="personnel-salary-${personnel.id}">Base Salary ($)</label>
          <input type="number" id="personnel-salary-${personnel.id}" class="form-control personnel-salary" 
            data-id="${personnel.id}" step="0.01" min="0" value="${personnel.baseSalary || ''}">
        </div>
        <div class="form-group">
          <label class="form-label" for="personnel-effort-${personnel.id}">Effort (%)</label>
          <input type="number" id="personnel-effort-${personnel.id}" class="form-control personnel-effort" 
            data-id="${personnel.id}" step="0.1" min="0" max="100" value="${personnel.effortPercent || ''}">
        </div>
        <div class="form-group">
          <label class="form-label" for="personnel-months-${personnel.id}">Person Months</label>
          <input type="number" id="personnel-months-${personnel.id}" class="form-control personnel-months" 
            data-id="${personnel.id}" step="0.01" min="0" value="${personnel.personMonths || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">Total Salary</label>
          <div class="result-display personnel-total" data-id="${personnel.id}">$${formatCurrency(personnel.totalSalary)}</div>
        </div>
      </div>
    `;
    
    elements.personnelList.appendChild(personnelItem);
  });
  
  // Add event listeners to the new personnel items
  document.querySelectorAll('.personnel-type').forEach(select => {
    select.addEventListener('change', updatePersonnelField);
  });
  
  document.querySelectorAll('.personnel-name').forEach(input => {
    input.addEventListener('input', updatePersonnelField);
  });
  
  document.querySelectorAll('.personnel-salary').forEach(input => {
    input.addEventListener('input', updatePersonnelField);
  });
  
  document.querySelectorAll('.personnel-effort').forEach(input => {
    input.addEventListener('input', updatePersonnelEffort);
  });
  
  document.querySelectorAll('.personnel-months').forEach(input => {
    input.addEventListener('input', updatePersonnelMonths);
  });
  
  document.querySelectorAll('.delete-button').forEach(button => {
    button.addEventListener('click', deletePersonnel);
  });
}

function updatePersonnelField(e) {
  const id = e.target.getAttribute('data-id');
  const yearData = appState.budgetData[appState.currentYear];
  const personnel = yearData.personnel.find(p => p.id === id);
  
  if (personnel) {
    if (e.target.classList.contains('personnel-type')) {
      personnel.type = e.target.value;
    } else if (e.target.classList.contains('personnel-name')) {
      personnel.name = e.target.value;
    } else if (e.target.classList.contains('personnel-salary')) {
      personnel.baseSalary = parseFloat(e.target.value) || 0;
    }
    
    // Recalculate total salary
    calculatePersonnelSalary(personnel);
    
    // Update display
    const totalDisplay = document.querySelector(`.personnel-total[data-id="${id}"]`);
    if (totalDisplay) {
      totalDisplay.textContent = `$${formatCurrency(personnel.totalSalary)}`;
    }
    
    // Update name in header if changed
    if (e.target.classList.contains('personnel-name')) {
      const headerTitle = e.target.closest('.personnel-item').querySelector('.personnel-title');
      headerTitle.textContent = personnel.name || 'New Personnel';
    }
    
    // Update totals
    updatePersonnelTotals();
    saveData();
  }
}

function updatePersonnelEffort(e) {
  const id = e.target.getAttribute('data-id');
  const yearData = appState.budgetData[appState.currentYear];
  const personnel = yearData.personnel.find(p => p.id === id);
  
  if (personnel) {
    personnel.effortPercent = parseFloat(e.target.value) || 0;
    
    // Calculate person months based on type
    let baseMonths = 12; // Default to calendar year
    if (personnel.type.includes('Academic')) {
      baseMonths = 9;
    } else if (personnel.type.includes('Summer')) {
      baseMonths = 3;
    }
    
    personnel.personMonths = (personnel.effortPercent / 100) * baseMonths;
    
    // Update person months input
    const monthsInput = document.getElementById(`personnel-months-${id}`);
    if (monthsInput) {
      monthsInput.value = personnel.personMonths.toFixed(2);
    }
    
    // Recalculate total salary
    calculatePersonnelSalary(personnel);
    
    // Update display
    const totalDisplay = document.querySelector(`.personnel-total[data-id="${id}"]`);
    if (totalDisplay) {
      totalDisplay.textContent = `$${formatCurrency(personnel.totalSalary)}`;
    }
    
    // Update totals
    updatePersonnelTotals();
    saveData();
  }
}

function updatePersonnelMonths(e) {
  const id = e.target.getAttribute('data-id');
  const yearData = appState.budgetData[appState.currentYear];
  const personnel = yearData.personnel.find(p => p.id === id);
  
  if (personnel) {
    personnel.personMonths = parseFloat(e.target.value) || 0;
    
    // Calculate effort percent based on type
    let baseMonths = 12; // Default to calendar year
    if (personnel.type.includes('Academic')) {
      baseMonths = 9;
    } else if (personnel.type.includes('Summer')) {
      baseMonths = 3;
    }
    
    personnel.effortPercent = (personnel.personMonths / baseMonths) * 100;
    
    // Update effort percent input
    const effortInput = document.getElementById(`personnel-effort-${id}`);
    if (effortInput) {
      effortInput.value = personnel.effortPercent.toFixed(1);
    }
    
    // Recalculate total salary
    calculatePersonnelSalary(personnel);
    
    // Update display
    const totalDisplay = document.querySelector(`.personnel-total[data-id="${id}"]`);
    if (totalDisplay) {
      totalDisplay.textContent = `$${formatCurrency(personnel.totalSalary)}`;
    }
    
    // Update totals
    updatePersonnelTotals();
    saveData();
  }
}

function calculatePersonnelSalary(personnel) {
  if (personnel.baseSalary && personnel.effortPercent) {
    personnel.totalSalary = (personnel.baseSalary * personnel.effortPercent) / 100;
  } else {
    personnel.totalSalary = 0;
  }
}

function deletePersonnel(e) {
  const id = e.target.getAttribute('data-id');
  const yearData = appState.budgetData[appState.currentYear];
  
  // Remove personnel from array
  yearData.personnel = yearData.personnel.filter(p => p.id !== id);
  
  // Re-render personnel list
  renderPersonnel(yearData.personnel);
  
  // Update totals
  updatePersonnelTotals();
  saveData();
}

// Effort Calculator
function openEffortCalculator() {
  elements.effortModal.classList.add('show');
}

function closeEffortCalculator() {
  elements.effortModal.classList.remove('show');
}

function calculatePersonMonths() {
  const effortPercent = parseFloat(elements.effortPercent.value) || 0;
  const appointmentMonths = parseInt(elements.appointmentType.value) || 12;
  
  const personMonths = (effortPercent / 100) * appointmentMonths;
  elements.personMonthsResult.textContent = personMonths.toFixed(2);
}

function calculateEffortPercent() {
  const personMonths = parseFloat(elements.personMonthsInput.value) || 0;
  const appointmentMonths = parseInt(elements.appointmentTypeReverse.value) || 12;
  
  const effortPercent = (personMonths / appointmentMonths) * 100;
  elements.effortPercentResult.textContent = `${effortPercent.toFixed(2)}%`;
}

// Tuition Management
function updateTuition() {
  const yearData = appState.budgetData[appState.currentYear];
  
  yearData.tuition.inState = parseFloat(elements.inStateTuition.value) || 0;
  yearData.tuition.outState = parseFloat(elements.outStateTuition.value) || 0;
  yearData.tuition.healthFees = parseFloat(elements.healthFees.value) || 0;
  
  // Update the total
  yearData.totalTuition = yearData.tuition.inState + yearData.tuition.outState + yearData.tuition.healthFees;
  
  // Update budget summary
  updateBudgetSummary();
  saveData();
}

// Equipment Management
function addEquipment() {
  const yearData = appState.budgetData[appState.currentYear];
  const newEquipment = {
    id: generateId(),
    name: '',
    cost: 0
  };
  
  yearData.equipment.push(newEquipment);
  renderEquipment(yearData.equipment);
  updateEquipmentTotal();
  saveData();
}

function renderEquipment(equipmentList) {
  elements.equipmentList.innerHTML = '';
  
  if (equipmentList.length === 0) {
    elements.equipmentList.innerHTML = '<div class="empty-state">No equipment added yet. Click "Add Equipment" to begin.</div>';
    return;
  }
  
  equipmentList.forEach(equipment => {
    const equipmentItem = document.createElement('div');
    equipmentItem.className = 'equipment-item';
    equipmentItem.dataset.id = equipment.id;
    
    equipmentItem.innerHTML = `
      <div class="equipment-details">
        <div class="form-group">
          <label class="form-label" for="equipment-name-${equipment.id}">Equipment Description</label>
          <input type="text" id="equipment-name-${equipment.id}" class="form-control equipment-name" 
            data-id="${equipment.id}" value="${equipment.name || ''}">
          <div class="helper-text">Equipment must be $5,000+ per unit</div>
        </div>
        <div class="form-group">
          <label class="form-label" for="equipment-cost-${equipment.id}">Cost ($)</label>
          <input type="number" id="equipment-cost-${equipment.id}" class="form-control equipment-cost" 
            data-id="${equipment.id}" step="0.01" min="0" value="${equipment.cost || ''}">
        </div>
      </div>
      <button class="delete-button" data-id="${equipment.id}">×</button>
    `;
    
    elements.equipmentList.appendChild(equipmentItem);
  });
  
  // Add event listeners to the new equipment items
  document.querySelectorAll('.equipment-name').forEach(input => {
    input.addEventListener('input', updateEquipmentField);
  });
  
  document.querySelectorAll('.equipment-cost').forEach(input => {
    input.addEventListener('input', updateEquipmentField);
  });
  
  document.querySelectorAll('.equipment-item .delete-button').forEach(button => {
    button.addEventListener('click', deleteEquipment);
  });
}

function updateEquipmentField(e) {
  const id = e.target.getAttribute('data-id');
  const yearData = appState.budgetData[appState.currentYear];
  const equipment = yearData.equipment.find(eq => eq.id === id);
  
  if (equipment) {
    if (e.target.classList.contains('equipment-name')) {
      equipment.name = e.target.value;
    } else if (e.target.classList.contains('equipment-cost')) {
      equipment.cost = parseFloat(e.target.value) || 0;
    }
    
    // Validate equipment cost
    const costInput = document.getElementById(`equipment-cost-${id}`);
    if (costInput && equipment.cost < 5000 && equipment.cost > 0) {
      costInput.classList.add('input-invalid');
      
      // Add validation message if it doesn't exist
      let validationMsg = costInput.parentNode.querySelector('.validation-error');
      if (!validationMsg) {
        validationMsg = document.createElement('div');
        validationMsg.className = 'validation-message validation-error';
        validationMsg.textContent = 'Equipment must cost $5,000 or more per unit';
        costInput.parentNode.appendChild(validationMsg);
      }
    } else if (costInput) {
      costInput.classList.remove('input-invalid');
      
      // Remove validation message if it exists
      const validationMsg = costInput.parentNode.querySelector('.validation-error');
      if (validationMsg) {
        validationMsg.remove();
      }
    }
    
    // Update totals
    updateEquipmentTotal();
    saveData();
  }
}

function deleteEquipment(e) {
  const id = e.target.getAttribute('data-id');
  const yearData = appState.budgetData[appState.currentYear];
  
  // Remove equipment from array
  yearData.equipment = yearData.equipment.filter(eq => eq.id !== id);
  
  // Re-render equipment list
  renderEquipment(yearData.equipment);
  
  // Update totals
  updateEquipmentTotal();
  saveData();
}

// Travel Management
function updateTravel() {
  const yearData = appState.budgetData[appState.currentYear];
  
  yearData.travel.domestic = parseFloat(elements.domesticTravel.value) || 0;
  yearData.travel.foreign = parseFloat(elements.foreignTravel.value) || 0;
  
  // Update the total
  yearData.totalTravel = yearData.travel.domestic + yearData.travel.foreign;
  
  // Update budget summary
  updateBudgetSummary();
  saveData();
}

// Participant Support Management
function updateParticipantSupport() {
  const yearData = appState.budgetData[appState.currentYear];
  
  yearData.participantSupport.travel = parseFloat(elements.participantTravel.value) || 0;
  yearData.participantSupport.subsistence = parseFloat(elements.participantSubsistence.value) || 0;
  yearData.participantSupport.other = parseFloat(elements.participantOther.value) || 0;
  
  // Update the total
  yearData.totalParticipantSupport = 
    yearData.participantSupport.travel + 
    yearData.participantSupport.subsistence + 
    yearData.participantSupport.other;
  
  // Update budget summary
  updateBudgetSummary();
  saveData();
}

// Other Costs Management
function addOtherCost() {
  const yearData = appState.budgetData[appState.currentYear];
  const newCost = {
    id: generateId(),
    description: '',
    cost: 0
  };
  
  yearData.otherCosts.push(newCost);
  renderOtherCosts(yearData.otherCosts);
  updateOtherCostsTotal();
  saveData();
}

function renderOtherCosts(costsList) {
  elements.otherCostsList.innerHTML = '';
  
  if (costsList.length === 0) {
    elements.otherCostsList.innerHTML = '<div class="empty-state">No other costs added yet. Click "Add Cost" to begin.</div>';
    return;
  }
  
  costsList.forEach(cost => {
    const costItem = document.createElement('div');
    costItem.className = 'other-cost-item';
    costItem.dataset.id = cost.id;
    
    costItem.innerHTML = `
      <div class="equipment-details">
        <div class="form-group">
          <label class="form-label" for="cost-desc-${cost.id}">Description</label>
          <input type="text" id="cost-desc-${cost.id}" class="form-control cost-description" 
            data-id="${cost.id}" value="${cost.description || ''}">
        </div>
        <div class="form-group">
          <label class="form-label" for="cost-amount-${cost.id}">Cost ($)</label>
          <input type="number" id="cost-amount-${cost.id}" class="form-control cost-amount" 
            data-id="${cost.id}" step="0.01" min="0" value="${cost.cost || ''}">
        </div>
      </div>
      <button class="delete-button" data-id="${cost.id}">×</button>
    `;
    
    elements.otherCostsList.appendChild(costItem);
  });
  
  // Add event listeners to the new cost items
  document.querySelectorAll('.cost-description').forEach(input => {
    input.addEventListener('input', updateOtherCostField);
  });
  
  document.querySelectorAll('.cost-amount').forEach(input => {
    input.addEventListener('input', updateOtherCostField);
  });
  
  document.querySelectorAll('.other-cost-item .delete-button').forEach(button => {
    button.addEventListener('click', deleteOtherCost);
  });
}

function updateOtherCostField(e) {
  const id = e.target.getAttribute('data-id');
  const yearData = appState.budgetData[appState.currentYear];
  const cost = yearData.otherCosts.find(c => c.id === id);
  
  if (cost) {
    if (e.target.classList.contains('cost-description')) {
      cost.description = e.target.value;
    } else if (e.target.classList.contains('cost-amount')) {
      cost.cost = parseFloat(e.target.value) || 0;
    }
    
    // Update totals
    updateOtherCostsTotal();
    saveData();
  }
}

function deleteOtherCost(e) {
  const id = e.target.getAttribute('data-id');
  const yearData = appState.budgetData[appState.currentYear];
  
  // Remove cost from array
  yearData.otherCosts = yearData.otherCosts.filter(c => c.id !== id);
  
  // Re-render costs list
  renderOtherCosts(yearData.otherCosts);
  
  // Update totals
  updateOtherCostsTotal();
  saveData();
}

// Subcontractors Management
function addSubcontractor() {
  const yearData = appState.budgetData[appState.currentYear];
  const newSubcontractor = {
    id: generateId(),
    name: '',
    directCosts: 0,
    indirectCosts: 0,
    totalCosts: 0
  };
  
  yearData.subcontractors.push(newSubcontractor);
  renderSubcontractors(yearData.subcontractors);
  updateSubcontractorTotal();
  saveData();
}

function renderSubcontractors(subcontractorList) {
  elements.subcontractorList.innerHTML = '';
  
  if (subcontractorList.length === 0) {
    elements.subcontractorList.innerHTML = '<div class="empty-state">No subcontractors added yet. Click "Add Subcontractor" to begin.</div>';
    return;
  }
  
  subcontractorList.forEach(subcontractor => {
    const subItem = document.createElement('div');
    subItem.className = 'subcontractor-item';
    subItem.dataset.id = subcontractor.id;
    
    subItem.innerHTML = `
      <div class="subcontractor-header">
        <div class="personnel-title">${subcontractor.name || 'New Subcontractor'}</div>
        <div class="personnel-controls">
          <button class="delete-button" data-id="${subcontractor.id}">×</button>
        </div>
      </div>
      <div class="subcontractor-details">
        <div class="form-group">
          <label class="form-label" for="sub-name-${subcontractor.id}">Subcontractor Name</label>
          <input type="text" id="sub-name-${subcontractor.id}" class="form-control sub-name" 
            data-id="${subcontractor.id}" value="${subcontractor.name || ''}">
        </div>
        <div class="form-group">
          <label class="form-label" for="sub-direct-${subcontractor.id}">Direct Costs ($)</label>
          <input type="number" id="sub-direct-${subcontractor.id}" class="form-control sub-direct" 
            data-id="${subcontractor.id}" step="0.01" min="0" value="${subcontractor.directCosts || ''}">
        </div>
        <div class="form-group">
          <label class="form-label" for="sub-indirect-${subcontractor.id}">Indirect Costs ($)</label>
          <input type="number" id="sub-indirect-${subcontractor.id}" class="form-control sub-indirect" 
            data-id="${subcontractor.id}" step="0.01" min="0" value="${subcontractor.indirectCosts || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">Total Costs</label>
          <div class="result-display sub-total" data-id="${subcontractor.id}">$${formatCurrency(subcontractor.totalCosts)}</div>
          <div class="helper-text">Only first $25,000 applies to MTDC</div>
        </div>
      </div>
    `;
    
    elements.subcontractorList.appendChild(subItem);
  });
  
  // Add event listeners to the new subcontractor items
  document.querySelectorAll('.sub-name').forEach(input => {
    input.addEventListener('input', updateSubcontractorField);
  });
  
  document.querySelectorAll('.sub-direct').forEach(input => {
    input.addEventListener('input', updateSubcontractorField);
  });
  
  document.querySelectorAll('.sub-indirect').forEach(input => {
    input.addEventListener('input', updateSubcontractorField);
  });
  
  document.querySelectorAll('.subcontractor-item .delete-button').forEach(button => {
    button.addEventListener('click', deleteSubcontractor);
  });
}

function updateSubcontractorField(e) {
  const id = e.target.getAttribute('data-id');
  const yearData = appState.budgetData[appState.currentYear];
  const subcontractor = yearData.subcontractors.find(s => s.id === id);
  
  if (subcontractor) {
    if (e.target.classList.contains('sub-name')) {
      subcontractor.name = e.target.value;
      
      // Update name in header
      const headerTitle = e.target.closest('.subcontractor-item').querySelector('.personnel-title');
      headerTitle.textContent = subcontractor.name || 'New Subcontractor';
      
    } else if (e.target.classList.contains('sub-direct')) {
      subcontractor.directCosts = parseFloat(e.target.value) || 0;
    } else if (e.target.classList.contains('sub-indirect')) {
      subcontractor.indirectCosts = parseFloat(e.target.value) || 0;
    }
    
    // Calculate total
    subcontractor.totalCosts = subcontractor.directCosts + subcontractor.indirectCosts;
    
    // Update display
    const totalDisplay = document.querySelector(`.sub-total[data-id="${id}"]`);
    if (totalDisplay) {
      totalDisplay.textContent = `$${formatCurrency(subcontractor.totalCosts)}`;
    }
    
    // Update totals
    updateSubcontractorTotal();
    saveData();
  }
}

function deleteSubcontractor(e) {
  const id = e.target.getAttribute('data-id');
  const yearData = appState.budgetData[appState.currentYear];
  
  // Remove subcontractor from array
  yearData.subcontractors = yearData.subcontractors.filter(s => s.id !== id);
  
  // Re-render subcontractor list
  renderSubcontractors(yearData.subcontractors);
  
  // Update totals
  updateSubcontractorTotal();
  saveData();
}

// Update Totals Functions
function updatePersonnelTotals() {
  const yearData = appState.budgetData[appState.currentYear];
  
  // Calculate total personnel costs
  yearData.totalPersonnel = yearData.personnel.reduce((total, person) => {
    return total + (person.totalSalary || 0);
  }, 0);
  
  // Calculate fringe benefits
  yearData.totalFringe = calculateFringeBenefits(yearData.personnel);
  
  // Render fringe breakdown
  renderFringeBreakdown(yearData.personnel);
  
  // Update budget summary
  updateBudgetSummary();
}

function calculateFringeBenefits(personnelList) {
  let totalFringe = 0;
  
  personnelList.forEach(person => {
    let fringeRate = 0;
    
    // Determine fringe rate based on personnel type
    if (person.type.includes('Faculty') || person.type.includes('Staff') || person.type.includes('EHRA') || person.type.includes('SHRA')) {
      fringeRate = APP_DATA.fringe_rates.faculty_staff;
    } else if (person.type.includes('Postdoc')) {
      fringeRate = APP_DATA.fringe_rates.postdoc;
    } else if (person.type.includes('Graduate') && person.type.includes('Academic')) {
      fringeRate = APP_DATA.fringe_rates.grad_student_academic;
    } else if (person.type.includes('Graduate') && person.type.includes('Summer')) {
      fringeRate = APP_DATA.fringe_rates.grad_student_summer;
    }
    
    // Calculate fringe benefit
    person.fringeBenefit = person.totalSalary * fringeRate;
    totalFringe += person.fringeBenefit;
  });
  
  return totalFringe;
}

function renderFringeBreakdown(personnelList) {
  elements.fringeBreakdown.innerHTML = '';
  elements.fringeTotal.textContent = `$${formatCurrency(appState.budgetData[appState.currentYear].totalFringe)}`;
  
  if (personnelList.length === 0) {
    elements.fringeBreakdown.innerHTML = '<div class="empty-state">No personnel added yet.</div>';
    return;
  }
  
  personnelList.forEach(person => {
    if (person.fringeBenefit > 0) {
      const fringeItem = document.createElement('div');
      fringeItem.className = 'fringe-item';
      
      let fringeRate = 0;
      // Determine fringe rate based on personnel type
      if (person.type.includes('Faculty') || person.type.includes('Staff') || person.type.includes('EHRA') || person.type.includes('SHRA')) {
        fringeRate = APP_DATA.fringe_rates.faculty_staff * 100;
      } else if (person.type.includes('Postdoc')) {
        fringeRate = APP_DATA.fringe_rates.postdoc * 100;
      } else if (person.type.includes('Graduate') && person.type.includes('Academic')) {
        fringeRate = APP_DATA.fringe_rates.grad_student_academic * 100;
      } else if (person.type.includes('Graduate') && person.type.includes('Summer')) {
        fringeRate = APP_DATA.fringe_rates.grad_student_summer * 100;
      }
      
      fringeItem.innerHTML = `
        <div class="fringe-label">${person.name || 'Personnel'} (${fringeRate}%)</div>
        <div class="fringe-value">$${formatCurrency(person.fringeBenefit)}</div>
      `;
      
      elements.fringeBreakdown.appendChild(fringeItem);
    }
  });
}

function updateEquipmentTotal() {
  const yearData = appState.budgetData[appState.currentYear];
  
  yearData.totalEquipment = yearData.equipment.reduce((total, equip) => {
    return total + (equip.cost || 0);
  }, 0);
  
  updateBudgetSummary();
}

function updateOtherCostsTotal() {
  const yearData = appState.budgetData[appState.currentYear];
  
  yearData.totalOtherCosts = yearData.otherCosts.reduce((total, cost) => {
    return total + (cost.cost || 0);
  }, 0);
  
  updateBudgetSummary();
}

function updateSubcontractorTotal() {
  const yearData = appState.budgetData[appState.currentYear];
  
  yearData.totalSubcontractors = yearData.subcontractors.reduce((total, sub) => {
    return total + (sub.totalCosts || 0);
  }, 0);
  
  updateBudgetSummary();
}

// Update Budget Summary
function updateBudgetSummary() {
  const yearData = appState.budgetData[appState.currentYear];
  
  // Calculate direct costs
  yearData.totalDirectCosts = 
    (yearData.totalPersonnel || 0) +
    (yearData.totalFringe || 0) +
    (yearData.totalEquipment || 0) +
    (yearData.totalTravel || 0) +
    (yearData.totalParticipantSupport || 0) +
    (yearData.totalOtherCosts || 0) +
    (yearData.totalSubcontractors || 0) +
    (yearData.totalTuition || 0);
  
  // Calculate MTDC (Modified Total Direct Costs)
  yearData.mtdcBase = calculateMTDC(yearData);
  
  // Calculate indirect costs
  yearData.indirectCosts = yearData.mtdcBase * APP_DATA.indirect_rate;
  
  // Calculate total project cost
  yearData.totalProjectCost = yearData.totalDirectCosts + yearData.indirectCosts;
  
  // Update DOM with calculated values
  elements.totalDirect.textContent = `$${formatCurrency(yearData.totalDirectCosts)}`;
  elements.totalIndirect.textContent = `$${formatCurrency(yearData.indirectCosts)}`;
  elements.totalProject.textContent = `$${formatCurrency(yearData.totalProjectCost)}`;
  elements.mtdcBase.textContent = `$${formatCurrency(yearData.mtdcBase)}`;
}

// Calculate MTDC
function calculateMTDC(yearData) {
  // Start with total direct costs
  let mtdc = yearData.totalDirectCosts;
  
  // Subtract equipment
  mtdc -= yearData.totalEquipment;
  
  // Subtract tuition
  mtdc -= yearData.totalTuition;
  
  // Subtract participant support costs
  mtdc -= yearData.totalParticipantSupport;
  
  // Subtract portion of subcontractor costs > $25,000 per subcontractor
  yearData.subcontractors.forEach(sub => {
    const cap = APP_DATA.validation_rules.subcontractor_indirect_cap;
    if (sub.totalCosts > cap) {
      mtdc -= (sub.totalCosts - cap);
    }
  });
  
  return mtdc;
}

// Validate Budget
function validateBudget() {
  const yearData = appState.budgetData[appState.currentYear];
  elements.validationAlerts.innerHTML = '';
  const alerts = [];
  
  // Validate equipment costs >= $5,000
  yearData.equipment.forEach(equip => {
    if (equip.cost > 0 && equip.cost < 5000) {
      alerts.push({
        type: 'error',
        message: `Equipment item "${equip.name || 'Unnamed'}" must cost at least $5,000`
      });
    }
  });
  
  // Validate student support is at least 50% of total
  const gradStudentCosts = yearData.personnel
    .filter(p => p.type.includes('Graduate'))
    .reduce((total, p) => total + p.totalSalary, 0);
  
  const totalPersonnelCosts = yearData.totalPersonnel;
  
  if (totalPersonnelCosts > 0 && gradStudentCosts > 0) {
    const studentSupportRatio = gradStudentCosts / totalPersonnelCosts;
    
    if (studentSupportRatio < APP_DATA.validation_rules.student_support_minimum) {
      alerts.push({
        type: 'warning',
        message: `Graduate student support is ${(studentSupportRatio * 100).toFixed(1)}% of personnel costs. This should be at least 50%.`
      });
    }
  }
  
  // Render alerts
  alerts.forEach(alert => {
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${alert.type}`;
    alertElement.textContent = alert.message;
    elements.validationAlerts.appendChild(alertElement);
  });
}

// Helper Functions
function generateId() {
  return 'id_' + Math.random().toString(36).substr(2, 9);
}

function formatCurrency(amount) {
  return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Save and Load Data
function saveData() {
  try {
    // Use sessionStorage as specified in requirements
    sessionStorage.setItem('grantBudget', JSON.stringify({
      projectInfo: appState.projectInfo,
      totalYears: appState.totalYears,
      budgetData: appState.budgetData
    }));
    
    // Show temporary save confirmation
    const saveButton = elements.saveButton;
    const originalText = saveButton.textContent;
    saveButton.textContent = 'Saved!';
    
    setTimeout(() => {
      saveButton.textContent = originalText;
    }, 2000);
  } catch (error) {
    console.error('Error saving data:', error);
    alert('Failed to save data. Please try again.');
  }
}

function loadSavedData() {
  try {
    const savedData = sessionStorage.getItem('grantBudget');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      
      // Restore project info
      appState.projectInfo = parsedData.projectInfo;
      elements.projectTitle.value = appState.projectInfo.title || '';
      elements.sponsor.value = appState.projectInfo.sponsor || '';
      elements.piName.value = appState.projectInfo.piName || '';
      elements.startDate.value = appState.projectInfo.startDate || '';
      elements.endDate.value = appState.projectInfo.endDate || '';
      
      // Restore year selection
      appState.totalYears = parsedData.totalYears;
      elements.projectYears.value = appState.totalYears;
      
      // Update visibility of year tabs
      elements.yearTabs.forEach(tab => {
        const yearNum = parseInt(tab.getAttribute('data-year'));
        if (yearNum <= appState.totalYears) {
          tab.style.display = 'block';
        } else {
          tab.style.display = 'none';
        }
      });
      
      // Restore budget data
      appState.budgetData = parsedData.budgetData;
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Export Budget
function exportBudget() {
  // Generate CSV content
  let csvContent = 'data:text/csv;charset=utf-8,';
  
  // Add header row
  csvContent += 'Budget Category,';
  for (let year = 1; year <= appState.totalYears; year++) {
    csvContent += `Year ${year},`;
  }
  csvContent += 'Total\n';
  
  // Personnel
  csvContent += 'Personnel,';
  let personnelTotal = 0;
  for (let year = 1; year <= appState.totalYears; year++) {
    const yearData = appState.budgetData[year];
    csvContent += `${yearData.totalPersonnel.toFixed(2)},`;
    personnelTotal += yearData.totalPersonnel;
  }
  csvContent += `${personnelTotal.toFixed(2)}\n`;
  
  // Fringe Benefits
  csvContent += 'Fringe Benefits,';
  let fringeTotal = 0;
  for (let year = 1; year <= appState.totalYears; year++) {
    const yearData = appState.budgetData[year];
    csvContent += `${yearData.totalFringe.toFixed(2)},`;
    fringeTotal += yearData.totalFringe;
  }
  csvContent += `${fringeTotal.toFixed(2)}\n`;
  
  // Equipment
  csvContent += 'Equipment,';
  let equipmentTotal = 0;
  for (let year = 1; year <= appState.totalYears; year++) {
    const yearData = appState.budgetData[year];
    csvContent += `${yearData.totalEquipment.toFixed(2)},`;
    equipmentTotal += yearData.totalEquipment;
  }
  csvContent += `${equipmentTotal.toFixed(2)}\n`;
  
  // Travel
  csvContent += 'Travel,';
  let travelTotal = 0;
  for (let year = 1; year <= appState.totalYears; year++) {
    const yearData = appState.budgetData[year];
    csvContent += `${yearData.totalTravel.toFixed(2)},`;
    travelTotal += yearData.totalTravel;
  }
  csvContent += `${travelTotal.toFixed(2)}\n`;
  
  // Participant Support
  csvContent += 'Participant Support,';
  let participantTotal = 0;
  for (let year = 1; year <= appState.totalYears; year++) {
    const yearData = appState.budgetData[year];
    csvContent += `${yearData.totalParticipantSupport.toFixed(2)},`;
    participantTotal += yearData.totalParticipantSupport;
  }
  csvContent += `${participantTotal.toFixed(2)}\n`;
  
  // Other Direct Costs
  csvContent += 'Other Direct Costs,';
  let otherCostsTotal = 0;
  for (let year = 1; year <= appState.totalYears; year++) {
    const yearData = appState.budgetData[year];
    csvContent += `${yearData.totalOtherCosts.toFixed(2)},`;
    otherCostsTotal += yearData.totalOtherCosts;
  }
  csvContent += `${otherCostsTotal.toFixed(2)}\n`;
  
  // Subcontractors
  csvContent += 'Subcontractors,';
  let subcontractorsTotal = 0;
  for (let year = 1; year <= appState.totalYears; year++) {
    const yearData = appState.budgetData[year];
    csvContent += `${yearData.totalSubcontractors.toFixed(2)},`;
    subcontractorsTotal += yearData.totalSubcontractors;
  }
  csvContent += `${subcontractorsTotal.toFixed(2)}\n`;
  
  // Tuition
  csvContent += 'Tuition,';
  let tuitionTotal = 0;
  for (let year = 1; year <= appState.totalYears; year++) {
    const yearData = appState.budgetData[year];
    csvContent += `${yearData.totalTuition.toFixed(2)},`;
    tuitionTotal += yearData.totalTuition;
  }
  csvContent += `${tuitionTotal.toFixed(2)}\n`;
  
  // Total Direct Costs
  csvContent += 'Total Direct Costs,';
  let directCostsTotal = 0;
  for (let year = 1; year <= appState.totalYears; year++) {
    const yearData = appState.budgetData[year];
    csvContent += `${yearData.totalDirectCosts.toFixed(2)},`;
    directCostsTotal += yearData.totalDirectCosts;
  }
  csvContent += `${directCostsTotal.toFixed(2)}\n`;
  
  // MTDC Base
  csvContent += 'MTDC Base,';
  let mtdcTotal = 0;
  for (let year = 1; year <= appState.totalYears; year++) {
    const yearData = appState.budgetData[year];
    csvContent += `${yearData.mtdcBase.toFixed(2)},`;
    mtdcTotal += yearData.mtdcBase;
  }
  csvContent += `${mtdcTotal.toFixed(2)}\n`;
  
  // Indirect Costs
  csvContent += 'Indirect Costs,';
  let indirectCostsTotal = 0;
  for (let year = 1; year <= appState.totalYears; year++) {
    const yearData = appState.budgetData[year];
    csvContent += `${yearData.indirectCosts.toFixed(2)},`;
    indirectCostsTotal += yearData.indirectCosts;
  }
  csvContent += `${indirectCostsTotal.toFixed(2)}\n`;
  
  // Total Project Cost
  csvContent += 'Total Project Cost,';
  let projectCostTotal = 0;
  for (let year = 1; year <= appState.totalYears; year++) {
    const yearData = appState.budgetData[year];
    csvContent += `${yearData.totalProjectCost.toFixed(2)},`;
    projectCostTotal += yearData.totalProjectCost;
  }
  csvContent += `${projectCostTotal.toFixed(2)}\n`;
  
  // Create download link
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${appState.projectInfo.title || 'grant_budget'}_export.csv`);
  document.body.appendChild(link);
  
  // Trigger download
  link.click();
  
  // Clean up
  document.body.removeChild(link);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', initApp);