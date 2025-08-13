// Starknet Wallet Integration
class StarknetWalletManager {
    constructor() {
        this.wallet = null;
        this.account = null;
        this.isConnected = false;
        this.supportedWallets = ['argentX', 'braavos'];
        this.init();
    }

    async init() {
        this.setupWalletButton();
        this.checkExistingConnection();
        this.loadStarknetJS();
    }

    async loadStarknetJS() {
        // Load Starknet.js library
        if (!window.starknet) {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/starknet@latest/dist/index.umd.js';
            script.onload = () => {
                console.log('Starknet.js loaded successfully');
                this.initializeStarknet();
            };
            document.head.appendChild(script);
        } else {
            this.initializeStarknet();
        }
    }

    async initializeStarknet() {
        try {
            // Check if wallet extensions are available
            this.checkWalletAvailability();
        } catch (error) {
            console.error('Starknet initialization failed:', error);
        }
    }

    checkWalletAvailability() {
        // Wait for wallet extensions to load
        setTimeout(() => {
            const walletStatus = {
                argentX: !!window.starknet_argentX,
                braavos: !!window.starknet_braavos
            };
            
            console.log('Wallet availability:', walletStatus);
            this.updateWalletButton(walletStatus);
            
            if (!walletStatus.argentX && !walletStatus.braavos) {
                console.log('No Starknet wallets detected - Demo mode available');
            }
        }, 2000);
    }

    setupWalletButton() {
        // Add wallet connect button to navigation
        const walletButton = document.createElement('div');
        walletButton.className = 'wallet-connect-container';
        walletButton.innerHTML = `
            <button class="wallet-connect-btn" id="walletConnectBtn" onclick="connectStarknetWallet()">
                <i class="fas fa-wallet"></i>
                <span id="walletBtnText">Connect Wallet</span>
            </button>
            <div class="wallet-dropdown" id="walletDropdown">
                <div class="wallet-option" data-wallet="argentX">
                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+PC9zdmc+" alt="ArgentX">
                    <span>Ready Wallet</span>
                </div>
                <div class="wallet-option" data-wallet="braavos">
                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+PC9zdmc+" alt="Braavos">
                    <span>Braavos</span>
                </div>
            </div>
        `;

        // Insert into navigation
        const navActions = document.querySelector('.nav-actions');
        if (navActions) {
            navActions.insertBefore(walletButton, navActions.firstChild);
        }

        this.addWalletStyles();
    }

    addWalletStyles() {
        const walletStyles = document.createElement('style');
        walletStyles.textContent = `
            .wallet-connect-container {
                position: relative;
                margin-right: 15px;
            }
            
            .wallet-connect-btn {
                background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
                border: none;
                color: white;
                padding: 10px 20px;
                border-radius: 25px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 600;
                transition: all 0.3s ease;
                font-size: 14px;
            }
            
            .wallet-connect-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
            }
            
            .wallet-connect-btn.connected {
                background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
            }
            
            .wallet-dropdown {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                background: rgba(0, 0, 0, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 10px;
                min-width: 180px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
                z-index: 1001;
                margin-top: 5px;
            }
            
            .wallet-dropdown.show {
                display: block;
            }
            
            .wallet-option {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 16px;
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .wallet-option:last-child {
                border-bottom: none;
            }
            
            .wallet-option:hover {
                background: rgba(255, 107, 53, 0.1);
            }
            
            .wallet-option img {
                width: 24px;
                height: 24px;
                border-radius: 50%;
            }
            
            .wallet-info {
                background: rgba(0, 255, 136, 0.1);
                border: 1px solid rgba(0, 255, 136, 0.3);
                border-radius: 10px;
                padding: 10px 15px;
                margin: 10px 0;
                font-size: 12px;
            }
            
            .wallet-address {
                font-family: monospace;
                color: #00ff88;
                word-break: break-all;
            }
        `;
        document.head.appendChild(walletStyles);
    }

    updateWalletButton(walletStatus) {
        const button = document.getElementById('walletConnectBtn');
        const text = document.getElementById('walletBtnText');
        
        if (this.isConnected) {
            button.classList.add('connected');
            text.textContent = `${this.account?.address?.slice(0, 6)}...${this.account?.address?.slice(-4)}`;
        } else {
            button.classList.remove('connected');
            text.textContent = 'Connect Wallet';
        }
    }

    async connectWallet(walletType) {
        try {
            // Check if wallet extensions are installed
            if (walletType === 'argentX') {
                if (typeof window.starknet_argentX === 'undefined') {
                    this.showNotification('Ready Wallet not found. Please install Ready Wallet extension from Chrome Web Store.', 'error');
                    window.open('https://chrome.google.com/webstore/detail/argent-x/dlcobpjiigpikoobohmabehhmhfoodbb', '_blank');
                    return;
                }
                this.wallet = window.starknet_argentX;
            } else if (walletType === 'braavos') {
                if (typeof window.starknet_braavos === 'undefined') {
                    this.showNotification('Braavos wallet not found. Please install Braavos extension from Chrome Web Store.', 'error');
                    window.open('https://chrome.google.com/webstore/detail/braavos-wallet/jnlgamecbpmbajjfhmmmlhejkemejdma', '_blank');
                    return;
                }
                this.wallet = window.starknet_braavos;
            }

            // Request connection
            const result = await this.wallet.enable({ starknetVersion: 'v5' });
            
            if (result && result.length > 0) {
                this.account = { address: result[0] };
                this.isConnected = true;
                
                // Update UI
                this.updateWalletButton();
                this.showWalletInfo();
                
                // Store connection
                localStorage.setItem('starknet_wallet', walletType);
                localStorage.setItem('starknet_address', this.account.address);

                this.showNotification(`${walletType} wallet connected successfully!`, 'success');
            } else {
                throw new Error('Connection rejected by user');
            }
            
            // Hide dropdown
            document.getElementById('walletDropdown').classList.remove('show');

        } catch (error) {
            console.error('Wallet connection failed:', error);
            if (error.message.includes('rejected')) {
                this.showNotification('Wallet connection rejected by user', 'error');
            } else {
                this.showNotification(`Demo Mode: ${walletType} connected (0x1234...5678)`, 'info');
                // Demo connection for testing
                this.account = { address: '0x1234567890abcdef1234567890abcdef12345678' };
                this.isConnected = true;
                this.updateWalletButton();
                this.showWalletInfo();
            }
        }
    }

    async checkExistingConnection() {
        const savedWallet = localStorage.getItem('starknet_wallet');
        const savedAddress = localStorage.getItem('starknet_address');
        
        if (savedWallet && savedAddress) {
            try {
                await this.connectWallet(savedWallet);
            } catch (error) {
                console.log('Auto-reconnection failed:', error);
                this.clearConnection();
            }
        }
    }

    showWalletInfo() {
        if (!this.isConnected) return;

        const walletInfo = document.createElement('div');
        walletInfo.className = 'wallet-info';
        walletInfo.innerHTML = `
            <div><strong>Connected Wallet:</strong> ${this.getWalletName()}</div>
            <div><strong>Address:</strong> <span class="wallet-address">${this.account.address}</span></div>
            <div><strong>Network:</strong> Starknet Mainnet</div>
        `;

        // Add to hero section or create a dedicated wallet status area
        const heroContent = document.querySelector('.hero-content');
        if (heroContent && !document.querySelector('.wallet-info')) {
            heroContent.appendChild(walletInfo);
        }
    }

    getWalletName() {
        if (this.wallet === window.starknet_argentX) return 'Ready Wallet';
        if (this.wallet === window.starknet_braavos) return 'Braavos';
        return 'Unknown';
    }

    async disconnectWallet() {
        this.wallet = null;
        this.account = null;
        this.isConnected = false;
        
        localStorage.removeItem('starknet_wallet');
        localStorage.removeItem('starknet_address');
        
        this.updateWalletButton();
        
        // Remove wallet info
        const walletInfo = document.querySelector('.wallet-info');
        if (walletInfo) {
            walletInfo.remove();
        }
        
        this.showNotification('Wallet disconnected', 'info');
    }

    async executeTransaction(calls) {
        if (!this.isConnected) {
            throw new Error('Wallet not connected');
        }

        try {
            const result = await this.account.execute(calls);
            return result;
        } catch (error) {
            console.error('Transaction failed:', error);
            throw error;
        }
    }

    showNotification(message, type) {
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
            background: ${type === 'success' ? '#00ff88' : type === 'error' ? '#ff4757' : '#00d4ff'};
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
    }

    clearConnection() {
        localStorage.removeItem('starknet_wallet');
        localStorage.removeItem('starknet_address');
        this.isConnected = false;
        this.updateWalletButton();
    }
}

// Global functions
let starknetWallet;

function connectStarknetWallet() {
    const dropdown = document.getElementById('walletDropdown');
    dropdown.classList.toggle('show');
    
    // Add click listeners to wallet options
    document.querySelectorAll('.wallet-option').forEach(option => {
        option.onclick = () => {
            const walletType = option.dataset.wallet;
            starknetWallet.connectWallet(walletType);
        };
    });
}

function disconnectStarknetWallet() {
    if (starknetWallet) {
        starknetWallet.disconnectWallet();
    }
}

// Initialize Starknet integration
document.addEventListener('DOMContentLoaded', () => {
    starknetWallet = new StarknetWalletManager();
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.wallet-connect-container')) {
        const dropdown = document.getElementById('walletDropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StarknetWalletManager;
} else if (typeof window !== 'undefined') {
    window.StarknetWalletManager = StarknetWalletManager;
}