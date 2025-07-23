// N.C. A&T Campus Occupancy Simulation – Enhanced with A&T Branding

const ENHANCED_DATA_URL = "https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/adfaa49dfee59112f5a820c9aa7067bb/c4fc8d01-c96b-4728-81bf-98cddbf67c27/da6f29ec.json";

// Engineering buildings that get gear icons
const ENGINEERING_BUILDINGS = new Set(['McNair', 'Graham', 'Monroe', 'M-ERIC']);

// Time mapping for the simulation (8AM to 8PM)
const TIME_SLOTS = [
  { key: "8:00", display: "8:00 AM", minutes: 480 },
  { key: "9:00", display: "9:00 AM", minutes: 540 },
  { key: "10:00", display: "10:00 AM", minutes: 600 },
  { key: "11:00", display: "11:00 AM", minutes: 660 },
  { key: "12:00", display: "12:00 PM", minutes: 720 },
  { key: "13:00", display: "1:00 PM", minutes: 780 },
  { key: "14:00", display: "2:00 PM", minutes: 840 },
  { key: "15:00", display: "3:00 PM", minutes: 900 },
  { key: "16:00", display: "4:00 PM", minutes: 960 },
  { key: "17:00", display: "5:00 PM", minutes: 1020 },
  { key: "18:00", display: "6:00 PM", minutes: 1080 },
  { key: "19:00", display: "7:00 PM", minutes: 1140 },
  { key: "20:00", display: "8:00 PM", minutes: 1200 }
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Default building configuration
const DEFAULT_BUILDINGS = {
  McNair: { max_capacity: 50, room_count: 16 },
  Graham: { max_capacity: 124, room_count: 12 },
  Monroe: { max_capacity: 30, room_count: 5 },
  "M-ERIC": { max_capacity: 90, room_count: 3 },
  SOCK: { max_capacity: 28, room_count: 1 },
  GIBBS: { max_capacity: 50, room_count: 1 },
  ACB: { max_capacity: 50, room_count: 1 },
  FRYE: { max_capacity: 245, room_count: 2 },
  HINES: { max_capacity: 25, room_count: 1 }
};

// State variables
let simulationData = {};
let buildingsConfig = {};
let currentDayIndex = 0;
let currentTimeIndex = 0;
let playing = false;
let speed = 1;
let tickInterval = null;

// DOM Elements
const buildingGridEl = document.getElementById("building-grid");
const currentDateTimeEl = document.getElementById("current-date-time");
const playPauseBtn = document.getElementById("play-pause");
const stepBackBtn = document.getElementById("step-back");
const stepForwardBtn = document.getElementById("step-forward");
const resetBtn = document.getElementById("reset");
const speedSelectEl = document.getElementById("speed-select");
const daySelectEl = document.getElementById("day-select");
const timeSliderEl = document.getElementById("time-slider");

let tooltip = null;
const buildingDomMap = new Map();

// Initialize slider and day selector
timeSliderEl.max = TIME_SLOTS.length - 1;
daySelectEl.innerHTML = DAYS.map((d, idx) => `<option value="${idx}">${d}</option>`).join("\n");

// Utility functions
function clamp(num, min, max) {
  return Math.min(max, Math.max(min, num));
}

function createGearIcon() {
  return `<span class="engineering-icon">⚙️</span>`;
}

function createTooltip() {
  tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  document.body.appendChild(tooltip);
}

function showTooltip(e, buildingName) {
  const buildingInfo = buildingsConfig[buildingName];
  const currentData = getCurrentBuildingData(buildingName);
  
  const enrolled = currentData?.enrolled || 0;
  const maxCapacity = buildingInfo?.max_capacity || 0;
  const percentage = maxCapacity > 0 ? Math.round((enrolled / maxCapacity) * 100) : 0;
  const roomCount = buildingInfo?.room_count || 0;
  
  tooltip.innerHTML = `
    <strong>${buildingName}</strong><br>
    Students: ${enrolled}/${maxCapacity}<br>
    Occupancy: ${percentage}%<br>
    Active Rooms: ${currentData?.active_rooms || 0}/${roomCount}<br>
    ${ENGINEERING_BUILDINGS.has(buildingName) ? 'Engineering Building ⚙️' : ''}
  `;
  
  tooltip.style.left = (e.clientX + 10) + "px";
  tooltip.style.top = (e.clientY + 10) + "px";
  tooltip.classList.add("visible");
}

function hideTooltip() {
  if (tooltip) {
    tooltip.classList.remove("visible");
  }
}

function getCurrentBuildingData(buildingName) {
  const day = DAYS[currentDayIndex];
  const timeKey = TIME_SLOTS[currentTimeIndex].key;
  
  return simulationData[buildingName]?.daily_schedule?.[day]?.[timeKey] || null;
}

function isPeakTime(buildingName) {
  const buildingData = simulationData[buildingName];
  if (!buildingData) return false;
  
  const currentDay = DAYS[currentDayIndex];
  const currentTimeKey = TIME_SLOTS[currentTimeIndex].key;
  
  // Check if it's listed as a peak time
  const listedPeak = buildingData.peak_times?.some(([day, time]) => 
    day === currentDay && time === currentTimeKey
  );
  
  // Also check if current enrolled equals max enrolled (fallback peak detection)
  const currentData = getCurrentBuildingData(buildingName);
  const enrolled = currentData?.enrolled || 0;
  const isMaxEnrolled = enrolled === buildingData.max_enrolled && enrolled > 0;
  
  return listedPeak || isMaxEnrolled;
}

function getOccupancyClass(enrolled, maxCapacity) {
  if (enrolled === 0) return "oc-empty";
  const percentage = enrolled / maxCapacity;
  if (percentage <= 0.3) return "oc-low";
  if (percentage <= 0.7) return "oc-medium";
  return "oc-high";
}

function buildGrid() {
  buildingGridEl.innerHTML = "";
  
  Object.keys(buildingsConfig).forEach(buildingName => {
    const buildingInfo = buildingsConfig[buildingName];
    
    const buildingEl = document.createElement("div");
    buildingEl.className = "building";
    
    // Building header with title and engineering icon
    const headerEl = document.createElement("div");
    headerEl.className = "building-header";
    
    const titleContent = ENGINEERING_BUILDINGS.has(buildingName) 
      ? `${createGearIcon()} ${buildingName}`
      : buildingName;
    headerEl.innerHTML = titleContent;
    
    // Student counter
    const counterEl = document.createElement("div");
    counterEl.className = "building-counter";
    counterEl.innerHTML = "0 students (0%)";
    
    // Peak banner (hidden by default)
    const peakBannerEl = document.createElement("div");
    peakBannerEl.className = "peak-banner hidden";
    peakBannerEl.textContent = "PEAK";
    
    // Room grid
    const roomGridEl = document.createElement("div");
    roomGridEl.className = "room-grid";
    
    // Create room squares
    for (let i = 0; i < buildingInfo.room_count; i++) {
      const roomEl = document.createElement("div");
      roomEl.className = "room-square oc-empty";
      roomGridEl.appendChild(roomEl);
    }
    
    buildingEl.appendChild(headerEl);
    buildingEl.appendChild(counterEl);
    buildingEl.appendChild(peakBannerEl);
    buildingEl.appendChild(roomGridEl);
    buildingGridEl.appendChild(buildingEl);
    
    // Add tooltip event listeners
    buildingEl.addEventListener("mouseenter", (e) => showTooltip(e, buildingName));
    buildingEl.addEventListener("mousemove", (e) => {
      if (tooltip && tooltip.classList.contains("visible")) {
        tooltip.style.left = (e.clientX + 10) + "px";
        tooltip.style.top = (e.clientY + 10) + "px";
      }
    });
    buildingEl.addEventListener("mouseleave", hideTooltip);
    
    buildingDomMap.set(buildingName, {
      buildingEl,
      counterEl,
      peakBannerEl,
      roomSquares: Array.from(roomGridEl.children)
    });
  });
}

function updateUI() {
  const day = DAYS[currentDayIndex];
  const timeDisplay = TIME_SLOTS[currentTimeIndex].display;
  currentDateTimeEl.textContent = `${day} – ${timeDisplay}`;
  
  // Update each building
  Object.keys(buildingsConfig).forEach(buildingName => {
    const buildingInfo = buildingsConfig[buildingName];
    const currentData = getCurrentBuildingData(buildingName);
    const domInfo = buildingDomMap.get(buildingName);
    
    if (!domInfo) return;
    
    const enrolled = currentData?.enrolled || 0;
    const maxCapacity = buildingInfo.max_capacity;
    const percentage = maxCapacity > 0 ? Math.round((enrolled / maxCapacity) * 100) : 0;
    
    // Update counter
    domInfo.counterEl.textContent = `${enrolled} students (${percentage}%)`;
    
    // Update room colors
    const colorClass = getOccupancyClass(enrolled, maxCapacity);
    domInfo.roomSquares.forEach(square => {
      square.classList.remove("oc-empty", "oc-low", "oc-medium", "oc-high");
      square.classList.add(colorClass);
    });
    
    // Handle peak indicator
    const isAtPeak = isPeakTime(buildingName);
    if (isAtPeak) {
      domInfo.buildingEl.classList.add("is-peak");
      domInfo.peakBannerEl.classList.remove("hidden");
    } else {
      domInfo.buildingEl.classList.remove("is-peak");
      domInfo.peakBannerEl.classList.add("hidden");
    }
  });
  
  // Sync controls
  daySelectEl.value = currentDayIndex;
  timeSliderEl.value = currentTimeIndex;
}

function stepForward() {
  currentTimeIndex += 1;
  if (currentTimeIndex >= TIME_SLOTS.length) {
    currentTimeIndex = 0;
    currentDayIndex = (currentDayIndex + 1) % DAYS.length;
  }
  updateUI();
}

function stepBackward() {
  currentTimeIndex -= 1;
  if (currentTimeIndex < 0) {
    currentDayIndex = (currentDayIndex - 1 + DAYS.length) % DAYS.length;
    currentTimeIndex = TIME_SLOTS.length - 1;
  }
  updateUI();
}

function resetSimulation() {
  currentDayIndex = 0;
  currentTimeIndex = 0;
  setPlaying(false);
  updateUI();
}

function setPlaying(value) {
  playing = value;
  playPauseBtn.textContent = playing ? "⏸️" : "▶️";
  playPauseBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
  
  if (playing) {
    startTicker();
  } else {
    stopTicker();
  }
}

function startTicker() {
  stopTicker();
  const baseMs = 2000; // 2 seconds per slot at 1×
  const intervalMs = baseMs / speed;
  tickInterval = setInterval(stepForward, intervalMs);
}

function stopTicker() {
  if (tickInterval) {
    clearInterval(tickInterval);
    tickInterval = null;
  }
}

// Event listeners
playPauseBtn.addEventListener("click", () => setPlaying(!playing));
stepForwardBtn.addEventListener("click", () => {
  setPlaying(false);
  stepForward();
});
stepBackBtn.addEventListener("click", () => {
  setPlaying(false);
  stepBackward();
});
resetBtn.addEventListener("click", resetSimulation);

speedSelectEl.addEventListener("change", (e) => {
  speed = parseFloat(e.target.value);
  if (playing) startTicker();
});

daySelectEl.addEventListener("change", (e) => {
  setPlaying(false);
  currentDayIndex = parseInt(e.target.value, 10);
  updateUI();
});

timeSliderEl.addEventListener("input", (e) => {
  setPlaying(false);
  currentTimeIndex = parseInt(e.target.value, 10);
  updateUI();
});

// Data loading and fallback functions
async function loadEnhancedData() {
  try {
    const response = await fetch(ENHANCED_DATA_URL);
    const data = await response.json();
    simulationData = data.enhanced_simulation_data || {};
    console.log("Enhanced simulation data loaded successfully");
  } catch (error) {
    console.error("Failed to load enhanced data, using synthetic data:", error);
    simulationData = {};
  }

  // Build buildings config from simulation data and fill gaps with defaults
  Object.keys(DEFAULT_BUILDINGS).forEach(buildingName => {
    if (simulationData[buildingName]) {
      buildingsConfig[buildingName] = {
        max_capacity: simulationData[buildingName].max_capacity,
        room_count: simulationData[buildingName].room_count
      };
    } else {
      buildingsConfig[buildingName] = DEFAULT_BUILDINGS[buildingName];
      simulationData[buildingName] = {
        max_capacity: DEFAULT_BUILDINGS[buildingName].max_capacity,
        room_count: DEFAULT_BUILDINGS[buildingName].room_count,
        daily_schedule: {},
        peak_times: [],
        max_enrolled: 0
      };
    }
  });

  // Fill missing schedule data with synthetic occupancy
  fillMissingSchedules();
}

function fillMissingSchedules() {
  Object.keys(simulationData).forEach(buildingName => {
    const buildingData = simulationData[buildingName];
    const maxCapacity = buildingData.max_capacity;

    DAYS.forEach(day => {
      const daySchedule = buildingData.daily_schedule[day] = buildingData.daily_schedule[day] || {};
      
      TIME_SLOTS.forEach(({ key }) => {
        const timeSlot = daySchedule[key] = daySchedule[key] || {};
        
        if (timeSlot.enrolled == null) {
          // Generate synthetic data with peak around 10:00 AM
          let enrolled = 0;
          if (key === "10:00") {
            enrolled = Math.floor(maxCapacity * (0.6 + Math.random() * 0.4)); // 60-100%
          } else if (key === "9:00" || key === "11:00") {
            enrolled = Math.floor(maxCapacity * (0.4 + Math.random() * 0.3)); // 40-70%
          } else if (key === "8:00" || key === "12:00") {
            enrolled = Math.floor(maxCapacity * (0.2 + Math.random() * 0.3)); // 20-50%
          } else {
            enrolled = Math.floor(maxCapacity * Math.random() * 0.2); // 0-20%
          }
          
          timeSlot.enrolled = enrolled;
          timeSlot.active_rooms = Math.ceil((enrolled / maxCapacity) * buildingData.room_count);
          timeSlot.total_rooms = buildingData.room_count;
          timeSlot.max_capacity = maxCapacity;
          timeSlot.percentage = (enrolled / maxCapacity) * 100;
        }
      });
    });

    // Set peak times if not already defined
    if (!buildingData.peak_times || buildingData.peak_times.length === 0) {
      let maxEnrolled = 0;
      let peakDay = '';
      let peakTime = '';
      
      DAYS.forEach(day => {
        TIME_SLOTS.forEach(({ key }) => {
          const enrolled = buildingData.daily_schedule[day][key].enrolled;
          if (enrolled > maxEnrolled) {
            maxEnrolled = enrolled;
            peakDay = day;
            peakTime = key;
          }
        });
      });
      
      buildingData.peak_times = [[peakDay, peakTime]];
      buildingData.max_enrolled = maxEnrolled;
    }
  });
}

// Initialization
async function init() {
  createTooltip();
  await loadEnhancedData();
  buildGrid();
  updateUI();
}

document.addEventListener("DOMContentLoaded", init);