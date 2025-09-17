// Lab and Manager Data with Image Integration
const labsData = [
    {"building": "Graham", "room": "203", "seats": 37, "computerType": "Tower", "department": "COE", "labManager": "Troy Mclaughlin", "purpose": "Computer Lab/Instructional", "image": null},
    {"building": "Graham", "room": "204", "seats": 31, "computerType": "Tower", "department": "COE", "labManager": "Troy Mclaughlin", "purpose": "Computer Lab/Instructional", "image": null},
    {"building": "Graham", "room": "206", "seats": 31, "computerType": "Tower", "department": "COE", "labManager": "Troy Mclaughlin", "purpose": "Computer Lab/Instructional", "image": "images/Grham206.jpg"},
    {"building": "Graham", "room": "307", "seats": 18, "computerType": "Tower", "department": "CAEE", "labManager": "Simon", "purpose": "Civil/Architectural Lab", "image": "images/Graham307.jpg"},
    {"building": "Graham", "room": "301", "seats": null, "computerType": null, "department": "CAEE", "labManager": "Simon", "purpose": "Civil/Architectural Lab", "image": "images/Graham301.jpg"},
    {"building": "McNair", "room": "212", "seats": 38, "computerType": "Tower", "department": "COE", "labManager": "Troy Mclaughlin", "purpose": "Dedicated/Main COE Computer Lab", "image": "images/McNair212.jpg"},
    {"building": "McNair", "room": "222", "seats": null, "computerType": null, "department": "COE", "labManager": "Troy Mclaughlin", "purpose": "Computer Center Office", "image": "images/McNair222.jpg"},
    {"building": "McNair", "room": "223", "seats": 26, "computerType": "VDI", "department": "COE", "labManager": "Troy Mclaughlin", "purpose": "Computer Lab/Instructional", "image": null},
    {"building": "McNair", "room": "224", "seats": 26, "computerType": "VDI", "department": "COE", "labManager": "Troy Mclaughlin", "purpose": "Computer Lab/Instructional", "image": "images/McNair224.jpg"},
    {"building": "Monroe", "room": "117", "seats": null, "computerType": "Tower", "department": "ECE", "labManager": "Mohammad", "purpose": "Dedicated Electrical/Senior design", "image": "images/Monroe117.jpg"},
    {"building": "Monroe", "room": "214", "seats": 35, "computerType": "Tower", "department": "ECE", "labManager": "Mohammad", "purpose": "ECE Freshman Laboratory", "image": null},
    {"building": "Monroe", "room": "217", "seats": 12, "computerType": "Tower", "department": "ECE", "labManager": "Mohammad", "purpose": "Dedicated Electrical", "image": "images/Monroe217.jpg"},
    {"building": "Monroe", "room": "223", "seats": null, "computerType": null, "department": "ECE", "labManager": "Mohammad", "purpose": "Specialized Lab", "image": "images/Monroe223.jpg"},
    {"building": "Monroe", "room": "121", "seats": 26, "computerType": "VDI", "department": "ECE", "labManager": "Mohammad", "purpose": "Computer Lab/Instructional", "image": null}
];

const managersData = [
    {"name": "Troy Mclaughlin", "department": "COE", "title": "Computer Operations Engineer"},
    {"name": "Simon", "department": "CAEE", "title": "Civil/Architectural Engineering Lab Manager"},
    {"name": "Mohammad", "department": "ECE", "title": "Electrical & Computer Engineering Lab Manager"}
];

// Modal functionality
class LabModal {
    constructor() {
        this.modal = document.getElementById('photoModal');
        this.overlay = document.getElementById('modalOverlay');
        this.closeBtn = document.getElementById('modalClose');
        this.title = document.getElementById('modalTitle');
        this.image = document.getElementById('modalImage');
        this.noPhotoMessage = document.getElementById('noPhotoMessage');
        this.details = document.getElementById('modalDetails');

        this.bindEvents();
    }

    bindEvents() {
        // Close modal events
        this.closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.close();
        });
        
        this.overlay.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.close();
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.close();
            }
        });

        // Prevent modal content clicks from closing modal
        this.modal.querySelector('.modal-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    open(lab) {
        this.populateModal(lab);
        this.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Focus trap for accessibility
        setTimeout(() => {
            this.closeBtn.focus();
        }, 100);
    }

    close() {
        this.modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    populateModal(lab) {
        // Set title
        this.title.textContent = `${lab.building} Room ${lab.room}`;

        // Handle image
        if (lab.image) {
            this.image.style.display = 'block';
            this.image.src = lab.image;
            this.image.alt = `${lab.building} Room ${lab.room} Laboratory - ${lab.image}`;
            this.noPhotoMessage.classList.add('hidden');
        } else {
            this.image.style.display = 'none';
            this.noPhotoMessage.classList.remove('hidden');
        }

        // Populate details
        this.details.innerHTML = this.createModalDetails(lab);
    }

    createModalDetails(lab) {
        const seatsDisplay = lab.seats ? `${lab.seats} seats` : 'N/A';
        const computerTypeDisplay = lab.computerType || 'N/A';
        const departmentClass = lab.department.toLowerCase();

        return `
            <div class="modal-lab-info">
                <div class="modal-lab-detail">
                    <span class="modal-lab-detail-label">Building</span>
                    <span class="modal-lab-detail-value">${lab.building}</span>
                </div>
                <div class="modal-lab-detail">
                    <span class="modal-lab-detail-label">Room Number</span>
                    <span class="modal-lab-detail-value">${lab.room}</span>
                </div>
                <div class="modal-lab-detail">
                    <span class="modal-lab-detail-label">Capacity</span>
                    <span class="modal-lab-detail-value">${seatsDisplay}</span>
                </div>
                <div class="modal-lab-detail">
                    <span class="modal-lab-detail-label">Computer Type</span>
                    <span class="modal-lab-detail-value">${computerTypeDisplay}</span>
                </div>
                <div class="modal-lab-detail">
                    <span class="modal-lab-detail-label">Department</span>
                    <span class="modal-lab-detail-value department-badge department-badge--${departmentClass}">${lab.department}</span>
                </div>
                <div class="modal-lab-detail">
                    <span class="modal-lab-detail-label">Lab Manager</span>
                    <span class="modal-lab-detail-value">${lab.labManager}</span>
                </div>
            </div>
            <div class="modal-purpose">
                <h4>Purpose</h4>
                <p>${lab.purpose}</p>
            </div>
        `;
    }
}

// Helper function to get initials from name
function getInitials(name) {
    return name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
}

// Helper function to format department name
function formatDepartment(dept) {
    const deptNames = {
        'COE': 'College of Engineering',
        'CAEE': 'Civil/Architectural Engineering',
        'ECE': 'Electrical & Computer Engineering'
    };
    return deptNames[dept] || dept;
}

// Create lab card HTML with photo indicator
function createLabCard(lab, index) {
    const seatsDisplay = lab.seats ? `${lab.seats} seats` : 'N/A';
    const computerTypeDisplay = lab.computerType || 'N/A';
    const departmentClass = lab.department.toLowerCase();
    const hasPhoto = lab.image !== null;
    const clickableClass = hasPhoto ? 'lab-card--clickable' : '';

    const photoIndicator = hasPhoto ? `
        <div class="photo-indicator">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="9" cy="9" r="2"></circle>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
            </svg>
            Click to view photo
        </div>
    ` : '';

    return `
        <div class="lab-card lab-card--${departmentClass} ${clickableClass}" data-lab-index="${index}">
            <div class="lab-header">
                <div class="lab-location">
                    <div class="lab-building">${lab.building}</div>
                    <div class="lab-room">Room ${lab.room}</div>
                </div>
                <div class="department-badge department-badge--${departmentClass}">
                    ${lab.department}
                </div>
            </div>
            
            <div class="lab-details">
                <div class="lab-detail">
                    <span class="lab-detail-label">Capacity</span>
                    <span class="lab-detail-value">${seatsDisplay}</span>
                </div>
                <div class="lab-detail">
                    <span class="lab-detail-label">Computer Type</span>
                    <span class="lab-detail-value">${computerTypeDisplay}</span>
                </div>
                <div class="lab-detail">
                    <span class="lab-detail-label">Lab Manager</span>
                    <span class="lab-detail-value">${lab.labManager}</span>
                </div>
            </div>
            
            <div class="lab-purpose">
                <strong>Purpose:</strong> ${lab.purpose}
            </div>
            
            ${photoIndicator}
        </div>
    `;
}

// Create manager profile HTML
function createManagerProfile(manager) {
    const departmentClass = manager.department.toLowerCase();
    const initials = getInitials(manager.name);
    const fullDeptName = formatDepartment(manager.department);

    return `
        <div class="manager-card">
            <div class="manager-avatar manager-avatar--${departmentClass}">
                ${initials}
            </div>
            <div class="manager-name">${manager.name}</div>
            <div class="manager-title">${manager.title}</div>
            <div class="manager-department">${manager.department}</div>
        </div>
    `;
}

// Initialize the page
function initializePage() {
    const labsGrid = document.getElementById('labsGrid');
    const managersGrid = document.getElementById('managersGrid');

    // Clear existing content
    labsGrid.innerHTML = '';
    managersGrid.innerHTML = '';

    // Sort labs by building and room for better organization
    const sortedLabs = [...labsData].sort((a, b) => {
        if (a.building !== b.building) {
            return a.building.localeCompare(b.building);
        }
        return a.room.localeCompare(b.room);
    });

    // Generate lab cards
    sortedLabs.forEach((lab, index) => {
        labsGrid.innerHTML += createLabCard(lab, index);
    });

    // Generate manager profiles
    managersData.forEach(manager => {
        managersGrid.innerHTML += createManagerProfile(manager);
    });

    // Add entrance animation
    setTimeout(() => {
        document.querySelectorAll('.lab-card, .manager-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 100);
}

// Add interactive features with photo modal
function addInteractivity() {
    const modal = new LabModal();

    // Add click event to lab cards
    document.addEventListener('click', (e) => {
        const labCard = e.target.closest('.lab-card');
        if (labCard) {
            e.preventDefault();
            const labIndex = parseInt(labCard.dataset.labIndex);
            
            // Sort labs the same way as in initializePage to get correct index
            const sortedLabs = [...labsData].sort((a, b) => {
                if (a.building !== b.building) {
                    return a.building.localeCompare(b.building);
                }
                return a.room.localeCompare(b.room);
            });
            
            const lab = sortedLabs[labIndex];
            
            if (lab) {
                modal.open(lab);
            }
        }

        const managerCard = e.target.closest('.manager-card');
        if (managerCard) {
            // Future enhancement: could show contact information
            console.log('Manager card clicked:', managerCard);
        }
    });

    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const focusedElement = document.activeElement;
            if (focusedElement.classList.contains('lab-card')) {
                e.preventDefault();
                focusedElement.click();
            }
        }
    });

    // Make lab cards focusable for accessibility
    setTimeout(() => {
        document.querySelectorAll('.lab-card').forEach(card => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            const building = card.querySelector('.lab-building').textContent;
            const room = card.querySelector('.lab-room').textContent.replace('Room ', '');
            card.setAttribute('aria-label', `View details for ${building} Room ${room}`);
        });
    }, 200);
}

// Add search/filter functionality
function addSearchFeature() {
    // Create search input
    const labsSection = document.querySelector('.labs-section');
    const searchContainer = document.createElement('div');
    searchContainer.style.cssText = `
        margin-bottom: 2rem;
        text-align: center;
    `;
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search labs by building, room, or department...';
    searchInput.className = 'form-control';
    searchInput.style.cssText = `
        max-width: 400px;
        margin: 0 auto;
        display: block;
    `;
    
    searchContainer.appendChild(searchInput);
    labsSection.insertBefore(searchContainer, labsSection.querySelector('.labs-grid'));

    // Add search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const labCards = document.querySelectorAll('.lab-card');

        labCards.forEach(card => {
            const text = card.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
            }
        });
    });
}

// Add statistics display
function addStatistics() {
    const stats = LabDirectory.getStatistics();
    const labsWithPhotos = labsData.filter(lab => lab.image).length;
    
    // Create stats display
    const statsContainer = document.createElement('div');
    statsContainer.className = 'stats-container';
    statsContainer.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
        padding: 1.5rem;
        background: var(--color-bg-3);
        border-radius: var(--radius-lg);
    `;

    statsContainer.innerHTML = `
        <div class="stat-item" style="text-align: center;">
            <div style="font-size: 2rem; font-weight: bold; color: var(--aggie-blue);">${stats.totalLabs}</div>
            <div style="font-size: 0.875rem; color: var(--color-text-secondary);">Total Labs</div>
        </div>
        <div class="stat-item" style="text-align: center;">
            <div style="font-size: 2rem; font-weight: bold; color: var(--coe-red);">${labsWithPhotos}</div>
            <div style="font-size: 0.875rem; color: var(--color-text-secondary);">With Photos</div>
        </div>
        <div class="stat-item" style="text-align: center;">
            <div style="font-size: 2rem; font-weight: bold; color: var(--aggie-gold); text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">${stats.buildings}</div>
            <div style="font-size: 0.875rem; color: var(--color-text-secondary);">Buildings</div>
        </div>
        <div class="stat-item" style="text-align: center;">
            <div style="font-size: 2rem; font-weight: bold; color: var(--ece-blue);">${stats.departments}</div>
            <div style="font-size: 0.875rem; color: var(--color-text-secondary);">Departments</div>
        </div>
    `;

    const labsSection = document.querySelector('.labs-section');
    const sectionTitle = labsSection.querySelector('.section-title');
    labsSection.insertBefore(statsContainer, sectionTitle.nextSibling);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
    setTimeout(() => {
        addInteractivity();
        addSearchFeature();
        addStatistics();
    }, 100);
});

// Add some utility functions for future enhancements
const LabDirectory = {
    // Get all labs by department
    getLabsByDepartment: (department) => {
        return labsData.filter(lab => lab.department === department);
    },

    // Get all labs by building
    getLabsByBuilding: (building) => {
        return labsData.filter(lab => lab.building === building);
    },

    // Get labs by manager
    getLabsByManager: (manager) => {
        return labsData.filter(lab => lab.labManager === manager);
    },

    // Get labs with photos
    getLabsWithPhotos: () => {
        return labsData.filter(lab => lab.image !== null);
    },

    // Get statistics
    getStatistics: () => {
        const totalLabs = labsData.length;
        const totalSeats = labsData.reduce((sum, lab) => sum + (lab.seats || 0), 0);
        const departments = [...new Set(labsData.map(lab => lab.department))];
        const buildings = [...new Set(labsData.map(lab => lab.building))];

        return {
            totalLabs,
            totalSeats,
            departments: departments.length,
            buildings: buildings.length,
            departmentList: departments,
            buildingList: buildings
        };
    }
};

// Make LabDirectory available globally for console debugging
window.LabDirectory = LabDirectory;