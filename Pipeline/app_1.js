class GrantManagementSystem {
    constructor() {
        this.grantsData = {
            "grants": [
                {
                    "id": "NSF-2024-001",
                    "title": "Advanced Manufacturing Systems for Sustainable Materials",
                    "pi": "Dr. Maria Rodriguez",
                    "coPI": "Dr. James Chen",
                    "department": "Mechanical Engineering",
                    "fundingAgency": "National Science Foundation",
                    "program": "Advanced Manufacturing",
                    "status": "Active",
                    "originalStartDate": "2024-09-01",
                    "originalEndDate": "2027-08-31",
                    "currentStartDate": "2024-09-01",
                    "currentEndDate": "2027-08-31",
                    "totalAmount": 875000,
                    "directCosts": 650000,
                    "indirectCosts": 225000,
                    "spentToDate": 245000,
                    "remainingBalance": 630000,
                    "percentComplete": 28,
                    "lastReportDate": "2024-12-01",
                    "nextReportDue": "2025-03-01",
                    "complianceStatus": "Compliant",
                    "riskLevel": "Low"
                },
                {
                    "id": "NIH-2023-014",
                    "title": "Biomedical Device Innovation for Healthcare Applications",
                    "pi": "Dr. Sarah Johnson",
                    "coPI": "Dr. Michael Zhang",
                    "department": "Biomedical Engineering",
                    "fundingAgency": "National Institutes of Health",
                    "program": "NIGMS - R01",
                    "status": "Active",
                    "originalStartDate": "2023-07-01",
                    "originalEndDate": "2026-06-30",
                    "currentStartDate": "2023-07-01",
                    "currentEndDate": "2027-06-30",
                    "totalAmount": 1250000,
                    "directCosts": 950000,
                    "indirectCosts": 300000,
                    "spentToDate": 625000,
                    "remainingBalance": 625000,
                    "percentComplete": 50,
                    "lastReportDate": "2024-11-15",
                    "nextReportDue": "2025-02-15",
                    "complianceStatus": "Extension Approved",
                    "riskLevel": "Medium"
                },
                {
                    "id": "DOD-2024-007",
                    "title": "Autonomous Systems for Defense Applications",
                    "pi": "Dr. Robert Kim",
                    "coPI": "Dr. Lisa Wang",
                    "department": "Electrical Engineering",
                    "fundingAgency": "Department of Defense",
                    "program": "DARPA - Young Faculty Award",
                    "status": "Active",
                    "originalStartDate": "2024-04-01",
                    "originalEndDate": "2026-03-31",
                    "currentStartDate": "2024-04-01",
                    "currentEndDate": "2026-03-31",
                    "totalAmount": 650000,
                    "directCosts": 485000,
                    "indirectCosts": 165000,
                    "spentToDate": 195000,
                    "remainingBalance": 455000,
                    "percentComplete": 30,
                    "lastReportDate": "2024-10-01",
                    "nextReportDue": "2025-01-01",
                    "complianceStatus": "Compliant",
                    "riskLevel": "Low"
                },
                {
                    "id": "IBM-2024-003",
                    "title": "AI-Driven Optimization for Industrial Processes",
                    "pi": "Dr. Thomas Anderson",
                    "coPI": "Dr. Jennifer Liu",
                    "department": "Computer Science",
                    "fundingAgency": "IBM Corporation",
                    "program": "Faculty Award",
                    "status": "Active",
                    "originalStartDate": "2024-01-15",
                    "originalEndDate": "2025-01-14",
                    "currentStartDate": "2024-01-15",
                    "currentEndDate": "2025-01-14",
                    "totalAmount": 125000,
                    "directCosts": 125000,
                    "indirectCosts": 0,
                    "spentToDate": 98000,
                    "remainingBalance": 27000,
                    "percentComplete": 78,
                    "lastReportDate": "2024-12-15",
                    "nextReportDue": "2025-01-14",
                    "complianceStatus": "Final Report Pending",
                    "riskLevel": "Low"
                },
                {
                    "id": "NSF-2022-045",
                    "title": "Sustainable Energy Systems Research Initiative",
                    "pi": "Dr. David Wilson",
                    "coPI": "Dr. Amy Thompson",
                    "department": "Civil Engineering",
                    "fundingAgency": "National Science Foundation",
                    "program": "CBET - Environmental Engineering",
                    "status": "Completed",
                    "originalStartDate": "2022-09-01",
                    "originalEndDate": "2024-08-31",
                    "currentStartDate": "2022-09-01",
                    "currentEndDate": "2024-08-31",
                    "totalAmount": 425000,
                    "directCosts": 315000,
                    "indirectCosts": 110000,
                    "spentToDate": 425000,
                    "remainingBalance": 0,
                    "percentComplete": 100,
                    "lastReportDate": "2024-09-30",
                    "nextReportDue": "N/A",
                    "complianceStatus": "Closed",
                    "riskLevel": "None"
                },
                {
                    "id": "FORD-2024-012",
                    "title": "Advanced Vehicle Technologies Research",
                    "pi": "Dr. Kevin Lee",
                    "coPI": "Dr. Rachel Brown",
                    "department": "Mechanical Engineering",
                    "fundingAgency": "Ford Motor Company",
                    "program": "University Research Program",
                    "status": "Pending Start",
                    "originalStartDate": "2025-03-01",
                    "originalEndDate": "2027-02-28",
                    "currentStartDate": "2025-03-01",
                    "currentEndDate": "2027-02-28",
                    "totalAmount": 750000,
                    "directCosts": 550000,
                    "indirectCosts": 200000,
                    "spentToDate": 0,
                    "remainingBalance": 750000,
                    "percentComplete": 0,
                    "lastReportDate": "N/A",
                    "nextReportDue": "2025-06-01",
                    "complianceStatus": "Setup Required",
                    "riskLevel": "Low"
                }
            ],
            "dashboardMetrics": {
                "totalActiveGrants": 5,
                "totalGrantValue": 3825000,
                "totalSpent": 1163000,
                "totalRemaining": 2662000,
                "averageCompletion": 37.2,
                "upcomingDeadlines": 3,
                "complianceIssues": 0,
                "grantsClosingSoon": 1
            }
        };

        this.currentView = 'dashboard';
        this.filteredGrants = [...this.grantsData.grants];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.populateFilters();
        this.updateDashboard();
        this.renderGrants();
        this.generateRecentActivity();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                if (e.target.dataset.view !== 'budget-planner') {
                    this.switchView(e.target.dataset.view);
                }
            });
        });

        // Dashboard actions
        document.getElementById('refresh-data').addEventListener('click', () => {
            this.refreshData();
        });

        document.getElementById('export-dashboard').addEventListener('click', () => {
            this.exportDashboard();
        });

        // Grant filters
        document.getElementById('status-filter').addEventListener('change', () => {
            this.filterGrants();
        });

        document.getElementById('agency-filter').addEventListener('change', () => {
            this.filterGrants();
        });

        document.getElementById('search-grants').addEventListener('input', () => {
            this.filterGrants();
        });

        // Report actions
        document.getElementById('generate-financial-report').addEventListener('click', () => {
            this.generateFinancialReport();
        });

        document.getElementById('generate-compliance-report').addEventListener('click', () => {
            this.generateComplianceReport();
        });

        document.getElementById('export-all-data').addEventListener('click', () => {
            this.exportAllData();
        });

        // Modal
        document.getElementById('close-modal').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('grant-detail-modal').addEventListener('click', (e) => {
            if (e.target.id === 'grant-detail-modal') {
                this.closeModal();
            }
        });
    }

    switchView(viewName) {
        // Update navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

        // Update views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(`${viewName}-view`).classList.add('active');

        this.currentView = viewName;

        // Load view-specific content
        if (viewName === 'grants') {
            this.renderGrants();
        } else if (viewName === 'reports') {
            this.loadReports();
        }
    }

    populateFilters() {
        const agencyFilter = document.getElementById('agency-filter');
        const agencies = [...new Set(this.grantsData.grants.map(grant => grant.fundingAgency))];
        
        agencies.forEach(agency => {
            const option = document.createElement('option');
            option.value = agency;
            option.textContent = agency;
            agencyFilter.appendChild(option);
        });
    }

    updateDashboard() {
        const metrics = this.calculateMetrics();
        
        // Update KPI cards
        document.getElementById('total-grant-value').textContent = this.formatCurrency(metrics.totalGrantValue);
        document.getElementById('active-grants').textContent = metrics.activeGrants;
        document.getElementById('total-spent').textContent = this.formatCurrency(metrics.totalSpent);
        document.getElementById('upcoming-deadlines').textContent = metrics.upcomingDeadlines;

        // Update financial overview
        document.getElementById('total-remaining').textContent = this.formatCurrency(metrics.totalRemaining);
        document.getElementById('average-completion').textContent = `${metrics.averageCompletion}%`;
        document.getElementById('closing-soon').textContent = metrics.grantsClosingSoon;

        // Update compliance overview
        document.getElementById('compliant-count').textContent = metrics.compliantGrants;
        document.getElementById('attention-count').textContent = metrics.needsAttention;
        document.getElementById('issues-count').textContent = metrics.complianceIssues;
    }

    calculateMetrics() {
        const activeGrants = this.grantsData.grants.filter(grant => 
            grant.status === 'Active' || grant.status === 'Pending Start'
        );

        const totalGrantValue = activeGrants.reduce((sum, grant) => sum + grant.totalAmount, 0);
        const totalSpent = activeGrants.reduce((sum, grant) => sum + grant.spentToDate, 0);
        const totalRemaining = activeGrants.reduce((sum, grant) => sum + grant.remainingBalance, 0);
        
        const averageCompletion = activeGrants.length > 0 
            ? (activeGrants.reduce((sum, grant) => sum + grant.percentComplete, 0) / activeGrants.length).toFixed(1)
            : 0;

        const upcomingDeadlines = this.getUpcomingDeadlines().length;
        const grantsClosingSoon = this.getGrantsClosingSoon().length;

        const compliantGrants = this.grantsData.grants.filter(grant => 
            grant.complianceStatus === 'Compliant'
        ).length;

        const needsAttention = this.grantsData.grants.filter(grant => 
            grant.complianceStatus === 'Extension Approved' || 
            grant.complianceStatus === 'Final Report Pending' ||
            grant.complianceStatus === 'Setup Required'
        ).length;

        const complianceIssues = this.grantsData.grants.filter(grant => 
            grant.complianceStatus.includes('Issue') || grant.riskLevel === 'High'
        ).length;

        return {
            activeGrants: activeGrants.length,
            totalGrantValue,
            totalSpent,
            totalRemaining,
            averageCompletion,
            upcomingDeadlines,
            grantsClosingSoon,
            compliantGrants,
            needsAttention,
            complianceIssues
        };
    }

    getUpcomingDeadlines() {
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);

        return this.grantsData.grants.filter(grant => {
            if (grant.nextReportDue === 'N/A') return false;
            const dueDate = new Date(grant.nextReportDue);
            return dueDate >= today && dueDate <= thirtyDaysFromNow;
        });
    }

    getGrantsClosingSoon() {
        const today = new Date();
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(today.getMonth() + 6);

        return this.grantsData.grants.filter(grant => {
            if (grant.status !== 'Active') return false;
            const endDate = new Date(grant.currentEndDate);
            return endDate >= today && endDate <= sixMonthsFromNow;
        });
    }

    generateRecentActivity() {
        const activityContainer = document.getElementById('recent-activity');
        const activities = [
            {
                icon: '📊',
                title: 'Financial report submitted for NSF-2024-001',
                time: '2 hours ago'
            },
            {
                icon: '✅',
                title: 'Compliance review completed for NIH-2023-014',
                time: '1 day ago'
            },
            {
                icon: '📋',
                title: 'New grant proposal submitted: DOD-2025-001',
                time: '3 days ago'
            },
            {
                icon: '⚠️',
                title: 'Report deadline approaching for IBM-2024-003',
                time: '1 week ago'
            }
        ];

        activityContainer.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">${activity.icon}</div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
    }

    filterGrants() {
        const statusFilter = document.getElementById('status-filter').value;
        const agencyFilter = document.getElementById('agency-filter').value;
        const searchTerm = document.getElementById('search-grants').value.toLowerCase();

        this.filteredGrants = this.grantsData.grants.filter(grant => {
            const matchesStatus = !statusFilter || grant.status === statusFilter;
            const matchesAgency = !agencyFilter || grant.fundingAgency === agencyFilter;
            const matchesSearch = !searchTerm || 
                grant.title.toLowerCase().includes(searchTerm) ||
                grant.pi.toLowerCase().includes(searchTerm) ||
                grant.id.toLowerCase().includes(searchTerm) ||
                grant.department.toLowerCase().includes(searchTerm);

            return matchesStatus && matchesAgency && matchesSearch;
        });

        this.renderGrants();
    }

    renderGrants() {
        const container = document.getElementById('grants-container');
        
        if (this.filteredGrants.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: white; border-radius: 12px; border: 1px solid var(--color-card-border);">
                    <div class="gear-icon" style="font-size: 48px; color: var(--color-text-secondary); margin-bottom: 16px;">⚙️</div>
                    <h3 style="color: var(--ncat-aggie-blue); margin-bottom: 8px;">No grants found</h3>
                    <p style="color: var(--color-text-secondary); margin: 0;">Try adjusting your filters or search criteria.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredGrants.map(grant => this.createGrantCard(grant)).join('');

        // Add click listeners to grant cards - Fixed implementation
        container.querySelectorAll('.grant-card').forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                // Prevent modal opening if clicking on interactive elements
                if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                    return;
                }
                const grantId = card.dataset.grantId;
                console.log('Opening grant detail for:', grantId); // Debug log
                this.showGrantDetail(grantId);
            });
        });
    }

    createGrantCard(grant) {
        const statusClass = grant.status.toLowerCase().replace(/\s+/g, '-');
        const hasExtension = grant.originalEndDate !== grant.currentEndDate;
        
        return `
            <div class="grant-card" data-grant-id="${grant.id}">
                <div class="grant-header">
                    <div class="grant-id">${grant.id}</div>
                    <div class="grant-status ${statusClass}">${grant.status}</div>
                </div>
                
                <h3 class="grant-title">${grant.title}</h3>
                
                <div class="grant-info">
                    <div class="grant-info-item">
                        <div class="grant-info-label">Principal Investigator</div>
                        <div class="grant-info-value">${grant.pi}</div>
                    </div>
                    <div class="grant-info-item">
                        <div class="grant-info-label">Department</div>
                        <div class="grant-info-value">${grant.department}</div>
                    </div>
                    <div class="grant-info-item">
                        <div class="grant-info-label">Funding Agency</div>
                        <div class="grant-info-value">${grant.fundingAgency}</div>
                    </div>
                    <div class="grant-info-item">
                        <div class="grant-info-label">Program</div>
                        <div class="grant-info-value">${grant.program}</div>
                    </div>
                </div>

                <div class="grant-dates">
                    <div class="date-section">
                        <div class="date-item">
                            <div class="date-label">Original Start Date</div>
                            <div class="date-value">${this.formatDate(grant.originalStartDate)}</div>
                        </div>
                        <div class="date-item">
                            <div class="date-label">Current Start Date</div>
                            <div class="date-value">${this.formatDate(grant.currentStartDate)}</div>
                        </div>
                        <div class="date-item">
                            <div class="date-label">Original End Date</div>
                            <div class="date-value">${this.formatDate(grant.originalEndDate)}</div>
                        </div>
                        <div class="date-item">
                            <div class="date-label">Current End Date</div>
                            <div class="date-value ${hasExtension ? 'date-extension' : ''}">${this.formatDate(grant.currentEndDate)}</div>
                        </div>
                    </div>
                    ${hasExtension ? '<div style="margin-top: 8px; font-size: 12px; color: var(--ncat-coe-red); font-style: italic;">* Extension approved</div>' : ''}
                </div>

                <div class="grant-financial">
                    <div class="financial-metric">
                        <div class="metric-value">${this.formatCurrency(grant.totalAmount)}</div>
                        <div class="metric-label">Total Amount</div>
                    </div>
                    <div class="financial-metric">
                        <div class="metric-value">${this.formatCurrency(grant.remainingBalance)}</div>
                        <div class="metric-label">Remaining</div>
                    </div>
                </div>

                <div class="grant-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${grant.percentComplete}%"></div>
                    </div>
                    <div class="progress-text">
                        <span class="progress-percentage">${grant.percentComplete}% Complete</span>
                        <span class="next-deadline">Next Report: ${grant.nextReportDue}</span>
                    </div>
                </div>

                <div class="grant-info">
                    <div class="grant-info-item">
                        <div class="grant-info-label">Compliance Status</div>
                        <div class="grant-info-value">${grant.complianceStatus}</div>
                    </div>
                    <div class="grant-info-item">
                        <div class="grant-info-label">Risk Level</div>
                        <div class="grant-info-value">${grant.riskLevel}</div>
                    </div>
                </div>
            </div>
        `;
    }

    showGrantDetail(grantId) {
        console.log('Showing grant detail for:', grantId); // Debug log
        const grant = this.grantsData.grants.find(g => g.id === grantId);
        if (!grant) {
            console.error('Grant not found:', grantId);
            return;
        }

        const modal = document.getElementById('grant-detail-modal');
        const content = document.getElementById('grant-detail-content');
        
        const hasExtension = grant.originalEndDate !== grant.currentEndDate;
        const budgetUtilization = ((grant.spentToDate / grant.totalAmount) * 100).toFixed(1);

        content.innerHTML = `
            <div class="grant-detail">
                <div class="detail-section">
                    <h4>Project Information</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Grant ID:</label>
                            <span>${grant.id}</span>
                        </div>
                        <div class="detail-item">
                            <label>Title:</label>
                            <span>${grant.title}</span>
                        </div>
                        <div class="detail-item">
                            <label>Principal Investigator:</label>
                            <span>${grant.pi}</span>
                        </div>
                        <div class="detail-item">
                            <label>Co-Principal Investigator:</label>
                            <span>${grant.coPI}</span>
                        </div>
                        <div class="detail-item">
                            <label>Department:</label>
                            <span>${grant.department}</span>
                        </div>
                        <div class="detail-item">
                            <label>Status:</label>
                            <span>${grant.status}</span>
                        </div>
                    </div>
                </div>

                <div class="detail-section">
                    <h4>Timeline Information</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Original Start Date:</label>
                            <span>${this.formatDate(grant.originalStartDate)}</span>
                        </div>
                        <div class="detail-item">
                            <label>Current Start Date:</label>
                            <span>${this.formatDate(grant.currentStartDate)}</span>
                        </div>
                        <div class="detail-item">
                            <label>Original End Date:</label>
                            <span>${this.formatDate(grant.originalEndDate)}</span>
                        </div>
                        <div class="detail-item">
                            <label>Current End Date:</label>
                            <span style="${hasExtension ? 'color: var(--ncat-coe-red); font-weight: bold;' : ''}">${this.formatDate(grant.currentEndDate)}</span>
                        </div>
                        ${hasExtension ? '<div class="detail-note" style="grid-column: 1 / -1; padding: 12px; background: rgba(164, 82, 72, 0.1); border-radius: 6px; color: var(--ncat-coe-red); font-style: italic;">Extension approved from original end date</div>' : ''}
                    </div>
                </div>

                <div class="detail-section">
                    <h4>Financial Information</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Total Amount:</label>
                            <span>${this.formatCurrency(grant.totalAmount)}</span>
                        </div>
                        <div class="detail-item">
                            <label>Direct Costs:</label>
                            <span>${this.formatCurrency(grant.directCosts)}</span>
                        </div>
                        <div class="detail-item">
                            <label>Indirect Costs:</label>
                            <span>${this.formatCurrency(grant.indirectCosts)}</span>
                        </div>
                        <div class="detail-item">
                            <label>Spent to Date:</label>
                            <span>${this.formatCurrency(grant.spentToDate)}</span>
                        </div>
                        <div class="detail-item">
                            <label>Remaining Balance:</label>
                            <span>${this.formatCurrency(grant.remainingBalance)}</span>
                        </div>
                        <div class="detail-item">
                            <label>Budget Utilization:</label>
                            <span>${budgetUtilization}%</span>
                        </div>
                    </div>
                </div>

                <div class="detail-section">
                    <h4>Reporting & Compliance</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Last Report Date:</label>
                            <span>${grant.lastReportDate}</span>
                        </div>
                        <div class="detail-item">
                            <label>Next Report Due:</label>
                            <span>${grant.nextReportDue}</span>
                        </div>
                        <div class="detail-item">
                            <label>Compliance Status:</label>
                            <span>${grant.complianceStatus}</span>
                        </div>
                        <div class="detail-item">
                            <label>Risk Level:</label>
                            <span>${grant.riskLevel}</span>
                        </div>
                        <div class="detail-item">
                            <label>Progress Complete:</label>
                            <span>${grant.percentComplete}%</span>
                        </div>
                    </div>
                </div>

                <div class="detail-actions" style="display: flex; gap: 12px; margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--color-border);">
                    <button class="btn btn--primary" onclick="window.grantSystem.downloadGrantReport('${grant.id}')">
                        <span class="gear-icon">📊</span>
                        Download Report
                    </button>
                    <button class="btn btn--secondary" onclick="window.grantSystem.editGrant('${grant.id}')">
                        <span class="gear-icon">✏️</span>
                        Edit Grant
                    </button>
                </div>
            </div>
        `;

        // Add styles for detail sections
        const styles = `
            .detail-section { margin-bottom: 24px; }
            .detail-section h4 { 
                color: var(--ncat-aggie-blue); 
                margin-bottom: 16px; 
                padding-bottom: 8px; 
                border-bottom: 2px solid var(--ncat-aggie-gold); 
            }
            .detail-grid { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
                gap: 12px; 
            }
            .detail-item { 
                display: flex; 
                justify-content: space-between; 
                padding: 8px; 
                background: rgba(0, 70, 132, 0.02); 
                border-radius: 6px; 
            }
            .detail-item label { 
                font-weight: 500; 
                color: var(--color-text-secondary); 
            }
            .detail-item span { 
                font-weight: 600; 
                color: var(--color-text); 
            }
        `;

        if (!document.querySelector('#detail-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'detail-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }

        modal.classList.add('active');
        console.log('Modal should now be visible'); // Debug log
    }

    closeModal() {
        document.getElementById('grant-detail-modal').classList.remove('active');
    }

    loadReports() {
        const reportsList = document.getElementById('generated-reports');
        const reports = [
            {
                name: 'Monthly Financial Summary',
                date: 'December 2024',
                type: 'financial'
            },
            {
                name: 'Compliance Status Report',
                date: 'November 2024',
                type: 'compliance'
            },
            {
                name: 'Grant Performance Analytics',
                date: 'November 2024',
                type: 'analytics'
            }
        ];

        reportsList.innerHTML = reports.map(report => `
            <div class="report-item">
                <div class="report-info">
                    <div class="report-name">${report.name}</div>
                    <div class="report-date">Generated: ${report.date}</div>
                </div>
                <button class="btn btn--outline" onclick="window.grantSystem.downloadReport('${report.name}', 'Sample report content for ${report.name}')">
                    <span class="gear-icon">📥</span>
                    Download
                </button>
            </div>
        `).join('');

        // Create visual chart representations
        this.createAgencyChart();
        this.createSpendingChart();
    }

    createAgencyChart() {
        const chartContainer = document.getElementById('agency-chart');
        const agencyTotals = {};
        
        this.grantsData.grants.forEach(grant => {
            if (!agencyTotals[grant.fundingAgency]) {
                agencyTotals[grant.fundingAgency] = 0;
            }
            agencyTotals[grant.fundingAgency] += grant.totalAmount;
        });

        const total = Object.values(agencyTotals).reduce((sum, amount) => sum + amount, 0);
        
        chartContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 8px;">
                ${Object.entries(agencyTotals).map(([agency, amount]) => {
                    const percentage = ((amount / total) * 100).toFixed(1);
                    return `
                        <div style="display: flex; align-items: center; gap: 8px; font-size: 12px;">
                            <div style="min-width: 60px; font-weight: 500;">${percentage}%</div>
                            <div style="flex: 1; background: #e0e0e0; height: 20px; border-radius: 10px; overflow: hidden;">
                                <div style="width: ${percentage}%; height: 100%; background: linear-gradient(90deg, var(--ncat-aggie-blue), var(--ncat-aggie-gold));"></div>
                            </div>
                            <div style="min-width: 120px; text-align: right; font-size: 11px;">${agency}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    createSpendingChart() {
        const chartContainer = document.getElementById('spending-chart');
        const activeGrants = this.grantsData.grants.filter(g => g.status === 'Active');
        
        chartContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 6px;">
                ${activeGrants.map(grant => {
                    const spentPercentage = (grant.spentToDate / grant.totalAmount) * 100;
                    return `
                        <div style="font-size: 11px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                                <span>${grant.id}</span>
                                <span>${spentPercentage.toFixed(1)}%</span>
                            </div>
                            <div style="background: #e0e0e0; height: 12px; border-radius: 6px; overflow: hidden;">
                                <div style="width: ${spentPercentage}%; height: 100%; background: ${spentPercentage > 75 ? 'var(--ncat-coe-red)' : 'var(--ncat-aggie-blue)'};"></div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    refreshData() {
        const refreshBtn = document.getElementById('refresh-data');
        const originalText = refreshBtn.innerHTML;
        
        refreshBtn.innerHTML = '<span class="gear-icon">🔄</span> Refreshing...';
        refreshBtn.disabled = true;

        setTimeout(() => {
            this.updateDashboard();
            this.renderGrants();
            this.generateRecentActivity();
            
            refreshBtn.innerHTML = originalText;
            refreshBtn.disabled = false;
            
            this.showNotification('Data refreshed successfully!', 'success');
        }, 1500);
    }

    generateFinancialReport() {
        const button = document.getElementById('generate-financial-report');
        const originalText = button.innerHTML;
        
        button.innerHTML = '<span class="gear-icon">⏳</span> Generating...';
        button.disabled = true;
        
        setTimeout(() => {
            const reportContent = this.createFinancialReportContent();
            this.downloadReport('Financial_Report_' + new Date().toISOString().split('T')[0], reportContent);
            
            button.innerHTML = originalText;
            button.disabled = false;
            
            this.showNotification('Financial report generated and downloaded successfully!', 'success');
        }, 2000);
    }

    generateComplianceReport() {
        const button = document.getElementById('generate-compliance-report');
        const originalText = button.innerHTML;
        
        button.innerHTML = '<span class="gear-icon">⏳</span> Generating...';
        button.disabled = true;
        
        setTimeout(() => {
            const reportContent = this.createComplianceReportContent();
            this.downloadReport('Compliance_Report_' + new Date().toISOString().split('T')[0], reportContent);
            
            button.innerHTML = originalText;
            button.disabled = false;
            
            this.showNotification('Compliance report generated and downloaded successfully!', 'success');
        }, 2000);
    }

    createFinancialReportContent() {
        const metrics = this.calculateMetrics();
        
        return `NCAT COE Grant Financial Report
Generated: ${new Date().toLocaleDateString()}

EXECUTIVE SUMMARY
=================
Total Active Grants: ${metrics.activeGrants}
Total Grant Value: ${this.formatCurrency(metrics.totalGrantValue)}
Total Spent: ${this.formatCurrency(metrics.totalSpent)}
Total Remaining: ${this.formatCurrency(metrics.totalRemaining)}
Average Completion: ${metrics.averageCompletion}%

GRANT DETAILS
=============
${this.grantsData.grants.map(grant => `
Grant ID: ${grant.id}
Title: ${grant.title}
PI: ${grant.pi}
Department: ${grant.department}
Funding Agency: ${grant.fundingAgency}
Total Amount: ${this.formatCurrency(grant.totalAmount)}
Direct Costs: ${this.formatCurrency(grant.directCosts)}
Indirect Costs: ${this.formatCurrency(grant.indirectCosts)}
Spent to Date: ${this.formatCurrency(grant.spentToDate)}
Remaining Balance: ${this.formatCurrency(grant.remainingBalance)}
Progress: ${grant.percentComplete}%
Status: ${grant.status}
---
`).join('')}

FINANCIAL ANALYSIS
==================
Budget Utilization by Grant:
${this.grantsData.grants.map(grant => {
    const utilization = ((grant.spentToDate / grant.totalAmount) * 100).toFixed(1);
    return `${grant.id}: ${utilization}%`;
}).join('\n')}

Report generated by NCAT COE Grant Management System`;
    }

    createComplianceReportContent() {
        const compliantGrants = this.grantsData.grants.filter(g => g.complianceStatus === 'Compliant');
        const attentionGrants = this.grantsData.grants.filter(g => 
            g.complianceStatus.includes('Pending') || 
            g.complianceStatus.includes('Approved') || 
            g.complianceStatus.includes('Required')
        );
        
        return `NCAT COE Grant Compliance Report
Generated: ${new Date().toLocaleDateString()}

COMPLIANCE SUMMARY
==================
Total Grants: ${this.grantsData.grants.length}
Compliant Grants: ${compliantGrants.length}
Needs Attention: ${attentionGrants.length}
Compliance Issues: 0

UPCOMING DEADLINES (Next 30 Days)
==================================
${this.getUpcomingDeadlines().map(grant => `
${grant.id} - ${grant.title}
Next Report Due: ${grant.nextReportDue}
Risk Level: ${grant.riskLevel}
`).join('')}

GRANTS CLOSING SOON (Next 6 Months)
====================================
${this.getGrantsClosingSoon().map(grant => `
${grant.id} - ${grant.title}
End Date: ${this.formatDate(grant.currentEndDate)}
Progress: ${grant.percentComplete}%
`).join('')}

DETAILED COMPLIANCE STATUS
==========================
${this.grantsData.grants.map(grant => `
Grant ID: ${grant.id}
Title: ${grant.title}
PI: ${grant.pi}
Compliance Status: ${grant.complianceStatus}
Risk Level: ${grant.riskLevel}
Last Report: ${grant.lastReportDate}
Next Due: ${grant.nextReportDue}
Timeline: ${this.formatDate(grant.currentStartDate)} to ${this.formatDate(grant.currentEndDate)}
${grant.originalEndDate !== grant.currentEndDate ? 'NOTE: Extension approved from original end date' : ''}
---
`).join('')}

Report generated by NCAT COE Grant Management System`;
    }

    exportDashboard() {
        const button = document.getElementById('export-dashboard');
        const originalText = button.innerHTML;
        
        button.innerHTML = '<span class="gear-icon">⏳</span> Exporting...';
        button.disabled = true;

        setTimeout(() => {
            const dashboardData = {
                metrics: this.calculateMetrics(),
                grants: this.grantsData.grants,
                exportDate: new Date().toISOString(),
                summary: {
                    totalGrants: this.grantsData.grants.length,
                    activeGrants: this.grantsData.grants.filter(g => g.status === 'Active').length,
                    completedGrants: this.grantsData.grants.filter(g => g.status === 'Completed').length,
                    pendingGrants: this.grantsData.grants.filter(g => g.status === 'Pending Start').length
                }
            };

            this.downloadJSON('Dashboard_Export_' + new Date().toISOString().split('T')[0], dashboardData);
            
            button.innerHTML = originalText;
            button.disabled = false;
            
            this.showNotification('Dashboard data exported successfully!', 'success');
        }, 1500);
    }

    exportAllData() {
        const button = document.getElementById('export-all-data');
        const originalText = button.innerHTML;
        
        button.innerHTML = '<span class="gear-icon">⏳</span> Exporting...';
        button.disabled = true;

        setTimeout(() => {
            const allData = {
                ...this.grantsData,
                exportDate: new Date().toISOString(),
                metrics: this.calculateMetrics(),
                upcomingDeadlines: this.getUpcomingDeadlines(),
                grantsClosingSoon: this.getGrantsClosingSoon()
            };

            this.downloadJSON('Complete_Grant_Data_' + new Date().toISOString().split('T')[0], allData);
            
            button.innerHTML = originalText;
            button.disabled = false;
            
            this.showNotification('All data exported successfully!', 'success');
        }, 1500);
    }

    downloadReport(filename, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename + '.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    downloadJSON(filename, data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    downloadGrantReport(grantId) {
        const grant = this.grantsData.grants.find(g => g.id === grantId);
        if (!grant) return;

        const hasExtension = grant.originalEndDate !== grant.currentEndDate;
        const budgetUtilization = ((grant.spentToDate / grant.totalAmount) * 100).toFixed(1);

        const reportContent = `NCAT COE Individual Grant Report
Grant ID: ${grant.id}
Generated: ${new Date().toLocaleDateString()}

PROJECT INFORMATION
===================
Title: ${grant.title}
Principal Investigator: ${grant.pi}
Co-Principal Investigator: ${grant.coPI}
Department: ${grant.department}
Funding Agency: ${grant.fundingAgency}
Program: ${grant.program}
Status: ${grant.status}

TIMELINE INFORMATION
====================
Original Start Date: ${this.formatDate(grant.originalStartDate)}
Current Start Date: ${this.formatDate(grant.currentStartDate)}
Original End Date: ${this.formatDate(grant.originalEndDate)}
Current End Date: ${this.formatDate(grant.currentEndDate)}
${hasExtension ? 'NOTE: Extension approved from original end date' : ''}

FINANCIAL SUMMARY
=================
Total Amount: ${this.formatCurrency(grant.totalAmount)}
Direct Costs: ${this.formatCurrency(grant.directCosts)}
Indirect Costs: ${this.formatCurrency(grant.indirectCosts)}
Spent to Date: ${this.formatCurrency(grant.spentToDate)}
Remaining Balance: ${this.formatCurrency(grant.remainingBalance)}
Budget Utilization: ${budgetUtilization}%
Progress Complete: ${grant.percentComplete}%

COMPLIANCE & REPORTING
======================
Last Report Date: ${grant.lastReportDate}
Next Report Due: ${grant.nextReportDue}
Compliance Status: ${grant.complianceStatus}
Risk Level: ${grant.riskLevel}

Report generated by NCAT COE Grant Management System`;

        this.downloadReport(`Grant_Report_${grant.id}_${new Date().toISOString().split('T')[0]}`, reportContent);
        this.showNotification(`Report for ${grant.id} downloaded successfully!`, 'success');
    }

    editGrant(grantId) {
        this.showNotification('Edit functionality would redirect to grant editing interface', 'info');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <span class="gear-icon">ℹ️</span>
            <span>${message}</span>
        `;

        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 8px;
                    padding: 16px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 1001;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    animation: slideIn 0.3s ease-out;
                    border-left: 4px solid var(--ncat-aggie-blue);
                    max-width: 400px;
                }
                .notification--success { border-left-color: var(--color-success); }
                .notification--error { border-left-color: var(--color-error); }
                .notification--warning { border-left-color: var(--color-warning); }
                .notification--info { border-left-color: var(--ncat-aggie-blue); }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    formatDate(dateString) {
        if (!dateString || dateString === 'N/A') return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.grantSystem = new GrantManagementSystem();
});