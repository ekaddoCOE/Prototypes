// NC A&T College of Engineering Facilities Browser
// Enhanced Version with Improved Header Contrast

class FacilitiesBrowser {
    constructor() {
        this.currentView = 'home';
        this.currentBuilding = null;
        this.currentFloor = null;
        this.currentRoom = null;
        this.buildings = [];
        this.rooms = {};
        this.filteredRooms = [];
        
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.generateBuildingCards();
        this.updateBreadcrumb();
    }

    loadData() {
        // Building data from provided JSON
        this.buildings = [
            {
                id: "mcnair",
                name: "McNair Hall",
                rooms: 150,
                floors: 6,
                departments: ["Chemical Engineering", "Bioengineering", "Electrical Engineering", "Civil Engineering", "Industrial Engineering"],
                totalSqFt: 55858,
                icon: "🏛️"
            },
            {
                id: "graham", 
                name: "Graham Hall",
                rooms: 45,
                floors: 3,
                departments: ["Mechanical Engineering", "Civil/Architectural/Environmental Engineering", "Industrial Systems Engineering", "Computer Science"],
                totalSqFt: 23969,
                icon: "🏢"
            },
            {
                id: "monroe",
                name: "Monroe Hall", 
                rooms: 80,
                floors: 3,
                departments: ["Bioengineering", "Mechanical Engineering", "Electrical Engineering", "Industrial Engineering", "Computer Science"],
                totalSqFt: 39879,
                icon: "🏫"
            },
            {
                id: "meric",
                name: "M-ERIC",
                rooms: 50,
                floors: 4,
                departments: ["Multi-disciplinary Research", "Innovation"],
                totalSqFt: 32000,
                icon: "🔬"
            },
            {
                id: "hines",
                name: "Hines Hall",
                rooms: 25, 
                floors: 2,
                departments: ["Research Facilities"],
                totalSqFt: 12510,
                icon: "🧪"
            },
            {
                id: "fortirc",
                name: "Fort IRC",
                rooms: 30,
                floors: 3,
                departments: ["Advanced Research", "Development"],
                totalSqFt: 15000,
                icon: "⚡"
            }
        ];

        // Generate comprehensive room data for each building
        this.generateRoomData();
    }

    generateRoomData() {
        const roomTypes = ['Laboratory', 'Classroom', 'Tutorial Room', 'Office', 'Conference Room', 'Study Room'];
        const roomPrefixes = ['Computer', 'Electronics', 'Research', 'Student', 'Faculty', 'Teaching'];
        const roomSuffixes = ['Lab', 'Room', 'Center', 'Studio', 'Workshop'];

        this.buildings.forEach(building => {
            this.rooms[building.id] = {};
            
            for (let floor = 1; floor <= building.floors; floor++) {
                this.rooms[building.id][floor] = [];
                const roomsPerFloor = Math.ceil(building.rooms / building.floors);
                
                for (let i = 0; i < roomsPerFloor; i++) {
                    const roomNumber = `${floor}${String(i + 1).padStart(2, '0')}`;
                    const type = roomTypes[Math.floor(Math.random() * roomTypes.length)];
                    const prefix = roomPrefixes[Math.floor(Math.random() * roomPrefixes.length)];
                    const suffix = roomSuffixes[Math.floor(Math.random() * roomSuffixes.length)];
                    const department = building.departments[Math.floor(Math.random() * building.departments.length)];
                    
                    let name, capacity, sqft;
                    
                    switch (type) {
                        case 'Laboratory':
                            name = `${prefix} ${suffix}`;
                            capacity = Math.floor(Math.random() * 30) + 10;
                            sqft = Math.floor(Math.random() * 800) + 400;
                            break;
                        case 'Classroom':
                            name = `${prefix} Classroom`;
                            capacity = Math.floor(Math.random() * 40) + 20;
                            sqft = Math.floor(Math.random() * 600) + 300;
                            break;
                        case 'Tutorial Room':
                            name = `${prefix} Tutorial`;
                            capacity = Math.floor(Math.random() * 8) + 4;
                            sqft = Math.floor(Math.random() * 200) + 100;
                            break;
                        case 'Office':
                            name = `Faculty Office`;
                            capacity = Math.floor(Math.random() * 4) + 2;
                            sqft = Math.floor(Math.random() * 150) + 100;
                            break;
                        case 'Conference Room':
                            name = `Conference Room`;
                            capacity = Math.floor(Math.random() * 20) + 8;
                            sqft = Math.floor(Math.random() * 400) + 200;
                            break;
                        default:
                            name = `${prefix} ${suffix}`;
                            capacity = Math.floor(Math.random() * 15) + 5;
                            sqft = Math.floor(Math.random() * 300) + 150;
                    }

                    this.rooms[building.id][floor].push({
                        room: roomNumber,
                        name: name,
                        type: type,
                        sqft: sqft,
                        capacity: capacity,
                        department: department,
                        floor: floor,
                        building: building.name,
                        equipment: this.generateEquipment(type),
                        faculty: this.generateFaculty(),
                        usageCode: this.generateUsageCode(type)
                    });
                }
            }
        });
    }

    generateEquipment(type) {
        const equipment = {
            'Laboratory': ['Computers', 'Lab Benches', 'Safety Equipment', 'Microscopes', 'Measurement Tools'],
            'Classroom': ['Projector', 'Whiteboard', 'Audio System', 'Student Desks', 'Instructor Station'],
            'Tutorial Room': ['Tables', 'Chairs', 'Whiteboard', 'Computer', 'Printer'],
            'Office': ['Desk', 'Chair', 'Computer', 'Filing Cabinet', 'Bookshelf'],
            'Conference Room': ['Conference Table', 'Chairs', 'Projector', 'Video Conferencing', 'Whiteboard']
        };
        
        return equipment[type] || ['Basic Furniture'];
    }

    generateFaculty() {
        const facultyNames = [
            'Dr. Johnson', 'Prof. Williams', 'Dr. Brown', 'Prof. Davis', 'Dr. Miller',
            'Prof. Wilson', 'Dr. Moore', 'Prof. Taylor', 'Dr. Anderson', 'Prof. Thomas'
        ];
        return facultyNames[Math.floor(Math.random() * facultyNames.length)];
    }

    generateUsageCode(type) {
        const codes = {
            'Laboratory': 'LAB',
            'Classroom': 'CLS',
            'Tutorial Room': 'TUT',
            'Office': 'OFF',
            'Conference Room': 'CNF'
        };
        return codes[type] || 'GEN';
    }

    setupEventListeners() {
        // Global search
        const searchInput = document.getElementById('globalSearch');
        const searchBtn = document.getElementById('searchBtn');
        
        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        searchBtn.addEventListener('click', () => this.handleSearch(searchInput.value));
        
        // Breadcrumb navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-view]')) {
                e.preventDefault();
                this.navigateToView(e.target.dataset.view, e.target.dataset);
            }
        });

        // Filter listeners
        document.getElementById('typeFilter')?.addEventListener('change', () => this.applyFilters());
        document.getElementById('departmentFilter')?.addEventListener('change', () => this.applyFilters());
        document.getElementById('capacityFilter')?.addEventListener('input', () => this.applyFilters());
    }

    generateBuildingCards() {
        const grid = document.getElementById('buildingsGrid');
        if (!grid) return;

        grid.innerHTML = this.buildings.map(building => `
            <div class="building-card" onclick="app.viewBuilding('${building.id}')">
                <div class="building-header">
                    <div class="building-icon">${building.icon}</div>
                    <div class="building-info">
                        <h3>${building.name}</h3>
                    </div>
                </div>
                <div class="building-stats">
                    <div class="stat-item">
                        <span class="stat-value">${building.rooms}</span>
                        <span class="stat-label">Rooms</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${building.floors}</span>
                        <span class="stat-label">Floors</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${(building.totalSqFt / 1000).toFixed(1)}K</span>
                        <span class="stat-label">Sq Ft</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${building.departments.length}</span>
                        <span class="stat-label">Depts</span>
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

    viewBuilding(buildingId) {
        this.currentBuilding = this.buildings.find(b => b.id === buildingId);
        if (!this.currentBuilding) return;

        this.currentView = 'building';
        this.showView('buildingView');
        this.generateBuildingView();
        this.updateBreadcrumb();
    }

    generateBuildingView() {
        const header = document.getElementById('buildingHeader');
        const floorsGrid = document.getElementById('floorsGrid');
        
        if (!header || !floorsGrid || !this.currentBuilding) return;

        header.innerHTML = `
            <div class="building-detail-card card">
                <div class="building-header">
                    <div class="building-icon">${this.currentBuilding.icon}</div>
                    <div class="building-info">
                        <h2>${this.currentBuilding.name}</h2>
                        <p>Engineering Facility</p>
                    </div>
                </div>
                <div class="building-stats">
                    <div class="stat-item">
                        <span class="stat-value">${this.currentBuilding.rooms}</span>
                        <span class="stat-label">Total Rooms</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${this.currentBuilding.floors}</span>
                        <span class="stat-label">Floors</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${this.currentBuilding.totalSqFt.toLocaleString()}</span>
                        <span class="stat-label">Square Feet</span>
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

        floorsGrid.innerHTML = Array.from({ length: this.currentBuilding.floors }, (_, i) => {
            const floor = i + 1;
            const roomCount = this.rooms[this.currentBuilding.id][floor]?.length || 0;
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
        this.currentView = 'floor';
        this.showView('floorView');
        this.generateFloorView();
        this.updateBreadcrumb();
    }

    generateFloorView() {
        const header = document.getElementById('floorHeader');
        const departmentFilter = document.getElementById('departmentFilter');
        
        if (!header || !this.currentBuilding) return;

        header.innerHTML = `
            <div class="floor-detail-card card">
                <h2>${this.currentBuilding.name} - Floor ${this.currentFloor}</h2>
                <p>Select a room to view detailed information</p>
            </div>
        `;

        // Populate department filter
        if (departmentFilter) {
            const departments = [...new Set(this.currentBuilding.departments)];
            departmentFilter.innerHTML = `
                <option value="">All Departments</option>
                ${departments.map(dept => `<option value="${dept}">${dept}</option>`).join('')}
            `;
        }

        this.filteredRooms = this.rooms[this.currentBuilding.id][this.currentFloor] || [];
        this.displayRooms();
    }

    displayRooms() {
        const roomsGrid = document.getElementById('roomsGrid');
        if (!roomsGrid) return;

        roomsGrid.innerHTML = this.filteredRooms.map(room => `
            <div class="room-card" onclick="app.viewRoom('${room.room}')">
                <div class="room-number">Room ${room.room}</div>
                <div class="room-name">${room.name}</div>
                <div class="room-details">
                    <div class="room-detail">
                        <span class="detail-label">Type</span>
                        <span class="detail-value">${room.type}</span>
                    </div>
                    <div class="room-detail">
                        <span class="detail-label">Capacity</span>
                        <span class="detail-value">${room.capacity}</span>
                    </div>
                    <div class="room-detail">
                        <span class="detail-label">Square Feet</span>
                        <span class="detail-value">${room.sqft}</span>
                    </div>
                    <div class="room-detail">
                        <span class="detail-label">Department</span>
                        <span class="detail-value">${room.department}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    viewRoom(roomNumber) {
        this.currentRoom = this.filteredRooms.find(room => room.room === roomNumber);
        if (!this.currentRoom) return;

        this.currentView = 'room';
        this.showView('roomView');
        this.generateRoomView();
        this.updateBreadcrumb();
    }

    generateRoomView() {
        const roomDetail = document.getElementById('roomDetail');
        if (!roomDetail || !this.currentRoom) return;

        roomDetail.innerHTML = `
            <div class="room-detail-card">
                <div class="room-detail-header">
                    <h2 class="room-detail-title">Room ${this.currentRoom.room}</h2>
                    <p class="room-detail-subtitle">${this.currentRoom.name}</p>
                </div>
                <div class="room-detail-grid">
                    <div class="detail-section">
                        <h4>Basic Information</h4>
                        <div class="room-detail">
                            <span class="detail-label">Room Type</span>
                            <span class="detail-value">${this.currentRoom.type}</span>
                        </div>
                        <div class="room-detail">
                            <span class="detail-label">Square Footage</span>
                            <span class="detail-value">${this.currentRoom.sqft} sq ft</span>
                        </div>
                        <div class="room-detail">
                            <span class="detail-label">Capacity</span>
                            <span class="detail-value">${this.currentRoom.capacity} people</span>
                        </div>
                        <div class="room-detail">
                            <span class="detail-label">Usage Code</span>
                            <span class="detail-value">${this.currentRoom.usageCode}</span>
                        </div>
                    </div>
                    <div class="detail-section">
                        <h4>Department & Faculty</h4>
                        <div class="room-detail">
                            <span class="detail-label">Department</span>
                            <span class="detail-value">${this.currentRoom.department}</span>
                        </div>
                        <div class="room-detail">
                            <span class="detail-label">Responsible Faculty</span>
                            <span class="detail-value">${this.currentRoom.faculty}</span>
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
                        <h4>Equipment & Resources</h4>
                        <div class="equipment-list">
                            ${this.currentRoom.equipment.map(item => 
                                `<div class="detail-value">• ${item}</div>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    applyFilters() {
        if (!this.currentBuilding || !this.currentFloor) return;

        const typeFilter = document.getElementById('typeFilter')?.value;
        const departmentFilter = document.getElementById('departmentFilter')?.value;
        const capacityFilter = parseInt(document.getElementById('capacityFilter')?.value) || 0;

        const allRooms = this.rooms[this.currentBuilding.id][this.currentFloor] || [];
        
        this.filteredRooms = allRooms.filter(room => {
            return (!typeFilter || room.type === typeFilter) &&
                   (!departmentFilter || room.department === departmentFilter) &&
                   (room.capacity >= capacityFilter);
        });

        this.displayRooms();
    }

    handleSearch(query) {
        if (!query.trim()) return;

        // Simple search implementation
        const results = [];
        this.buildings.forEach(building => {
            if (building.name.toLowerCase().includes(query.toLowerCase()) ||
                building.departments.some(dept => dept.toLowerCase().includes(query.toLowerCase()))) {
                results.push({ type: 'building', data: building });
            }
        });

        // For demo, just navigate to first result if it's a building
        if (results.length > 0 && results[0].type === 'building') {
            this.viewBuilding(results[0].data.id);
        }
    }

    showView(viewId) {
        document.querySelectorAll('.view-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(viewId)?.classList.add('active');
    }

    updateBreadcrumb() {
        const breadcrumbList = document.getElementById('breadcrumbList');
        if (!breadcrumbList) return;

        let breadcrumbs = [
            { text: 'Home', view: 'home' }
        ];

        if (this.currentBuilding) {
            breadcrumbs.push({
                text: this.currentBuilding.name,
                view: 'building',
                buildingId: this.currentBuilding.id
            });
        }

        if (this.currentFloor) {
            breadcrumbs.push({
                text: `Floor ${this.currentFloor}`,
                view: 'floor',
                buildingId: this.currentBuilding.id,
                floor: this.currentFloor
            });
        }

        if (this.currentRoom) {
            breadcrumbs.push({
                text: `Room ${this.currentRoom.room}`,
                view: 'room',
                buildingId: this.currentBuilding.id,
                floor: this.currentFloor,
                room: this.currentRoom.room
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
                break;
            case 'building':
                if (dataset.buildingId) {
                    this.viewBuilding(dataset.buildingId);
                }
                break;
            case 'floor':
                if (dataset.buildingId && dataset.floor) {
                    this.currentBuilding = this.buildings.find(b => b.id === dataset.buildingId);
                    this.viewFloor(parseInt(dataset.floor));
                }
                break;
            case 'room':
                if (dataset.buildingId && dataset.floor && dataset.room) {
                    this.currentBuilding = this.buildings.find(b => b.id === dataset.buildingId);
                    this.currentFloor = parseInt(dataset.floor);
                    this.viewRoom(dataset.room);
                }
                break;
        }
        this.updateBreadcrumb();
    }
}

// Initialize the application
const app = new FacilitiesBrowser();