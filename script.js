// Initialize data storage
let clients = {
    itr: [],
    gst: [],
    dsc: [],
    udyam: []
};

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadSampleData();
    updateClientCounts();
});

// Initialize event listeners
function initializeEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            switchTab(this.getAttribute('data-tab'));
        });
    });

    // Client type buttons
    document.querySelectorAll('[data-list]').forEach(button => {
        button.addEventListener('click', function() {
            switchClientList(this.getAttribute('data-list'));
        });
    });

    // Client cards
    document.querySelectorAll('.client-card').forEach(card => {
        card.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            switchTab('clients');
            switchClientList(type);
        });
    });

    // Add New Client button
    document.getElementById('addClientBtn').addEventListener('click', () => {
        const activeList = document.querySelector('.client-list.active');
        const clientType = activeList.id.replace('List', '');
        showClientModal(clientType);
    });

    // Save Client button
    document.getElementById('saveClient').addEventListener('click', function() {
        const mobileInput = document.querySelector('input[name="mobile"]');
        const mobileValue = mobileInput ? mobileInput.value : '';

        // Validate mobile number
        if (mobileValue && (mobileValue.length !== 10 || !/^\d+$/.test(mobileValue))) {
            Swal.fire({
                title: 'Error!',
                text: 'Mobile number must be exactly 10 digits and contain only numbers.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            if (mobileInput) {
                mobileInput.focus();
            }
            return;
        }

        saveClient();
    });

    // Search input
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('searchButton').addEventListener('click', filterClients);
    document.getElementById('searchInput').addEventListener('keyup', filterClients);
}

// Tab switching
function switchTab(tabId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
}

// Client list switching
function switchClientList(type) {
    document.querySelectorAll('.client-list').forEach(list => {
        list.classList.remove('active');
    });
    document.getElementById(`${type}List`).classList.add('active');

    document.querySelectorAll('[data-list]').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`[data-list="${type}"]`).classList.add('active');
}

// Show client modal
function showClientModal(clientType, clientData = null) {
    const modal = document.getElementById('clientModal');
    const modalBody = modal.querySelector('.modal-body');
    modalBody.innerHTML = getClientForm(clientType);

    // Add password toggle event listeners after form is added to DOM
    modalBody.querySelectorAll('.password-toggle').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.closest('.input-group').querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    if (clientData) {
        fillFormData(modalBody, clientData);
        modal.querySelector('.modal-title').textContent = 'EDIT CLIENT';
    } else {
        modal.querySelector('.modal-title').textContent = 'ADD NEW CLIENT';
    }

    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

// Get client form HTML
function getClientForm(type) {
    switch(type) {
        case 'itr':
            return `
                <form id="clientForm" data-type="itr">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">NAME</label>
                            <input type="text" class="form-control" name="name" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">PAN</label>
                            <input type="text" class="form-control" name="pan" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">FATHER NAME</label>
                            <input type="text" class="form-control" name="fatherName" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">DOB</label>
                            <input type="date" class="form-control" name="dob" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">MOBILE NO.</label>
                            <input type="tel" class="form-control" name="mobile" pattern="[0-9]{10}" maxlength="10" 
                                   oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10)"
                                   title="Please enter exactly 10 digits" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">RETURN TYPE</label>
                            <select class="form-select" name="returnType" required>
                                <option value="">SELECT TYPE</option>
                                <option value="ITR-1">ITR-1</option>
                                <option value="ITR-2">ITR-2</option>
                                <option value="ITR-3">ITR-3</option>
                                <option value="ITR-4">ITR-4</option>
                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">STATUS</label>
                            <select class="form-select" name="status" required>
                                <option value="NOT FILED">NOT FILED</option>
                                <option value="FILED">FILED</option>
                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">DATE OF FILING</label>
                            <input type="date" class="form-control" name="dateOfFiling">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">PASSWORD</label>
                            <div class="input-group">
                                <input type="password" class="form-control" name="password" required>
                                <button type="button" class="btn btn-outline-secondary password-toggle">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">A.Y.</label>
                            <input type="text" class="form-control" name="ay" required>
                        </div>
                    </div>
                </form>
            `;
        case 'gst':
            return `
                <form id="clientForm" data-type="gst">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">NAME</label>
                            <input type="text" class="form-control" name="name" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">GSTN</label>
                            <input type="text" class="form-control" name="gstn" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">STATUS</label>
                            <select class="form-select" name="status" required>
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="INACTIVE">INACTIVE</option>
                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">STATE</label>
                            <input type="text" class="form-control" name="state" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">USER ID</label>
                            <input type="text" class="form-control" name="userId" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">PASSWORD</label>
                            <div class="input-group">
                                <input type="password" class="form-control" name="password" required>
                                <button type="button" class="btn btn-outline-secondary password-toggle">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            `;
        case 'dsc':
            return `
                <form id="clientForm" data-type="dsc">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">NAME</label>
                            <input type="text" class="form-control" name="name" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">DSC CATEGORY</label>
                            <select class="form-select" name="dscCategory" required>
                                <option value="">SELECT CATEGORY</option>
                                <option value="INDIVIDUAL-SIGN">INDIVIDUAL-SIGN</option>
                                <option value="INDIVIDUAL-SIGN+ENCRYPTION">INDIVIDUAL-SIGN+ENCRYPTION</option>
                                <option value="ORGANISATION-SIGN+ENCRYPTION">ORGANISATION-SIGN+ENCRYPTION</option>
                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">PAN CARD</label>
                            <input type="text" class="form-control" name="pan" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">AADHAR</label>
                            <input type="text" class="form-control" name="aadhar" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">EMAIL ID</label>
                            <input type="email" class="form-control" name="email" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">DATE OF APPLY</label>
                            <input type="date" class="form-control" name="dateOfApply" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">EXPIRY STATUS</label>
                            <select class="form-select" name="expiryStatus" required>
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="EXPIRED">EXPIRED</option>
                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">REMARKS</label>
                            <textarea class="form-control" name="remarks"></textarea>
                        </div>
                    </div>
                </form>
            `;
        case 'udyam':
            return `
                <form id="clientForm" data-type="udyam">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">OWNER NAME</label>
                            <input type="text" class="form-control" name="ownerName" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">UDYAM NUMBER</label>
                            <input type="text" class="form-control" name="udyamNumber" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">DATE OF REG.</label>
                            <input type="date" class="form-control" name="dateOfReg" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">MOBILE NO.</label>
                            <input type="tel" class="form-control" name="mobile" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">EMAIL ID</label>
                            <input type="email" class="form-control" name="email" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">DATE OF INCORP.</label>
                            <input type="date" class="form-control" name="dateOfIncorp" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">TYPE OF ORGANIZATION</label>
                            <select class="form-select" name="orgType" required>
                                <option value="">SELECT TYPE</option>
                                <option value="PROPRIETORSHIP">PROPRIETORSHIP</option>
                                <option value="PARTNERSHIP">PARTNERSHIP</option>
                                <option value="COMPANY">COMPANY</option>
                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">BUSINESS NAME</label>
                            <input type="text" class="form-control" name="businessName" required>
                        </div>
                        <div class="col-md-12">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">ADDRESS 1</label>
                                    <input type="text" class="form-control" name="address1" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">ADDRESS 2</label>
                                    <input type="text" class="form-control" name="address2">
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">CITY</label>
                                    <input type="text" class="form-control" name="city" required>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">STATE</label>
                                    <input type="text" class="form-control" name="state" required>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">PIN CODE</label>
                                    <input type="text" class="form-control" name="pincode" required>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            `;
    }
}

// Save client
function saveClient() {
    const form = document.getElementById('clientForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const formData = new FormData(form);
    const clientData = Object.fromEntries(formData.entries());
    const clientType = form.getAttribute('data-type');

    // Convert all text values to uppercase
    Object.keys(clientData).forEach(key => {
        if (typeof clientData[key] === 'string' && !key.includes('date')) {
            clientData[key] = clientData[key].toUpperCase();
        }
    });
    
    if (!clientData.id) {
        clientData.id = Date.now();
        clients[clientType].push(clientData);
    } else {
        const index = clients[clientType].findIndex(c => c.id === clientData.id);
        clients[clientType][index] = clientData;
    }
    
    updateClientTable(clientType);
    updateClientCounts();
    bootstrap.Modal.getInstance(document.getElementById('clientModal')).hide();
}

// Update client table
function updateClientTable(clientType, filteredClients = null) {
    const tbody = document.querySelector(`#${clientType}List table tbody`);
    tbody.innerHTML = '';
    
    const clientsToDisplay = filteredClients || clients[clientType];
    clientsToDisplay.forEach((client, index) => {
        const tr = document.createElement('tr');
        const columns = getColumnsForClientType(clientType);
        
        columns.forEach(column => {
            const td = document.createElement('td');
            if (column === 'srNo') {
                td.textContent = index + 1;
            } else if (column === 'actions') {
                td.innerHTML = `
                    <button class="btn btn-sm btn-primary action-btn" onclick="editClient('${clientType}', ${client.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger action-btn" onclick="deleteClient('${clientType}', ${client.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
            } else if (column === 'password') {
                td.innerHTML = `
                    <div class="password-field">
                        <input type="password" class="form-control password-input" value="${client[column] || ''}" readonly>
                        <button type="button" class="password-toggle" onclick="togglePassword(this)">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                `;
            } else if (clientType === 'udyam' && column === 'address') {
                td.textContent = `${client.address1 || ''} ${client.address2 || ''} ${client.city || ''} ${client.state || ''} ${client.pincode || ''}`.trim().toUpperCase();
            } else {
                td.textContent = (client[column] || '').toUpperCase();
            }
            tr.appendChild(td);
        });
        
        tbody.appendChild(tr);
    });
}

// Get columns for client type
function getColumnsForClientType(clientType) {
    switch(clientType) {
        case 'itr':
            return ['srNo', 'name', 'pan', 'fatherName', 'dob', 'mobile', 'returnType', 'status', 'dateOfFiling', 'password', 'ay', 'actions'];
        case 'gst':
            return ['srNo', 'name', 'gstn', 'status', 'state', 'userId', 'password', 'actions'];
        case 'dsc':
            return ['srNo', 'name', 'dscCategory', 'pan', 'aadhar', 'email', 'dateOfApply', 'expiryStatus', 'remarks', 'actions'];
        case 'udyam':
            return ['srNo', 'ownerName', 'udyamNumber', 'dateOfReg', 'mobile', 'email', 'dateOfIncorp', 'orgType', 'businessName', 'address', 'actions'];
    }
}

// Improved editClient function
function editClient(clientType, id) {
    try {
        const client = clients[clientType].find(c => c.id === id);
        if (!client) {
            Swal.fire('Error', 'Client not found', 'error');
            return;
        }
        showClientModal(clientType, client);
    } catch (error) {
        console.error('Edit error:', error);
        Swal.fire('Error', 'Failed to edit client', 'error');
    }
}

// Delete client
function deleteClient(clientType, id) {
    if (confirm('Are you sure you want to delete this client?')) {
        clients[clientType] = clients[clientType].filter(c => c.id !== id);
        updateClientTable(clientType);
        updateClientCounts();
    }
}

// Toggle password visibility
function togglePassword(button) {
    const input = button.parentElement.querySelector('input');
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toUpperCase();
    const activeList = document.querySelector('.client-list.active');
    const clientType = activeList.id.replace('List', '');
    
    const filteredClients = clients[clientType].filter(client => 
        Object.values(client).some(value => 
            String(value).toUpperCase().includes(searchTerm)
        )
    );
    
    updateClientTable(clientType, filteredClients);
}

// Improved filterClients function
function filterClients() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const filter = searchInput.value.toUpperCase();
    const activeList = document.querySelector('.client-list.active');
    if (!activeList) return;
    
    const items = activeList.getElementsByTagName('tr');
    Array.from(items).forEach(item => {
        const cells = item.getElementsByTagName('td');
        const match = Array.from(cells).some(cell => 
            (cell.textContent || cell.innerText).toUpperCase().includes(filter)
        );
        item.style.display = match ? '' : 'none';
    });
}

// Update client counts
function updateClientCounts() {
    Object.keys(clients).forEach(type => {
        const count = document.querySelector(`.client-card[data-type="${type}"] .client-count`);
        if (count) {
            count.textContent = clients[type].length;
        }
    });
}

// Improved exportToExcel function
function exportToExcel() {
    try {
        const reportType = document.getElementById('reportType').value;
        if (!reportType) {
            Swal.fire('Error', 'Please select a report type', 'error');
            return;
        }

        if (!clients[reportType] || !clients[reportType].length) {
            Swal.fire('Error', 'No data available for export', 'error');
            return;
        }

        const data = clients[reportType].map(client => {
            const newClient = {...client};
            delete newClient.id;
            return newClient;
        });
        
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, reportType.toUpperCase());
        XLSX.writeFile(wb, `${reportType.toUpperCase()}_CLIENTS.xlsx`);
    } catch (error) {
        console.error('Export error:', error);
        Swal.fire('Error', 'Failed to export data', 'error');
    }
}

// Load sample data
function loadSampleData() {
    clients.itr = [
        {
            id: 1,
            name: 'JOHN DOE',
            pan: 'ABCDE1234F',
            fatherName: 'JAMES DOE',
            dob: '1990-01-01',
            mobile: '9876543210',
            returnType: 'ITR-1',
            status: 'FILED',
            dateOfFiling: '2023-07-31',
            password: 'password123',
            ay: '2023-24'
        }
    ];
    
    updateClientTables();
    updateClientCounts();
}

// Update all client tables
function updateClientTables() {
    Object.keys(clients).forEach(type => {
        updateClientTable(type);
    });
}
