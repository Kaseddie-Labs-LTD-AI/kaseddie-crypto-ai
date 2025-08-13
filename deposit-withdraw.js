// Deposit & Withdraw JavaScript
class DepositWithdrawSystem {
    constructor() {
        this.currentMethod = null;
        this.feeRates = {
            bank: 0.005,      // 0.5%
            mobile: 0.01,     // 1.0%
            card: 0.025,      // 2.5%
            crypto: 0.001,    // 0.1%
            bankWithdraw: 5,  // $5 flat fee
            mobileWithdraw: 0.02 // 2.0%
        };
        this.init();
    }

    init() {
        this.setupTabs();
        this.setupMethodSelection();
        this.setupFormValidation();
    }

    setupTabs() {
        document.querySelectorAll('.main-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchMainTab(tabName);
            });
        });
    }

    switchMainTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.main-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        // Reset forms
        this.resetForms();
    }

    setupMethodSelection() {
        document.querySelectorAll('.method-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const method = e.currentTarget.dataset.method;
                this.selectMethod(method);
            });
        });
    }

    selectMethod(method) {
        // Remove active class from all method cards
        document.querySelectorAll('.method-card').forEach(card => {
            card.classList.remove('active');
        });

        // Add active class to selected method
        document.querySelector(`[data-method="${method}"]`).classList.add('active');

        // Hide all forms
        document.querySelectorAll('.deposit-form, .withdraw-form').forEach(form => {
            form.style.display = 'none';
        });

        // Show selected form
        const formId = method.includes('withdraw') ? `${method}-form` : `${method}-form`;
        const form = document.getElementById(formId);
        if (form) {
            form.style.display = 'block';
        }

        this.currentMethod = method;
    }

    setupFormValidation() {
        // Card number formatting
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                e.target.value = formattedValue;
            });
        }

        // Expiry date formatting
        const expiryInput = document.getElementById('expiryDate');
        if (expiryInput) {
            expiryInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value;
            });
        }

        // Phone number formatting
        document.querySelectorAll('input[type="tel"]').forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/[^0-9+]/g, '');
                e.target.value = value;
            });
        });
    }

    resetForms() {
        document.querySelectorAll('.method-card').forEach(card => {
            card.classList.remove('active');
        });
        document.querySelectorAll('.deposit-form, .withdraw-form').forEach(form => {
            form.style.display = 'none';
        });
        this.currentMethod = null;
    }
}

// Fee calculation functions
function calculateFee(method) {
    const amount = parseFloat(document.getElementById(`${method}Amount`).value) || 0;
    const feeRate = {
        bank: 0.005,
        mobile: 0.01,
        card: 0.025,
        crypto: 0.001
    }[method];

    const fee = amount * feeRate;
    const total = amount + fee;

    document.getElementById(`${method}AmountDisplay`).textContent = `$${amount.toFixed(2)}`;
    document.getElementById(`${method}FeeDisplay`).textContent = `$${fee.toFixed(2)}`;
    document.getElementById(`${method}TotalDisplay`).textContent = `$${total.toFixed(2)}`;
}

function calculateWithdrawFee(method) {
    const amount = parseFloat(document.getElementById(`${method}WithdrawAmount`).value) || 0;
    let fee = 0;

    if (method === 'bank') {
        fee = 5; // Flat $5 fee
    } else if (method === 'mobile') {
        fee = amount * 0.02; // 2% fee
    }

    const total = amount - fee;

    document.getElementById(`${method}WithdrawAmountDisplay`).textContent = `$${amount.toFixed(2)}`;
    document.getElementById(`${method}WithdrawFeeDisplay`).textContent = `$${fee.toFixed(2)}`;
    document.getElementById(`${method}WithdrawTotalDisplay`).textContent = `$${Math.max(0, total).toFixed(2)}`;
}

// Deposit processing functions
async function processDeposit(method) {
    const depositData = getDepositData(method);
    
    if (!validateDepositData(depositData, method)) {
        return;
    }

    const confirmation = confirm(`Confirm ${method.toUpperCase()} deposit of $${depositData.amount}?`);
    if (!confirmation) return;

    try {
        // Show processing state
        const button = document.querySelector(`#${method}-form .deposit-btn`);
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        button.disabled = true;

        // Simulate API call
        await simulatePaymentProcessing(method, depositData);

        // Success
        showSuccessMessage(`Deposit of $${depositData.amount} via ${method} initiated successfully!`);
        addTransactionToHistory('deposit', method, depositData.amount, 'pending');
        resetForm(method);

    } catch (error) {
        showErrorMessage(`Deposit failed: ${error.message}`);
    } finally {
        // Reset button
        const button = document.querySelector(`#${method}-form .deposit-btn`);
        button.innerHTML = originalText;
        button.disabled = false;
    }
}

function getDepositData(method) {
    const data = { method };

    switch (method) {
        case 'bank':
            data.bank = document.getElementById('bankSelect').value;
            data.accountNumber = document.getElementById('accountNumber').value;
            data.accountName = document.getElementById('accountName').value;
            data.amount = parseFloat(document.getElementById('bankAmount').value);
            break;
        case 'mobile':
            data.provider = document.getElementById('mobileProvider').value;
            data.phoneNumber = document.getElementById('mobileNumber').value;
            data.amount = parseFloat(document.getElementById('mobileAmount').value);
            break;
        case 'card':
            data.cardNumber = document.getElementById('cardNumber').value;
            data.expiryDate = document.getElementById('expiryDate').value;
            data.cvv = document.getElementById('cvv').value;
            data.cardholderName = document.getElementById('cardholderName').value;
            data.amount = parseFloat(document.getElementById('cardAmount').value);
            break;
        case 'crypto':
            data.cryptocurrency = document.getElementById('cryptoSelect').value;
            data.address = document.getElementById('cryptoAddress').value;
            break;
    }

    return data;
}

function validateDepositData(data, method) {
    if (method !== 'crypto' && (!data.amount || data.amount <= 0)) {
        showErrorMessage('Please enter a valid amount');
        return false;
    }

    switch (method) {
        case 'bank':
            if (!data.bank || !data.accountNumber || !data.accountName) {
                showErrorMessage('Please fill in all bank details');
                return false;
            }
            break;
        case 'mobile':
            if (!data.provider || !data.phoneNumber) {
                showErrorMessage('Please fill in all mobile money details');
                return false;
            }
            if (!data.phoneNumber.match(/^\+?[0-9]{10,15}$/)) {
                showErrorMessage('Please enter a valid phone number');
                return false;
            }
            break;
        case 'card':
            if (!data.cardNumber || !data.expiryDate || !data.cvv || !data.cardholderName) {
                showErrorMessage('Please fill in all card details');
                return false;
            }
            if (data.cardNumber.replace(/\s/g, '').length < 13) {
                showErrorMessage('Please enter a valid card number');
                return false;
            }
            break;
    }

    return true;
}

// Withdrawal processing functions
async function processWithdraw(method) {
    const withdrawData = getWithdrawData(method);
    
    if (!validateWithdrawData(withdrawData, method)) {
        return;
    }

    const confirmation = confirm(`Confirm withdrawal of $${withdrawData.amount} via ${method}?`);
    if (!confirmation) return;

    try {
        // Show processing state
        const button = document.querySelector(`#${method}-withdraw-form .withdraw-btn`);
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        button.disabled = true;

        // Simulate API call
        await simulatePaymentProcessing(method, withdrawData);

        // Success
        showSuccessMessage(`Withdrawal of $${withdrawData.amount} via ${method} initiated successfully!`);
        addTransactionToHistory('withdraw', method, withdrawData.amount, 'pending');
        resetWithdrawForm(method);

    } catch (error) {
        showErrorMessage(`Withdrawal failed: ${error.message}`);
    } finally {
        // Reset button
        const button = document.querySelector(`#${method}-withdraw-form .withdraw-btn`);
        button.innerHTML = originalText;
        button.disabled = false;
    }
}

function getWithdrawData(method) {
    const data = { method };

    switch (method) {
        case 'bank':
            data.bank = document.getElementById('withdrawBankSelect').value;
            data.accountNumber = document.getElementById('withdrawAccountNumber').value;
            data.accountName = document.getElementById('withdrawAccountName').value;
            data.amount = parseFloat(document.getElementById('bankWithdrawAmount').value);
            break;
        case 'mobile':
            data.provider = document.getElementById('withdrawMobileProvider').value;
            data.phoneNumber = document.getElementById('withdrawMobileNumber').value;
            data.amount = parseFloat(document.getElementById('mobileWithdrawAmount').value);
            break;
        case 'crypto':
            data.cryptocurrency = document.getElementById('withdrawCryptoSelect').value;
            data.address = document.getElementById('withdrawCryptoAddress').value;
            data.amount = parseFloat(document.getElementById('cryptoWithdrawAmount').value);
            break;
    }

    return data;
}

function validateWithdrawData(data, method) {
    if (!data.amount || data.amount <= 0) {
        showErrorMessage('Please enter a valid amount');
        return false;
    }

    // Check available balance
    const availableBalance = 12450; // This would come from API
    if (data.amount > availableBalance) {
        showErrorMessage('Insufficient balance');
        return false;
    }

    switch (method) {
        case 'bank':
            if (!data.bank || !data.accountNumber || !data.accountName) {
                showErrorMessage('Please fill in all bank details');
                return false;
            }
            break;
        case 'mobile':
            if (!data.provider || !data.phoneNumber) {
                showErrorMessage('Please fill in all mobile money details');
                return false;
            }
            break;
        case 'crypto':
            if (!data.address) {
                showErrorMessage('Please enter a valid wallet address');
                return false;
            }
            break;
    }

    return true;
}

// Utility functions
async function simulatePaymentProcessing(method, data) {
    // Simulate different processing times
    const processingTime = {
        bank: 2000,
        mobile: 1500,
        card: 3000,
        crypto: 1000
    }[method] || 2000;

    await new Promise(resolve => setTimeout(resolve, processingTime));

    // Simulate occasional failures for realism
    if (Math.random() < 0.1) {
        throw new Error('Payment processing failed. Please try again.');
    }
}

function addTransactionToHistory(type, method, amount, status) {
    const historyList = document.getElementById('transactionHistory');
    const transactionItem = document.createElement('div');
    transactionItem.className = 'transaction-item';
    
    const sign = type === 'deposit' ? '+' : '-';
    const methodName = getMethodDisplayName(method);
    
    transactionItem.innerHTML = `
        <div class="transaction-info">
            <span class="transaction-type ${type}">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
            <span class="transaction-method">${methodName}</span>
        </div>
        <div class="transaction-details">
            <span class="transaction-amount">${sign}$${amount.toFixed(2)}</span>
            <span class="transaction-status ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>
            <span class="transaction-time">Just now</span>
        </div>
    `;
    
    historyList.insertBefore(transactionItem, historyList.firstChild);
}

function getMethodDisplayName(method) {
    const names = {
        bank: 'Bank Transfer',
        mobile: 'Mobile Money',
        card: 'Card Payment',
        crypto: 'Cryptocurrency'
    };
    return names[method] || method;
}

function resetForm(method) {
    const form = document.getElementById(`${method}-form`);
    if (form) {
        form.querySelectorAll('input, select').forEach(input => {
            if (input.type !== 'button' && input.type !== 'submit') {
                input.value = '';
            }
        });
        // Reset fee displays
        calculateFee(method);
    }
}

function resetWithdrawForm(method) {
    const form = document.getElementById(`${method}-withdraw-form`);
    if (form) {
        form.querySelectorAll('input, select').forEach(input => {
            if (input.type !== 'button' && input.type !== 'submit') {
                input.value = '';
            }
        });
        // Reset fee displays
        calculateWithdrawFee(method);
    }
}

function showSuccessMessage(message) {
    showNotification(message, 'success');
}

function showErrorMessage(message) {
    showNotification(message, 'error');
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        word-wrap: break-word;
        background: ${type === 'success' ? '#00ff88' : type === 'error' ? '#ff4757' : '#00d4ff'};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

// Crypto-specific functions
function updateCryptoAddress() {
    const crypto = document.getElementById('cryptoSelect').value;
    const addresses = {
        bitcoin: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        ethereum: '0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e',
        usdt: '0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e',
        usdc: '0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e'
    };
    
    const networks = {
        bitcoin: 'Bitcoin',
        ethereum: 'Ethereum',
        usdt: 'Ethereum (ERC-20)',
        usdc: 'Ethereum (ERC-20)'
    };
    
    const minDeposits = {
        bitcoin: '0.001 BTC',
        ethereum: '0.01 ETH',
        usdt: '10 USDT',
        usdc: '10 USDC'
    };
    
    document.getElementById('cryptoAddress').value = addresses[crypto];
    document.getElementById('cryptoNetwork').textContent = networks[crypto];
    document.getElementById('minDeposit').textContent = minDeposits[crypto];
}

function copyAddress() {
    const addressInput = document.getElementById('cryptoAddress');
    addressInput.select();
    document.execCommand('copy');
    showSuccessMessage('Address copied to clipboard!');
}

// Initialize the system
document.addEventListener('DOMContentLoaded', () => {
    new DepositWithdrawSystem();
    
    // Add CSS for the interface
    const style = document.createElement('style');
    style.textContent = `
        .deposit-withdraw-interface {
            min-height: 100vh;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
            color: white;
            padding: 20px;
        }
        
        .interface-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .interface-header h1 {
            color: #00d4ff;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .balance-display {
            font-size: 18px;
        }
        
        .balance-amount {
            color: #00ff88;
            font-weight: bold;
        }
        
        .main-tabs {
            display: flex;
            margin-bottom: 30px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 25px;
            padding: 5px;
        }
        
        .main-tab {
            flex: 1;
            background: none;
            border: none;
            color: white;
            padding: 15px 20px;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .main-tab.active {
            background: #00d4ff;
            color: white;
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
        }
        
        .payment-methods h3 {
            color: #00d4ff;
            margin-bottom: 20px;
        }
        
        .methods-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .method-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 15px;
            padding: 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .method-card:hover,
        .method-card.active {
            border-color: #00d4ff;
            background: rgba(0, 212, 255, 0.1);
            transform: translateY(-5px);
        }
        
        .method-icon {
            font-size: 32px;
            color: #00d4ff;
            margin-bottom: 15px;
        }
        
        .method-card h4 {
            margin: 10px 0;
            color: white;
        }
        
        .method-card p {
            color: #cccccc;
            font-size: 14px;
            margin-bottom: 10px;
        }
        
        .fee {
            color: #00ff88;
            font-size: 12px;
            font-weight: bold;
        }
        
        .deposit-form,
        .withdraw-form {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 25px;
            margin-top: 20px;
        }
        
        .deposit-form h3,
        .withdraw-form h3 {
            color: #00d4ff;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .form-section {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .form-group {
            display: flex;
            flex-direction: column;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        
        .form-group label {
            margin-bottom: 8px;
            color: #cccccc;
            font-weight: 500;
        }
        
        .form-group input,
        .form-group select {
            padding: 12px 15px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 8px;
            color: white;
            font-size: 14px;
            transition: all 0.3s ease;
        }
        
        .form-group input:focus,
        .form-group select:focus {
            outline: none;
            border-color: #00d4ff;
            box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
        }
        
        .fee-display {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            padding: 15px;
        }
        
        .fee-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            color: #cccccc;
        }
        
        .fee-item.total {
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            padding-top: 8px;
            font-weight: bold;
            color: #00ff88;
        }
        
        .deposit-btn,
        .withdraw-btn {
            padding: 15px 25px;
            border: none;
            border-radius: 25px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: all 0.3s ease;
        }
        
        .deposit-btn {
            background: linear-gradient(135deg, #00ff88, #00cc6a);
            color: white;
        }
        
        .withdraw-btn {
            background: linear-gradient(135deg, #ff6b35, #f7931e);
            color: white;
        }
        
        .deposit-btn:hover,
        .withdraw-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }
        
        .deposit-btn:disabled,
        .withdraw-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        
        .crypto-address {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            padding: 15px;
        }
        
        .address-display {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
        }
        
        .address-display input {
            flex: 1;
        }
        
        .copy-btn {
            background: #00d4ff;
            border: none;
            color: white;
            padding: 12px 15px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .copy-btn:hover {
            background: #0099cc;
        }
        
        .qr-code {
            text-align: center;
            margin-bottom: 15px;
        }
        
        .qr-placeholder {
            width: 150px;
            height: 150px;
            background: rgba(255, 255, 255, 0.1);
            border: 2px dashed rgba(255, 255, 255, 0.3);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
            color: #888;
        }
        
        .crypto-info,
        .info-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            color: #cccccc;
        }
        
        .transaction-history {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 25px;
            margin-top: 30px;
        }
        
        .transaction-history h3 {
            color: #00d4ff;
            margin-bottom: 20px;
        }
        
        .transaction-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            margin-bottom: 10px;
        }
        
        .transaction-type {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            margin-right: 10px;
        }
        
        .transaction-type.deposit {
            background: rgba(0, 255, 136, 0.2);
            color: #00ff88;
        }
        
        .transaction-type.withdraw {
            background: rgba(255, 107, 53, 0.2);
            color: #ff6b35;
        }
        
        .transaction-method {
            color: #cccccc;
            font-size: 14px;
        }
        
        .transaction-details {
            text-align: right;
        }
        
        .transaction-amount {
            font-weight: bold;
            display: block;
            margin-bottom: 5px;
        }
        
        .transaction-status {
            padding: 2px 6px;
            border-radius: 8px;
            font-size: 11px;
            text-transform: uppercase;
            margin-right: 8px;
        }
        
        .transaction-status.completed {
            background: rgba(0, 255, 136, 0.2);
            color: #00ff88;
        }
        
        .transaction-status.pending {
            background: rgba(255, 165, 2, 0.2);
            color: #ffa502;
        }
        
        .transaction-time {
            color: #888;
            font-size: 12px;
        }
        
        @media (max-width: 768px) {
            .methods-grid {
                grid-template-columns: 1fr;
            }
            
            .form-row {
                grid-template-columns: 1fr;
            }
            
            .interface-header {
                flex-direction: column;
                gap: 15px;
                text-align: center;
            }
        }
    `;
    document.head.appendChild(style);
});