// NC A&T College of Engineering Facilities Browser
// Using Real Building and Room Data

class FacilitiesBrowser {
    constructor() {
        this.currentView = 'home';
        this.currentBuilding = null;
        this.currentFloor = null;
        this.currentRoom = null;
        this.buildingsData = {};
        this.filteredRooms = [];
        
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.generateBuildingCards();
        this.generateBuildingTabs();
        this.updateBreadcrumb();
    }

    async loadData() {
        // Real building and room data from the provided JSON
        this.buildingsData = {
            "McNair": {
                "name": "McNair Hall",
                "totalRooms": 233,
                "floors": 6,
                "departments": ["BIOENGINEERING", "GENERAL ENG.", "GENERAL USE", "CHEMICAL ENG", "ELECTRICAL ENGR", "INDUSTRIAL GENERAL", "CIVIL ENGR", "ENVIRON & WATER ENGR", "ARCH ENGR", "COMPUTER ENGR", "MECHANICAL"],
                "rooms": [
                    {"roomId": "McNair-101", "roomNumber": "101", "roomName": "CHEMICAL STORAGE", "floor": 1, "roomUseCode": "215.0", "stations": "", "area": "119", "department": "CHEMICAL ENG", "faculty": "", "building": "McNair"},
                    {"roomId": "McNair-104", "roomNumber": "104", "roomName": "UNIT OPERATIONS LAB", "floor": 1, "roomUseCode": "250.0", "stations": "26", "area": "1416", "department": "CHEMICAL ENG", "faculty": "", "building": "McNair"},
                    {"roomId": "McNair-105", "roomNumber": "105", "roomName": "WET CHEM LAB", "floor": 1, "roomUseCode": "220.0", "stations": "8", "area": "378", "department": "CHEMICAL ENG", "faculty": "MR. G. COLEMAN", "building": "McNair"},
                    {"roomId": "McNair-123", "roomNumber": "123", "roomName": "CLASSROOM", "floor": 1, "roomUseCode": "110.0", "stations": "40", "area": "583", "department": "GENERAL ENGINEER", "faculty": "", "building": "McNair"},
                    {"roomId": "McNair-126", "roomNumber": "126", "roomName": "CLASSROOM", "floor": 1, "roomUseCode": "110.0", "stations": "35", "area": "505", "department": "GENERAL ENGINEER", "faculty": "", "building": "McNair"},
                    {"roomId": "McNair-204", "roomNumber": "204", "roomName": "TELECONFERENCE", "floor": 2, "roomUseCode": "110.0", "stations": "36", "area": "1050", "department": "GENERAL ENGINEER", "faculty": "", "building": "McNair"},
                    {"roomId": "McNair-205", "roomNumber": "205", "roomName": "CLASSROOM", "floor": 2, "roomUseCode": "110.0", "stations": "50", "area": "1142", "department": "GENERAL ENGINEER", "faculty": "", "building": "McNair"},
                    {"roomId": "McNair-212", "roomNumber": "212", "roomName": "COMPUTER LAB", "floor": 2, "roomUseCode": "220.0", "stations": "30", "area": "1172", "department": "ENGINEER GENERAL", "faculty": "", "building": "McNair"},
                    {"roomId": "McNair-213", "roomNumber": "213", "roomName": "LECTURE #2", "floor": 2, "roomUseCode": "110.0", "stations": "45", "area": "1145", "department": "GENERAL ENGINEER", "faculty": "", "building": "McNair"},
                    {"roomId": "McNair-214", "roomNumber": "214", "roomName": "LECTURE #1", "floor": 2, "roomUseCode": "110.0", "stations": "45", "area": "1104", "department": "GENERAL ENGINEER", "faculty": "", "building": "McNair"},
                    {"roomId": "McNair-223", "roomNumber": "223", "roomName": "COMPUTER ROOM", "floor": 2, "roomUseCode": "210.0", "stations": "25", "area": "635", "department": "ENGINEERING GENERAL", "faculty": "", "building": "McNair"},
                    {"roomId": "McNair-224", "roomNumber": "224", "roomName": "COMPUTER ROOM", "floor": 2, "roomUseCode": "220.0", "stations": "25", "area": "641", "department": "ENGINEERING GENERAL", "faculty": "", "building": "McNair"},
                    {"roomId": "McNair-301", "roomNumber": "301", "roomName": "CLASSROOM", "floor": 3, "roomUseCode": "110.0", "stations": "24", "area": "439", "department": "GENERAL ENGINEER", "faculty": "", "building": "McNair"},
                    {"roomId": "McNair-302", "roomNumber": "302", "roomName": "NEW BIO LAB", "floor": 3, "roomUseCode": "250.0", "stations": "4", "area": "501", "department": "CHEMICAL ENGINEERING", "faculty": "DR. V. KABADI", "building": "McNair"},
                    {"roomId": "McNair-305", "roomNumber": "305", "roomName": "DYNAMICS PROCESS LAB", "floor": 3, "roomUseCode": "250.0", "stations": "6", "area": "548", "department": "CHEMICAL ENGINEERING", "faculty": "", "building": "McNair"}
                ]
            },
            "Graham": {
                "name": "Graham Hall", 
                "totalRooms": 34,
                "floors": 3,
                "departments": ["MECHANICAL ENG.", "CIVIL, ARCH, ENV. ENG.", "INDUSTRIAL SYS ENG.", "COMPUTER SCI.", "GENERAL USE"],
                "rooms": [
                    {"roomId": "Graham-100", "roomNumber": "100", "roomName": "TEACHING LAB", "floor": 1, "roomUseCode": "210.0", "stations": "15", "area": "2826.0", "department": "MECHANICAL ENG.", "faculty": "", "building": "Graham"},
                    {"roomId": "Graham-101", "roomNumber": "101", "roomName": "MECHANTRONICS", "floor": 1, "roomUseCode": "210.0", "stations": "16", "area": "631.0", "department": "MECHANICAL ENG.", "faculty": "", "building": "Graham"},
                    {"roomId": "Graham-102", "roomNumber": "102", "roomName": "MATERIALS LAB", "floor": 1, "roomUseCode": "210.0", "stations": "10", "area": "813.0", "department": "MECHANICAL ENG.", "faculty": "", "building": "Graham"},
                    {"roomId": "Graham-106", "roomNumber": "106", "roomName": "MATERIALS TEACHING LAB", "floor": 1, "roomUseCode": "250.0", "stations": "22", "area": "877.0", "department": "MECHANICAL ENG.", "faculty": "", "building": "Graham"},
                    {"roomId": "Graham-108", "roomNumber": "108", "roomName": "SHARED LAB", "floor": 1, "roomUseCode": "210.0", "stations": "22", "area": "1173.0", "department": "CAEE & ME", "faculty": "", "building": "Graham"},
                    {"roomId": "Graham-110", "roomNumber": "110", "roomName": "DR.PICORNELL", "floor": 1, "roomUseCode": "210.0", "stations": "22", "area": "2490.0", "department": "CIVIL, ARCH, ENV. ENG.", "faculty": "", "building": "Graham"},
                    {"roomId": "Graham-203", "roomNumber": "203", "roomName": "COMPUTER LAB", "floor": 2, "roomUseCode": "210.0", "stations": "36", "area": "1048.0", "department": "COMPUTER SCI.", "faculty": "", "building": "Graham"},
                    {"roomId": "Graham-204", "roomNumber": "204", "roomName": "COMPUTER LAB", "floor": 2, "roomUseCode": "210.0", "stations": "30", "area": "867.0", "department": "COMPUTER SCI.", "faculty": "", "building": "Graham"},
                    {"roomId": "Graham-206", "roomNumber": "206", "roomName": "COMPUTER LAB", "floor": 2, "roomUseCode": "210.0", "stations": "30", "area": "847.0", "department": "COMPUTER SCI.", "faculty": "", "building": "Graham"},
                    {"roomId": "Graham-208", "roomNumber": "208", "roomName": "CLASSROOM", "floor": 2, "roomUseCode": "110.0", "stations": "62", "area": "1370.0", "department": "GENERAL USE", "faculty": "72 Stadium Seats", "building": "Graham"},
                    {"roomId": "Graham-210", "roomNumber": "210", "roomName": "CLASSROOM", "floor": 2, "roomUseCode": "110.0", "stations": "72", "area": "1773.0", "department": "GENERAL USE", "faculty": "72 Stadium Seats", "building": "Graham"},
                    {"roomId": "Graham-301", "roomNumber": "301", "roomName": "ARCH DESIGN STUD", "floor": 3, "roomUseCode": "210.0", "stations": "24", "area": "1005.0", "department": "CIVIL,ARCH, ENVIR,ENGIN.", "faculty": "", "building": "Graham"},
                    {"roomId": "Graham-302", "roomNumber": "302", "roomName": "ARCH DESIGN STUD", "floor": 3, "roomUseCode": "210.0", "stations": "24", "area": "895.0", "department": "CIVIL,ARCH, ENVIR,ENGIN.", "faculty": "", "building": "Graham"},
                    {"roomId": "Graham-304", "roomNumber": "304", "roomName": "HVAC/LIGHT LAB", "floor": 3, "roomUseCode": "210.0", "stations": "24", "area": "914.0", "department": "CIVIL,ARCH, ENVIR,ENGIN.", "faculty": "", "building": "Graham"}
                ]
            },
            "Monroe": {
                "name": "Monroe Hall",
                "totalRooms": 94, 
                "floors": 3,
                "departments": ["BIOENGINEERING", "MECHANICAL ENG.", "GENERAL ENG.", "INDUSTRIAL ENG.", "CIVIL,ARCH, & ENV ENG", "ELECTRICAL ENG.", "COMPUTER LAB", "COMPUTER SCI ENGR", "COMP DATA SCI ENG", "INDUSTRIAL SYST. ENG."],
                "rooms": [
                    {"roomId": "Monroe-101", "roomNumber": "101", "roomName": "BIOENG LAB", "floor": 1, "roomUseCode": "250.0", "stations": "12", "area": "552.0", "department": "BIOENGINEERING", "faculty": "", "building": "Monroe"},
                    {"roomId": "Monroe-102", "roomNumber": "102", "roomName": "ME LAB; SR. DESIGN", "floor": 1, "roomUseCode": "310.0", "stations": "1", "area": "274.0", "department": "MECHANICAL ENG.", "faculty": "", "building": "Monroe"},
                    {"roomId": "Monroe-110", "roomNumber": "110", "roomName": "I.E. STUD PROJECTS", "floor": 1, "roomUseCode": "250.0", "stations": "16", "area": "1020.0", "department": "INDUSTRIAL ENG.", "faculty": "?", "building": "Monroe"},
                    {"roomId": "Monroe-112", "roomNumber": "112", "roomName": "WELDING SHOP", "floor": 1, "roomUseCode": "250.0", "stations": "", "area": "3194.0", "department": "MECHANICAL ENG.", "faculty": "STAFF ?", "building": "Monroe"},
                    {"roomId": "Monroe-117", "roomNumber": "117", "roomName": "ELEC. ENG. STUDENT", "floor": 1, "roomUseCode": "250.0", "stations": "20", "area": "1069.0", "department": "ELECTRICAL ENG.", "faculty": "", "building": "Monroe"},
                    {"roomId": "Monroe-121", "roomNumber": "121", "roomName": "SUN LAB", "floor": 1, "roomUseCode": "250.0", "stations": "", "area": "", "department": "COMPUTER LAB", "faculty": "COLLEGE", "building": "Monroe"},
                    {"roomId": "Monroe-122", "roomNumber": "122", "roomName": "AUTODRIVE RES.", "floor": 1, "roomUseCode": "250.0", "stations": "20", "area": "761.0", "department": "MECHANICAL ENG.", "faculty": "DR. KUMAR", "building": "Monroe"},
                    {"roomId": "Monroe-207", "roomNumber": "207", "roomName": "CYBER LAB", "floor": 2, "roomUseCode": "220.0", "stations": "", "area": "846.0", "department": "COMPUTER SCI ENGR", "faculty": "", "building": "Monroe"},
                    {"roomId": "Monroe-214", "roomNumber": "214", "roomName": "ELEC MIC PROCESS, UG LAB", "floor": 2, "roomUseCode": "210.0", "stations": "35", "area": "1417.0", "department": "ELECTRICAL ENG", "faculty": "", "building": "Monroe"},
                    {"roomId": "Monroe-217", "roomNumber": "217", "roomName": "CIRCUITS LAB, UG LAB", "floor": 2, "roomUseCode": "250.0", "stations": "32", "area": "1461.0", "department": "ELECTRICAL ENG", "faculty": "", "building": "Monroe"},
                    {"roomId": "Monroe-315", "roomNumber": "315", "roomName": "DRS. GOKARAJU; RHINEHART", "floor": 3, "roomUseCode": "250.0", "stations": "16", "area": "1183.0", "department": "COMP DATA SCI ENG", "faculty": "", "building": "Monroe"},
                    {"roomId": "Monroe-317", "roomNumber": "317", "roomName": "ISE LAB", "floor": 3, "roomUseCode": "250.0", "stations": "30", "area": "735.0", "department": "INDUSTRIAL SYST. ENG.", "faculty": "fomerly McCullough", "building": "Monroe"},
                    {"roomId": "Monroe-319", "roomNumber": "319", "roomName": "DR. LAUREN DAVIS", "floor": 3, "roomUseCode": "250.0", "stations": "20", "area": "615.0", "department": "INDUSTRIAL SYST. ENG.", "faculty": "", "building": "Monroe"}
                ]
            },
            "Hines": {
                "name": "Hines Hall",
                "totalRooms": 5,
                "floors": 2,
                "departments": ["ELECTRICAL COMP ENG"],
                "rooms": [
                    {"roomId": "Hines-200", "roomNumber": "200", "roomName": "DR. KUMAR", "floor": 2, "roomUseCode": "250.0", "stations": "", "area": "1260.0", "department": "ELECTRICAL COMP ENG", "faculty": "Moving to Monro 218", "building": "Hines"},
                    {"roomId": "Hines-201", "roomNumber": "201", "roomName": "DR. KARIMODDINI", "floor": 2, "roomUseCode": "250.0", "stations": "6", "area": "473.0", "department": "ELECTRICAL COMP ENG", "faculty": "Moving to M-ERIC", "building": "Hines"},
                    {"roomId": "Hines-202", "roomNumber": "202", "roomName": "DR. SCHALL", "floor": 2, "roomUseCode": "250.0", "stations": "", "area": "484.0", "department": "ELECTRICAL COMP ENG", "faculty": "Moving to Monro 218", "building": "Hines"},
                    {"roomId": "Hines-203", "roomNumber": "203", "roomName": "DR. MONTE (SECURE MATERIALS)", "floor": 2, "roomUseCode": "310.0", "stations": "", "area": "174.0", "department": "ELECTRICAL COMP ENG", "faculty": "", "building": "Hines"}
                ]
            },
            "M-ERIC": {
                "name": "M-ERIC (Martin Sr. Engineering Research & Innovation Complex)",
                "totalRooms": 50,
                "floors": 4,
                "departments": ["MULTI-DISCIPLINARY RESEARCH", "INNOVATION SPACES"],
                "rooms": [
                    {"roomId": "M-ERIC-200", "roomNumber": "200", "roomName": "LARGE CLASSROOM", "floor": 2, "roomUseCode": "110.0", "stations": "90", "area": "2400", "department": "GENERAL USE", "faculty": "", "building": "M-ERIC"},
                    {"roomId": "M-ERIC-300", "roomNumber": "300", "roomName": "CLASSROOM", "floor": 3, "roomUseCode": "110.0", "stations": "75", "area": "2100", "department": "GENERAL USE", "faculty": "", "building": "M-ERIC"},
                    {"roomId": "M-ERIC-400", "roomNumber": "400", "roomName": "CLASSROOM", "floor": 4, "roomUseCode": "110.0", "stations": "75", "area": "2100", "department": "GENERAL USE", "faculty": "", "building": "M-ERIC"}
                ]
            },
            "FortIRC": {
                "name": "Fort IRC (Innovation Research Center)",
                "totalRooms": 30,
                "floors": 3,
                "departments": ["ADVANCED RESEARCH", "DEVELOPMENT"],
                "rooms": [
                    {"roomId": "FortIRC-101", "roomNumber": "101", "roomName": "RESEARCH LAB", "floor": 1, "roomUseCode": "250.0", "stations": "15", "area": "800", "department": "RESEARCH", "faculty": "", "building": "FortIRC"},
                    {"roomId": "FortIRC-201", "roomNumber": "201", "roomName": "DEVELOPMENT LAB", "floor": 2, "roomUseCode": "250.0", "stations": "20", "area": "1000", "department": "RESEARCH", "faculty": "", "building": "FortIRC"}
                ]
            }
        };
    }

    setupEventListeners() {
        // Global search
        const searchInput = document.getElementById('globalSearch');
        const searchBtn = document.getElementById('searchBtn');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.handleSearch(searchInput.value));
        }
        
        // Breadcrumb navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-view]')) {
                e.preventDefault();
                this.navigateToView(e.target.dataset.view, e.target.dataset);
            }
        });

        // Filter listeners
        const roomUseFilter = document.getElementById('roomUseFilter');
        const departmentFilter = document.getElementById('departmentFilter');
        const stationsFilter = document.getElementById('stationsFilter');

        if (roomUseFilter) roomUseFilter.addEventListener('change', () => this.applyFilters());
        if (departmentFilter) departmentFilter.addEventListener('change', () => this.applyFilters());
        if (stationsFilter) stationsFilter.addEventListener('input', () => this.applyFilters());
    }

    generateBuildingCards() {
        const grid = document.getElementById('buildingsGrid');
        if (!grid) return;

        const buildingIcons = {
            'McNair': '🏛️',
            'Graham': '🏢', 
            'Monroe': '🏫',
            'M-ERIC': '🔬',
            'Hines': '🧪',
            'FortIRC': '⚡'
        };

        grid.innerHTML = Object.entries(this.buildingsData).map(([key, building]) => `
            <div class="building-card" onclick="app.viewBuilding('${key}')">
                <div class="building-header">
                    <div class="building-icon">${buildingIcons[key] || '🏢'}</div>
                    <div class="building-info">
                        <h3>${building.name}</h3>
                    </div>
                </div>
                <div class="building-stats">
                    <div class="stat-item">
                        <span class="stat-value">${building.totalRooms}</span>
                        <span class="stat-label">Rooms</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${building.floors}</span>
                        <span class="stat-label">Floors</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${building.departments.length}</span>
                        <span class="stat-label">Depts</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${building.rooms.length}</span>
                        <span class="stat-label">Listed</span>
                    </div>
                </div>
                <div class="building-departments">
                    <div class="departments-list">
                        ${building.departments.slice(0, 3).map(dept => 
                            `<span class="department-tag">${dept}</span>`
                        ).join('')}
                        ${building.departments.length > 3 ? `<span class="department-tag">+${building.departments.length - 3}</span>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    generateBuildingTabs() {
        const tabsContainer = document.getElementById('tabsContainer');
        if (!tabsContainer) return;

        tabsContainer.innerHTML = Object.entries(this.buildingsData).map(([key, building]) => `
            <button class="building-tab" onclick="app.viewBuilding('${key}')" data-building="${key}">
                ${building.name.replace(' Hall', '').replace(' (Martin Sr. Engineering Research & Innovation Complex)', '').replace(' (Innovation Research Center)', '')}
            </button>
        `).join('');
    }

    viewBuilding(buildingKey) {
        this.currentBuilding = { key: buildingKey, ...this.buildingsData[buildingKey] };
        this.currentFloor = null;
        this.currentRoom = null;
        this.currentView = 'building';
        
        this.showView('buildingView');
        this.generateBuildingView();
        this.updateBreadcrumb();
        this.updateBuildingTabs();
    }

    generateBuildingView() {
        const header = document.getElementById('buildingHeader');
        const floorsGrid = document.getElementById('floorsGrid');
        
        if (!header || !floorsGrid || !this.currentBuilding) return;

        const buildingIcons = {
            'McNair': '🏛️',
            'Graham': '🏢', 
            'Monroe': '🏫',
            'M-ERIC': '🔬',
            'Hines': '🧪',
            'FortIRC': '⚡'
        };

        header.innerHTML = `
            <div class="building-detail-card card">
                <div class="building-header">
                    <div class="building-icon">${buildingIcons[this.currentBuilding.key] || '🏢'}</div>
                    <div class="building-info">
                        <h2>${this.currentBuilding.name}</h2>
                        <p>Engineering Facility</p>
                    </div>
                </div>
                <div class="building-stats">
                    <div class="stat-item">
                        <span class="stat-value">${this.currentBuilding.totalRooms}</span>
                        <span class="stat-label">Total Rooms</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${this.currentBuilding.floors}</span>
                        <span class="stat-label">Floors</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${this.currentBuilding.rooms.length}</span>
                        <span class="stat-label">Listed Rooms</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${this.currentBuilding.departments.length}</span>
                        <span class="stat-label">Departments</span>
                    </div>
                </div>
                <div class="building-departments">
                    <h4>Departments</h4>
                    <div class="departments-list">
                        ${this.currentBuilding.departments.map(dept => 
                            `<span class="department-tag">${dept}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;

        // Generate floor buttons based on actual floors with rooms
        const floorsWithRooms = [...new Set(this.currentBuilding.rooms.map(room => room.floor))].sort((a, b) => a - b);
        
        floorsGrid.innerHTML = floorsWithRooms.map(floor => {
            const roomCount = this.currentBuilding.rooms.filter(room => room.floor === floor).length;
            return `
                <button class="floor-btn" onclick="app.viewFloor(${floor})">
                    Floor ${floor}
                    <div style="font-size: 14px; margin-top: 4px; opacity: 0.8;">
                        ${roomCount} rooms
                    </div>
                </button>
            `;
        }).join('');
    }

    viewFloor(floor) {
        this.currentFloor = floor;
        this.currentRoom = null;
        this.currentView = 'floor';
        
        this.showView('floorView');
        this.generateFloorView();
        this.updateBreadcrumb();
    }

    generateFloorView() {
        const header = document.getElementById('floorHeader');
        const currentFloorDisplay = document.getElementById('currentFloorDisplay');
        const roomUseFilter = document.getElementById('roomUseFilter');
        const departmentFilter = document.getElementById('departmentFilter');
        
        if (!header || !this.currentBuilding) return;

        header.innerHTML = `
            <div class="floor-detail-card card">
                <h2>${this.currentBuilding.name} - Floor ${this.currentFloor}</h2>
                <p>Select a room from the sidebar to view detailed information</p>
            </div>
        `;

        if (currentFloorDisplay) {
            currentFloorDisplay.textContent = this.currentFloor;
        }

        // Get rooms for current floor
        const floorRooms = this.currentBuilding.rooms.filter(room => room.floor === this.currentFloor);
        
        // Populate filters
        if (roomUseFilter) {
            const roomUseCodes = [...new Set(floorRooms.map(room => room.roomUseCode))].sort();
            roomUseFilter.innerHTML = `
                <option value="">All Room Types</option>
                ${roomUseCodes.map(code => `<option value="${code}">${this.getRoomTypeFromCode(code)} (${code})</option>`).join('')}
            `;
        }

        if (departmentFilter) {
            const departments = [...new Set(floorRooms.map(room => room.department))].sort();
            departmentFilter.innerHTML = `
                <option value="">All Departments</option>
                ${departments.map(dept => `<option value="${dept}">${dept}</option>`).join('')}
            `;
        }

        this.filteredRooms = floorRooms;
        this.displayRoomList();
        this.showRoomPlaceholder();
    }

    getRoomTypeFromCode(code) {
        const codeMap = {
            '110.0': 'Classroom',
            '210.0': 'Laboratory',
            '215.0': 'Storage',
            '220.0': 'Computer Lab',
            '250.0': 'Research Lab',
            '310.0': 'Office'
        };
        return codeMap[code] || 'General Use';
    }

    displayRoomList() {
        const roomList = document.getElementById('roomList');
        if (!roomList) return;

        roomList.innerHTML = this.filteredRooms.map(room => `
            <li class="room-list-item">
                <button class="room-list-btn" onclick="app.selectRoom('${room.roomId}')" data-room-id="${room.roomId}">
                    <div style="font-weight: 700; margin-bottom: 4px;">Room ${room.roomNumber}</div>
                    <div style="font-size: 12px; opacity: 0.8;">${room.roomName}</div>
                </button>
            </li>
        `).join('');
    }

    selectRoom(roomId) {
        this.currentRoom = this.filteredRooms.find(room => room.roomId === roomId);
        if (!this.currentRoom) return;

        // Update active state in room list
        document.querySelectorAll('.room-list-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-room-id="${roomId}"]`)?.classList.add('active');

        this.displayRoomDetails();
        this.updateBreadcrumb();
    }

    displayRoomDetails() {
        const roomDetail = document.getElementById('roomDetail');
        const roomPlaceholder = document.getElementById('roomPlaceholder');
        
        if (!roomDetail || !this.currentRoom) return;

        roomPlaceholder.style.display = 'none';
        roomDetail.style.display = 'block';

        roomDetail.innerHTML = `
            <div class="room-detail-header">
                <h2 class="room-detail-title">Room ${this.currentRoom.roomNumber}</h2>
                <p class="room-detail-subtitle">${this.currentRoom.roomName}</p>
            </div>
            <div class="room-detail-grid">
                <div class="detail-section">
                    <h4>Basic Information</h4>
                    <div class="room-detail">
                        <span class="detail-label">Room Name</span>
                        <span class="detail-value">${this.currentRoom.roomName}</span>
                    </div>
                    <div class="room-detail">
                        <span class="detail-label">Room Number</span>
                        <span class="detail-value">${this.currentRoom.roomNumber}</span>
                    </div>
                    <div class="room-detail">
                        <span class="detail-label">Room Use Code</span>
                        <span class="detail-value">${this.currentRoom.roomUseCode}</span>
                    </div>
                    <div class="room-detail">
                        <span class="detail-label">Stations</span>
                        <span class="detail-value">${this.currentRoom.stations || 'N/A'}</span>
                    </div>
                    <div class="room-detail">
                        <span class="detail-label">Area (sq ft)</span>
                        <span class="detail-value">${this.currentRoom.area || 'N/A'}</span>
                    </div>
                </div>
                <div class="detail-section">
                    <h4>Department & Faculty</h4>
                    <div class="room-detail">
                        <span class="detail-label">Department</span>
                        <span class="detail-value">${this.currentRoom.department}</span>
                    </div>
                    <div class="room-detail">
                        <span class="detail-label">Responsible Party</span>
                        <span class="detail-value">${this.currentRoom.faculty || 'Not assigned'}</span>
                    </div>
                    <div class="room-detail">
                        <span class="detail-label">Building</span>
                        <span class="detail-value">${this.currentRoom.building}</span>
                    </div>
                    <div class="room-detail">
                        <span class="detail-label">Floor</span>
                        <span class="detail-value">Floor ${this.currentRoom.floor}</span>
                    </div>
                </div>
                <div class="detail-section">
                    <h4>Future Assets</h4>
                    <div class="detail-value" style="text-align: center; color: var(--color-text-secondary); font-style: italic;">
                        No assets listed
                    </div>
                </div>
            </div>
        `;
    }

    showRoomPlaceholder() {
        const roomDetail = document.getElementById('roomDetail');
        const roomPlaceholder = document.getElementById('roomPlaceholder');
        
        if (roomDetail && roomPlaceholder) {
            roomDetail.style.display = 'none';
            roomPlaceholder.style.display = 'flex';
        }
    }

    applyFilters() {
        if (!this.currentBuilding || !this.currentFloor) return;

        const roomUseFilter = document.getElementById('roomUseFilter')?.value;
        const departmentFilter = document.getElementById('departmentFilter')?.value;
        const stationsFilter = parseInt(document.getElementById('stationsFilter')?.value) || 0;

        const allFloorRooms = this.currentBuilding.rooms.filter(room => room.floor === this.currentFloor);
        
        this.filteredRooms = allFloorRooms.filter(room => {
            const stationsCount = parseInt(room.stations) || 0;
            return (!roomUseFilter || room.roomUseCode === roomUseFilter) &&
                   (!departmentFilter || room.department === departmentFilter) &&
                   (stationsCount >= stationsFilter);
        });

        this.displayRoomList();
        this.showRoomPlaceholder();
        // Clear any selected room when filters change
        document.querySelectorAll('.room-list-btn').forEach(btn => btn.classList.remove('active'));
    }

    handleSearch(query) {
        if (!query.trim()) return;

        const searchResults = [];
        
        // Search through all buildings and rooms
        Object.entries(this.buildingsData).forEach(([key, building]) => {
            // Search building names
            if (building.name.toLowerCase().includes(query.toLowerCase())) {
                searchResults.push({ type: 'building', key, data: building });
            }
            
            // Search departments
            if (building.departments.some(dept => dept.toLowerCase().includes(query.toLowerCase()))) {
                searchResults.push({ type: 'building', key, data: building });
            }
            
            // Search rooms
            building.rooms.forEach(room => {
                if (room.roomName.toLowerCase().includes(query.toLowerCase()) ||
                    room.roomNumber.includes(query) ||
                    room.department.toLowerCase().includes(query.toLowerCase())) {
                    searchResults.push({ type: 'room', key, room, building: building });
                }
            });
        });

        // For demo, navigate to first result
        if (searchResults.length > 0) {
            const firstResult = searchResults[0];
            if (firstResult.type === 'building') {
                this.viewBuilding(firstResult.key);
            } else if (firstResult.type === 'room') {
                this.viewBuilding(firstResult.key);
                setTimeout(() => {
                    this.viewFloor(firstResult.room.floor);
                    setTimeout(() => {
                        this.selectRoom(firstResult.room.roomId);
                    }, 100);
                }, 100);
            }
        }
    }

    showView(viewId) {
        document.querySelectorAll('.view-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(viewId)?.classList.add('active');
    }

    updateBuildingTabs() {
        document.querySelectorAll('.building-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.building === this.currentBuilding?.key) {
                tab.classList.add('active');
            }
        });
    }

    updateBreadcrumb() {
        const breadcrumbList = document.getElementById('breadcrumbList');
        if (!breadcrumbList) return;

        let breadcrumbs = [
            { text: 'Home', view: 'home' }
        ];

        if (this.currentBuilding) {
            breadcrumbs.push({
                text: this.currentBuilding.name.replace(' Hall', '').replace(' (Martin Sr. Engineering Research & Innovation Complex)', '').replace(' (Innovation Research Center)', ''),
                view: 'building',
                buildingKey: this.currentBuilding.key
            });
        }

        if (this.currentFloor) {
            breadcrumbs.push({
                text: `Floor ${this.currentFloor}`,
                view: 'floor',
                buildingKey: this.currentBuilding.key,
                floor: this.currentFloor
            });
        }

        if (this.currentRoom) {
            breadcrumbs.push({
                text: `Room ${this.currentRoom.roomNumber}`,
                view: 'room',
                buildingKey: this.currentBuilding.key,
                floor: this.currentFloor,
                roomId: this.currentRoom.roomId
            });
        }

        breadcrumbList.innerHTML = breadcrumbs.map((crumb, index) => {
            const isActive = index === breadcrumbs.length - 1;
            const dataAttrs = Object.keys(crumb)
                .filter(key => key !== 'text')
                .map(key => `data-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}="${crumb[key]}"`)
                .join(' ');

            return `
                <li class="breadcrumb-item ${isActive ? 'active' : ''}">
                    <a href="#" ${dataAttrs}>${crumb.text}</a>
                </li>
            `;
        }).join('');
    }

    navigateToView(view, dataset = {}) {
        switch (view) {
            case 'home':
                this.currentView = 'home';
                this.currentBuilding = null;
                this.currentFloor = null;
                this.currentRoom = null;
                this.showView('homeView');
                document.querySelectorAll('.building-tab').forEach(tab => tab.classList.remove('active'));
                break;
            case 'building':
                if (dataset.buildingKey) {
                    this.viewBuilding(dataset.buildingKey);
                }
                break;
            case 'floor':
                if (dataset.buildingKey && dataset.floor) {
                    this.currentBuilding = { key: dataset.buildingKey, ...this.buildingsData[dataset.buildingKey] };
                    this.viewFloor(parseInt(dataset.floor));
                }
                break;
            case 'room':
                if (dataset.buildingKey && dataset.floor && dataset.roomId) {
                    this.currentBuilding = { key: dataset.buildingKey, ...this.buildingsData[dataset.buildingKey] };
                    this.currentFloor = parseInt(dataset.floor);
                    this.viewFloor(this.currentFloor);
                    setTimeout(() => {
                        this.selectRoom(dataset.roomId);
                    }, 100);
                }
                break;
        }
        this.updateBreadcrumb();
    }
}

// Initialize the application
const app = new FacilitiesBrowser();