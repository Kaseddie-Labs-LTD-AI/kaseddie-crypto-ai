// Enhanced Cairo Wallet Integration for Kaseddie Crypto-AI
class CairoWalletIntegration {
    constructor() {
        this.contractAddress = '0x...'; // Deploy contract and add address
        this.provider = null;
        this.account = null;
        this.init();
    }

    async init() {
        if (typeof window.starknet !== 'undefined') {
            this.provider = new starknet.Provider({ sequencer: { network: 'mainnet-alpha' } });
        }
    }

    async connectToContract() {
        if (!starknetWallet?.isConnected) {
            throw new Error('Please connect your Starknet wallet first');
        }

        this.account = starknetWallet.account;
        return true;
    }

    async deposit(amount) {
        await this.connectToContract();
        
        const call = {
            contractAddress: this.contractAddress,
            entrypoint: 'deposit',
            calldata: [amount.toString(), '0'] // Uint256 format
        };

        try {
            const result = await this.account.execute(call);
            this.showNotification('Deposit successful!', 'success');
            return result;
        } catch (error) {
            this.showNotification('Deposit failed: ' + error.message, 'error');
            throw error;
        }
    }

    async withdraw(amount) {
        await this.connectToContract();
        
        const call = {
            contractAddress: this.contractAddress,
            entrypoint: 'withdraw',
            calldata: [amount.toString(), '0']
        };

        try {
            const result = await this.account.execute(call);
            this.showNotification('Withdrawal successful!', 'success');
            return result;
        } catch (error) {
            this.showNotification('Withdrawal failed: ' + error.message, 'error');
            throw error;
        }
    }

    async investInAIStrategy(strategyId, amount) {
        await this.connectToContract();
        
        const call = {
            contractAddress: this.contractAddress,
            entrypoint: 'invest_in_ai_strategy',
            calldata: [strategyId.toString(), amount.toString(), '0']
        };

        try {
            const result = await this.account.execute(call);
            this.showNotification(`Invested ${amount} in AI Strategy ${strategyId}!`, 'success');
            return result;
        } catch (error) {
            this.showNotification('Investment failed: ' + error.message, 'error');
            throw error;
        }
    }

    async getBalance(userAddress = null) {
        const address = userAddress || this.account?.address;
        if (!address) throw new Error('No address provided');

        try {
            const result = await this.provider.callContract({
                contractAddress: this.contractAddress,
                entrypoint: 'get_balance',
                calldata: [address]
            });

            return parseInt(result.result[0]);
        } catch (error) {
            console.error('Failed to get balance:', error);
            return 0;
        }
    }

    async getTotalProfits(userAddress = null) {
        const address = userAddress || this.account?.address;
        if (!address) throw new Error('No address provided');

        try {
            const result = await this.provider.callContract({
                contractAddress: this.contractAddress,
                entrypoint: 'get_total_profits',
                calldata: [address]
            });

            return parseInt(result.result[0]);
        } catch (error) {
            console.error('Failed to get profits:', error);
            return 0;
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `cairo-notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 3000;
            animation: slideIn 0.3s ease-out;
            background: ${type === 'success' ? '#00ff88' : type === 'error' ? '#ff4757' : '#00d4ff'};
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
    }
}

// Enhanced UI Integration
function enhanceWalletUI() {
    const walletActions = document.createElement('div');
    walletActions.className = 'cairo-wallet-actions';
    walletActions.innerHTML = `
        <div class="wallet-balance-display">
            <h3>Cairo Wallet Balance</h3>
            <div class="balance-amount" id="cairoBalance">0 ETH</div>
            <div class="profits-amount" id="cairoProfits">Total Profits: 0 ETH</div>
        </div>
        
        <div class="wallet-action-buttons">
            <button class="cairo-btn deposit-btn" onclick="showDepositModal()">
                <i class="fas fa-plus"></i> Deposit
            </button>
            <button class="cairo-btn withdraw-btn" onclick="showWithdrawModal()">
                <i class="fas fa-minus"></i> Withdraw
            </button>
            <button class="cairo-btn invest-btn" onclick="showInvestModal()">
                <i class="fas fa-robot"></i> AI Invest
            </button>
        </div>
    `;

    // Add to dashboard
    const dashboard = document.querySelector('.dashboard-content') || document.querySelector('.hero-content');
    if (dashboard) {
        dashboard.appendChild(walletActions);
    }

    addCairoWalletStyles();
}

function addCairoWalletStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
        .cairo-wallet-actions {
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid rgba(255, 107, 53, 0.3);
            border-radius: 15px;
            padding: 20px;
            margin: 20px 0;
            backdrop-filter: blur(10px);
        }
        
        .wallet-balance-display {
            text-align: center;
            margin-bottom: 20px;
        }
        
        .balance-amount {
            font-size: 2em;
            font-weight: bold;
            color: #00ff88;
            margin: 10px 0;
        }
        
        .profits-amount {
            color: #00d4ff;
            font-size: 1.1em;
        }
        
        .wallet-action-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .cairo-btn {
            background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
            border: none;
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .cairo-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
        }
        
        .invest-btn {
            background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
        }
        
        .withdraw-btn {
            background: linear-gradient(135deg, #ff4757 0%, #c44569 100%);
        }
    `;
    document.head.appendChild(styles);
}

// Modal functions
function showDepositModal() {
    const modal = createCairoModal('Deposit to Cairo Wallet', `
        <input type="number" id="depositAmount" placeholder="Amount in ETH" step="0.001" min="0">
        <button onclick="executeDeposit()" class="cairo-btn">Deposit</button>
    `);
    document.body.appendChild(modal);
}

function showWithdrawModal() {
    const modal = createCairoModal('Withdraw from Cairo Wallet', `
        <input type="number" id="withdrawAmount" placeholder="Amount in ETH" step="0.001" min="0">
        <button onclick="executeWithdraw()" class="cairo-btn">Withdraw</button>
    `);
    document.body.appendChild(modal);
}

function showInvestModal() {
    const modal = createCairoModal('Invest in AI Strategy', `
        <select id="strategySelect">
            <option value="1">Conservative AI Strategy</option>
            <option value="2">Aggressive AI Strategy</option>
            <option value="3">Balanced AI Strategy</option>
        </select>
        <input type="number" id="investAmount" placeholder="Amount in ETH" step="0.001" min="0">
        <button onclick="executeInvest()" class="cairo-btn invest-btn">Invest</button>
    `);
    document.body.appendChild(modal);
}

function createCairoModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'cairo-modal';
    modal.innerHTML = `
        <div class="cairo-modal-content">
            <div class="cairo-modal-header">
                <h3>${title}</h3>
                <span class="cairo-close" onclick="this.closest('.cairo-modal').remove()">&times;</span>
            </div>
            <div class="cairo-modal-body">
                ${content}
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 4000;
    `;
    
    return modal;
}

// Execution functions
async function executeDeposit() {
    const amount = document.getElementById('depositAmount').value;
    if (!amount) return;
    
    try {
        await cairoWallet.deposit(parseFloat(amount) * 1e18); // Convert to wei
        document.querySelector('.cairo-modal').remove();
        updateWalletDisplay();
    } catch (error) {
        console.error('Deposit failed:', error);
    }
}

async function executeWithdraw() {
    const amount = document.getElementById('withdrawAmount').value;
    if (!amount) return;
    
    try {
        await cairoWallet.withdraw(parseFloat(amount) * 1e18);
        document.querySelector('.cairo-modal').remove();
        updateWalletDisplay();
    } catch (error) {
        console.error('Withdraw failed:', error);
    }
}

async function executeInvest() {
    const strategyId = document.getElementById('strategySelect').value;
    const amount = document.getElementById('investAmount').value;
    if (!amount || !strategyId) return;
    
    try {
        await cairoWallet.investInAIStrategy(parseInt(strategyId), parseFloat(amount) * 1e18);
        document.querySelector('.cairo-modal').remove();
        updateWalletDisplay();
    } catch (error) {
        console.error('Investment failed:', error);
    }
}

async function updateWalletDisplay() {
    if (!cairoWallet || !starknetWallet?.isConnected) return;
    
    try {
        const balance = await cairoWallet.getBalance();
        const profits = await cairoWallet.getTotalProfits();
        
        document.getElementById('cairoBalance').textContent = `${(balance / 1e18).toFixed(4)} ETH`;
        document.getElementById('cairoProfits').textContent = `Total Profits: ${(profits / 1e18).toFixed(4)} ETH`;
    } catch (error) {
        console.error('Failed to update display:', error);
    }
}

// Initialize Cairo wallet
let cairoWallet;

document.addEventListener('DOMContentLoaded', () => {
    cairoWallet = new CairoWalletIntegration();
    
    // Wait for Starknet wallet to be ready
    setTimeout(() => {
        if (starknetWallet?.isConnected) {
            enhanceWalletUI();
            updateWalletDisplay();
        }
    }, 2000);
});

// Export for global use
window.cairoWallet = cairoWallet;