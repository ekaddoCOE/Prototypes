class GrantBudgetPlanner {
    constructor() {
        this.budgetData = {
            project: {
                title: '',
                pi: '',
                sponsor: '',
                duration: 1,
                startDate: '',
                endDate: ''
            },
            personnel: {
                piAcademic: { salary: 0, effort: 0, cost: 0, months: 0 },
                piSummer: { salary: 0, months: 0, cost: 0 },
                graduateStudents: []
            },
            directCosts: {
                equipment: 0,
                domesticTravel: 0,
                foreignTravel: 0,
                materials: 0,
                publication: 0,
                consultant: 0,
                other: 0
            },
            subcontractors: []
        };

        this.rates = {
            facultyFringe: 0.36,
            summerGradFringe: 0.0765,
            academicGradHealthFee: 4.5,
            partTimeGradHealthFee: 2.25,
            indirectRate: 0.45,
            academicYearMonths: 9,
            summerMonths: 3,
            studentSupportMinimum: 0.5,
            equipmentThreshold: 5000,
            subcontractorCap: 25000
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTabNavigation();
        this.addInitialGraduateStudent();
        this.addInitialSubcontractor();
        this.updateAllCalculations();
        this.loadFromStorage();
    }

    setupEventListeners() {
        // Project information listeners
        document.getElementById('project-duration').addEventListener('change', (e) => {
            this.updateProjectEndDate();
        });

        document.getElementById('start-date').addEventListener('change', (e) => {
            this.updateProjectEndDate();
        });

        // Personnel calculation listeners
        const personnelInputs = [
            'pi-academic-salary', 'pi-academic-effort',
            'pi-summer-salary', 'pi-summer-months'
        ];

        personnelInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => {
                    this.calculatePersonnelCosts();
                    this.updateAllCalculations();
                    this.saveToStorage();
                });
            }
        });

        // Direct costs listeners
        const directCostInputs = [
            'equipment-cost', 'domestic-travel', 'foreign-travel',
            'materials-supplies', 'publication-costs', 'consultant-costs', 'other-costs'
        ];

        directCostInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => {
                    this.updateAllCalculations();
                    this.validateCompliance();
                    this.saveToStorage();
                });
            }
        });

        // Dynamic add buttons
        document.getElementById('add-graduate-student').addEventListener('click', () => {
            this.addGraduateStudent();
        });

        document.getElementById('add-subcontractor').addEventListener('click', () => {
            this.addSubcontractor();
        });

        // Export buttons
        document.getElementById('export-pdf').addEventListener('click', () => {
            this.exportToPDF();
        });

        document.getElementById('print-budget').addEventListener('click', () => {
            this.printBudget();
        });

        // Form inputs for auto-save
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('form-control')) {
                this.saveToStorage();
            }
        });
    }

    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');
        const progressSteps = document.querySelectorAll('.step');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Update tab buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Update tab panels
                tabPanels.forEach(panel => panel.classList.remove('active'));
                document.getElementById(`${targetTab}-tab`).classList.add('active');

                // Update progress steps
                progressSteps.forEach(step => step.classList.remove('active'));
                const targetStep = document.querySelector(`[data-step="${targetTab}"]`);
                if (targetStep) {
                    targetStep.classList.add('active');
                }
            });
        });
    }

    updateProjectEndDate() {
        const startDate = document.getElementById('start-date').value;
        const duration = parseInt(document.getElementById('project-duration').value);
        
        if (startDate && duration) {
            const start = new Date(startDate);
            const end = new Date(start);
            end.setFullYear(start.getFullYear() + duration);
            
            const endDateString = end.toISOString().split('T')[0];
            document.getElementById('end-date').value = endDateString;
        }
    }

    calculatePersonnelCosts() {
        // PI Academic Year
        const piAcademicSalary = parseFloat(document.getElementById('pi-academic-salary').value) || 0;
        const piAcademicEffort = parseFloat(document.getElementById('pi-academic-effort').value) || 0;
        const piAcademicMonths = (piAcademicEffort / 100) * this.rates.academicYearMonths;
        const piAcademicCost = piAcademicSalary * (piAcademicEffort / 100);

        document.getElementById('pi-academic-months').value = piAcademicMonths.toFixed(2);
        document.getElementById('pi-academic-cost').value = this.formatCurrency(piAcademicCost);

        // PI Summer
        const piSummerSalary = parseFloat(document.getElementById('pi-summer-salary').value) || 0;
        const piSummerMonths = parseFloat(document.getElementById('pi-summer-months').value) || 0;
        const piSummerCost = piSummerSalary * piSummerMonths;

        document.getElementById('pi-summer-cost').value = this.formatCurrency(piSummerCost);

        // Update budget data
        this.budgetData.personnel.piAcademic = {
            salary: piAcademicSalary,
            effort: piAcademicEffort,
            cost: piAcademicCost,
            months: piAcademicMonths
        };

        this.budgetData.personnel.piSummer = {
            salary: piSummerSalary,
            months: piSummerMonths,
            cost: piSummerCost
        };

        // Calculate graduate students
        this.calculateGraduateStudentCosts();
        this.calculateFringeBenefits();
    }

    calculateGraduateStudentCosts() {
        const graduateEntries = document.querySelectorAll('.graduate-student-entry');
        let totalGradCost = 0;

        graduateEntries.forEach(entry => {
            const stipend = parseFloat(entry.querySelector('.grad-stipend').value) || 0;
            const months = parseFloat(entry.querySelector('.grad-months').value) || 0;
            const cost = stipend * months;

            entry.querySelector('.grad-cost').value = this.formatCurrency(cost);
            totalGradCost += cost;
        });

        return totalGradCost;
    }

    calculateFringeBenefits() {
        const piAcademicCost = this.budgetData.personnel.piAcademic.cost || 0;
        const piSummerCost = this.budgetData.personnel.piSummer.cost || 0;
        const gradCost = this.calculateGraduateStudentCosts();

        // Faculty fringe (PI Academic)
        const facultyFringe = piAcademicCost * this.rates.facultyFringe;
        
        // Summer fringe (PI Summer + Summer Grad Students)
        const summerFringe = piSummerCost * this.rates.summerGradFringe;
        
        // Graduate student health fees (simplified calculation)
        const gradHealthFees = this.calculateGradHealthFees();

        const totalPersonnelCost = piAcademicCost + piSummerCost + gradCost;
        const totalFringeCost = facultyFringe + summerFringe + gradHealthFees;
        const totalPersonnelFringe = totalPersonnelCost + totalFringeCost;

        // Update display
        document.getElementById('total-personnel-cost').textContent = this.formatCurrency(totalPersonnelCost);
        document.getElementById('total-fringe-cost').textContent = this.formatCurrency(totalFringeCost);
        document.getElementById('personnel-fringe-total').textContent = this.formatCurrency(totalPersonnelFringe);

        return { totalPersonnelCost, totalFringeCost, totalPersonnelFringe };
    }

    calculateGradHealthFees() {
        const graduateEntries = document.querySelectorAll('.graduate-student-entry');
        let totalHealthFees = 0;

        graduateEntries.forEach(entry => {
            const type = entry.querySelector('.grad-type').value;
            const months = parseFloat(entry.querySelector('.grad-months').value) || 0;
            
            if (type === 'academic') {
                totalHealthFees += months * this.rates.academicGradHealthFee;
            }
        });

        return totalHealthFees;
    }

    addGraduateStudent() {
        const container = document.getElementById('graduate-students-container');
        const newEntry = this.createGraduateStudentEntry();
        
        // Insert before the add button
        const addButton = document.getElementById('add-graduate-student');
        container.insertBefore(newEntry, addButton);
        
        this.attachGraduateStudentListeners(newEntry);
    }

    createGraduateStudentEntry() {
        const entry = document.createElement('div');
        entry.className = 'graduate-student-entry';
        entry.innerHTML = `
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Student Type</label>
                    <select class="form-control grad-type">
                        <option value="academic">Academic Year</option>
                        <option value="summer">Summer</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Monthly Stipend ($)</label>
                    <input type="number" class="form-control grad-stipend calculation-input" min="0" step="100">
                </div>
                <div class="form-group">
                    <label class="form-label">Months</label>
                    <input type="number" class="form-control grad-months calculation-input" min="0" max="12" step="0.1">
                </div>
                <div class="form-group">
                    <label class="form-label">Cost ($)</label>
                    <input type="text" class="form-control grad-cost calculation-result" readonly>
                </div>
            </div>
            <button type="button" class="btn btn--secondary btn--sm remove-grad-student" style="margin-top: 10px;">Remove</button>
        `;
        return entry;
    }

    attachGraduateStudentListeners(entry) {
        const inputs = entry.querySelectorAll('.calculation-input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.calculatePersonnelCosts();
                this.updateAllCalculations();
                this.saveToStorage();
            });
        });

        const removeBtn = entry.querySelector('.remove-grad-student');
        removeBtn.addEventListener('click', () => {
            entry.remove();
            this.calculatePersonnelCosts();
            this.updateAllCalculations();
            this.saveToStorage();
        });
    }

    addInitialGraduateStudent() {
        const existingEntries = document.querySelectorAll('.graduate-student-entry');
        if (existingEntries.length === 0) {
            this.addGraduateStudent();
        } else {
            // Attach listeners to existing entries
            existingEntries.forEach(entry => {
                this.attachGraduateStudentListeners(entry);
            });
        }
    }

    addSubcontractor() {
        const container = document.getElementById('subcontractors-container');
        const newEntry = this.createSubcontractorEntry();
        
        const addButton = document.getElementById('add-subcontractor');
        container.insertBefore(newEntry, addButton);
        
        this.attachSubcontractorListeners(newEntry);
    }

    createSubcontractorEntry() {
        const entry = document.createElement('div');
        entry.className = 'subcontractor-entry';
        entry.innerHTML = `
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Subcontractor Name</label>
                    <input type="text" class="form-control sub-name">
                </div>
                <div class="form-group">
                    <label class="form-label">Direct Cost ($)</label>
                    <input type="number" class="form-control sub-direct calculation-input" min="0" step="100">
                </div>
                <div class="form-group">
                    <label class="form-label">F&A Rate (%)</label>
                    <input type="number" class="form-control sub-fa-rate calculation-input" min="0" max="100" step="0.1">
                </div>
                <div class="form-group">
                    <label class="form-label">F&A Cost ($)</label>
                    <input type="text" class="form-control sub-fa-cost calculation-result" readonly>
                </div>
            </div>
            <div class="validation-message sub-validation"></div>
            <button type="button" class="btn btn--secondary btn--sm remove-subcontractor" style="margin-top: 10px;">Remove</button>
        `;
        return entry;
    }

    attachSubcontractorListeners(entry) {
        const directInput = entry.querySelector('.sub-direct');
        const rateInput = entry.querySelector('.sub-fa-rate');
        const costOutput = entry.querySelector('.sub-fa-cost');
        const validation = entry.querySelector('.sub-validation');

        const calculateSubcontractorFA = () => {
            const direct = parseFloat(directInput.value) || 0;
            const rate = parseFloat(rateInput.value) || 0;
            
            // F&A calculated only on first $25,000
            const faBase = Math.min(direct, this.rates.subcontractorCap);
            const faCost = faBase * (rate / 100);
            
            costOutput.value = this.formatCurrency(faCost);
            
            // Show validation message if over cap
            if (direct > this.rates.subcontractorCap) {
                validation.className = 'validation-message warning';
                validation.textContent = `F&A calculated only on first $${this.formatCurrency(this.rates.subcontractorCap)} of subcontract`;
            } else {
                validation.className = 'validation-message';
                validation.textContent = '';
            }
        };

        directInput.addEventListener('input', () => {
            calculateSubcontractorFA();
            this.updateAllCalculations();
            this.saveToStorage();
        });

        rateInput.addEventListener('input', () => {
            calculateSubcontractorFA();
            this.updateAllCalculations();
            this.saveToStorage();
        });

        const removeBtn = entry.querySelector('.remove-subcontractor');
        removeBtn.addEventListener('click', () => {
            entry.remove();
            this.updateAllCalculations();
            this.saveToStorage();
        });
    }

    addInitialSubcontractor() {
        const existingEntries = document.querySelectorAll('.subcontractor-entry');
        if (existingEntries.length === 0) {
            this.addSubcontractor();
        } else {
            existingEntries.forEach(entry => {
                this.attachSubcontractorListeners(entry);
            });
        }
    }

    updateAllCalculations() {
        const personnel = this.calculateFringeBenefits();
        const directCosts = this.calculateDirectCosts();
        const subcontractors = this.calculateSubcontractorTotals();
        
        const totalDirectCosts = personnel.totalPersonnelFringe + directCosts.total + subcontractors.total;
        const mtdcBase = personnel.totalPersonnelFringe + directCosts.mtdcEligible + subcontractors.mtdcEligible;
        const indirectCosts = mtdcBase * this.rates.indirectRate;
        const grandTotal = totalDirectCosts + indirectCosts;

        this.updateSummaryDisplay({
            personnel: personnel.totalPersonnelFringe,
            equipment: directCosts.equipment,
            travel: directCosts.travel,
            other: directCosts.other,
            subcontractors: subcontractors.total,
            totalDirect: totalDirectCosts,
            mtdcBase,
            indirect: indirectCosts,
            grandTotal
        });

        this.validateCompliance();
    }

    calculateDirectCosts() {
        const equipment = parseFloat(document.getElementById('equipment-cost').value) || 0;
        const domesticTravel = parseFloat(document.getElementById('domestic-travel').value) || 0;
        const foreignTravel = parseFloat(document.getElementById('foreign-travel').value) || 0;
        const materials = parseFloat(document.getElementById('materials-supplies').value) || 0;
        const publication = parseFloat(document.getElementById('publication-costs').value) || 0;
        const consultant = parseFloat(document.getElementById('consultant-costs').value) || 0;
        const other = parseFloat(document.getElementById('other-costs').value) || 0;

        const travel = domesticTravel + foreignTravel;
        const otherTotal = materials + publication + consultant + other;
        const total = equipment + travel + otherTotal;
        
        // MTDC excludes equipment over $5,000
        const mtdcEligible = Math.min(equipment, this.rates.equipmentThreshold) + travel + otherTotal;

        return {
            equipment,
            travel,
            other: otherTotal,
            total,
            mtdcEligible
        };
    }

    calculateSubcontractorTotals() {
        const subEntries = document.querySelectorAll('.subcontractor-entry');
        let totalDirect = 0;
        let totalFA = 0;
        let mtdcEligible = 0;

        subEntries.forEach(entry => {
            const direct = parseFloat(entry.querySelector('.sub-direct').value) || 0;
            const rate = parseFloat(entry.querySelector('.sub-fa-rate').value) || 0;
            
            const faBase = Math.min(direct, this.rates.subcontractorCap);
            const faCost = faBase * (rate / 100);
            
            totalDirect += direct;
            totalFA += faCost;
            mtdcEligible += faBase; // Only first $25K of each subcontract
        });

        return {
            total: totalDirect + totalFA,
            mtdcEligible,
            direct: totalDirect,
            fa: totalFA
        };
    }

    updateSummaryDisplay(totals) {
        document.getElementById('summary-personnel').textContent = this.formatCurrency(totals.personnel);
        document.getElementById('summary-equipment').textContent = this.formatCurrency(totals.equipment);
        document.getElementById('summary-travel').textContent = this.formatCurrency(totals.travel);
        document.getElementById('summary-other').textContent = this.formatCurrency(totals.other);
        document.getElementById('summary-subcontractors').textContent = this.formatCurrency(totals.subcontractors);
        document.getElementById('total-direct-costs').textContent = this.formatCurrency(totals.totalDirect);
        document.getElementById('mtdc-base').textContent = this.formatCurrency(totals.mtdcBase);
        document.getElementById('indirect-costs').textContent = this.formatCurrency(totals.indirect);
        document.getElementById('grand-total').textContent = this.formatCurrency(totals.grandTotal);
    }

    validateCompliance() {
        const alertsContainer = document.getElementById('compliance-alerts');
        alertsContainer.innerHTML = '';

        const alerts = [];

        // Equipment validation
        const equipment = parseFloat(document.getElementById('equipment-cost').value) || 0;
        if (equipment > this.rates.equipmentThreshold) {
            alerts.push({
                type: 'warning',
                message: `Equipment cost of ${this.formatCurrency(equipment)} exceeds $${this.formatCurrency(this.rates.equipmentThreshold)}. Justification required.`
            });
        }

        // Student support validation
        const piAcademicCost = this.budgetData.personnel.piAcademic.cost || 0;
        const piSummerCost = this.budgetData.personnel.piSummer.cost || 0;
        const seniorPersonnelCost = piAcademicCost + piSummerCost;
        const gradCost = this.calculateGraduateStudentCosts();
        
        if (seniorPersonnelCost > 0) {
            const studentSupportRatio = gradCost / seniorPersonnelCost;
            if (studentSupportRatio < this.rates.studentSupportMinimum) {
                alerts.push({
                    type: 'error',
                    message: `Student support (${this.formatCurrency(gradCost)}) must be at least 50% of senior personnel costs (${this.formatCurrency(seniorPersonnelCost)}). Current ratio: ${(studentSupportRatio * 100).toFixed(1)}%`
                });
            } else {
                alerts.push({
                    type: 'success',
                    message: `Student support requirement met: ${(studentSupportRatio * 100).toFixed(1)}% of senior personnel costs`
                });
            }
        }

        // Subcontractor validation
        const subEntries = document.querySelectorAll('.subcontractor-entry');
        subEntries.forEach((entry, index) => {
            const direct = parseFloat(entry.querySelector('.sub-direct').value) || 0;
            if (direct > this.rates.subcontractorCap) {
                alerts.push({
                    type: 'warning',
                    message: `Subcontractor ${index + 1}: F&A calculated only on first $${this.formatCurrency(this.rates.subcontractorCap)}`
                });
            }
        });

        // Budget balance check
        const grandTotal = parseFloat(document.getElementById('grand-total').textContent.replace(/[$,]/g, '')) || 0;
        if (grandTotal > 0) {
            alerts.push({
                type: 'success',
                message: `Budget is balanced with total project cost of ${this.formatCurrency(grandTotal)}`
            });
        }

        // Display alerts
        alerts.forEach(alert => {
            const alertDiv = document.createElement('div');
            alertDiv.className = `compliance-alert ${alert.type}`;
            alertDiv.innerHTML = `
                <span class="gear-icon">⚙️</span>
                <span>${alert.message}</span>
            `;
            alertsContainer.appendChild(alertDiv);
        });
    }

    exportToPDF() {
        // Create a printable version of the budget
        const printContent = this.generateBudgetReport();
        const printWindow = window.open('', '_blank');
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>NCAT COE Grant Budget Report</title>
                <style>
                    body { font-family: 'Montserrat', Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; border-bottom: 3px solid #004684; padding-bottom: 20px; margin-bottom: 30px; }
                    .header h1 { color: #004684; margin: 0; }
                    .header p { color: #FDB927; margin: 5px 0; }
                    .section { margin-bottom: 30px; }
                    .section h2 { color: #A45248; border-bottom: 1px solid #A45248; padding-bottom: 5px; }
                    .budget-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
                    .budget-table th, .budget-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    .budget-table th { background-color: #004684; color: white; }
                    .total-row { background-color: #f0f0f0; font-weight: bold; }
                    .grand-total { background-color: #004684; color: white; font-weight: bold; }
                    @media print { body { margin: 0; } }
                </style>
            </head>
            <body>
                ${printContent}
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        setTimeout(() => {
            printWindow.print();
        }, 500);
    }

    printBudget() {
        this.exportToPDF();
    }

    generateBudgetReport() {
        const projectTitle = document.getElementById('project-title').value || 'Untitled Project';
        const pi = document.getElementById('principal-investigator').value || 'Not specified';
        const sponsor = document.getElementById('sponsor').value || 'Not specified';
        
        const personnel = this.calculateFringeBenefits();
        const directCosts = this.calculateDirectCosts();
        const subcontractors = this.calculateSubcontractorTotals();
        const grandTotal = parseFloat(document.getElementById('grand-total').textContent.replace(/[$,]/g, '')) || 0;

        return `
            <div class="header">
                <h1>NCAT COE Grant Budget Planning Tool</h1>
                <p>North Carolina A&T State University - College of Engineering</p>
                <p>Driving Innovation</p>
            </div>
            
            <div class="section">
                <h2>Project Information</h2>
                <table class="budget-table">
                    <tr><td><strong>Project Title:</strong></td><td>${projectTitle}</td></tr>
                    <tr><td><strong>Principal Investigator:</strong></td><td>${pi}</td></tr>
                    <tr><td><strong>Sponsor:</strong></td><td>${sponsor}</td></tr>
                    <tr><td><strong>Report Generated:</strong></td><td>${new Date().toLocaleDateString()}</td></tr>
                </table>
            </div>

            <div class="section">
                <h2>Budget Summary</h2>
                <table class="budget-table">
                    <tr><th>Category</th><th>Amount</th></tr>
                    <tr><td>Personnel + Fringe Benefits</td><td>${this.formatCurrency(personnel.totalPersonnelFringe)}</td></tr>
                    <tr><td>Equipment</td><td>${this.formatCurrency(directCosts.equipment)}</td></tr>
                    <tr><td>Travel</td><td>${this.formatCurrency(directCosts.travel)}</td></tr>
                    <tr><td>Other Direct Costs</td><td>${this.formatCurrency(directCosts.other)}</td></tr>
                    <tr><td>Subcontractors</td><td>${this.formatCurrency(subcontractors.total)}</td></tr>
                    <tr class="total-row"><td>Total Direct Costs</td><td>${this.formatCurrency(personnel.totalPersonnelFringe + directCosts.total + subcontractors.total)}</td></tr>
                    <tr><td>Indirect Costs (45%)</td><td>${document.getElementById('indirect-costs').textContent}</td></tr>
                    <tr class="grand-total"><td>GRAND TOTAL</td><td>${this.formatCurrency(grandTotal)}</td></tr>
                </table>
            </div>
        `;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount).replace('$', '');
    }

    saveToStorage() {
        try {
            const formData = this.collectFormData();
            // Note: localStorage is not available in sandbox, so this is a placeholder
            // In a real environment, this would save to localStorage
            console.log('Budget data would be saved:', formData);
        } catch (error) {
            console.log('Storage not available in sandbox environment');
        }
    }

    loadFromStorage() {
        try {
            // Placeholder for loading from localStorage
            // In a real environment, this would load from localStorage
            console.log('Would load saved budget data');
        } catch (error) {
            console.log('Storage not available in sandbox environment');
        }
    }

    collectFormData() {
        const formData = {};
        const inputs = document.querySelectorAll('.form-control');
        inputs.forEach(input => {
            if (input.id) {
                formData[input.id] = input.value;
            }
        });
        return formData;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const planner = new GrantBudgetPlanner();
    
    // Make planner globally accessible for debugging
    window.budgetPlanner = planner;
});