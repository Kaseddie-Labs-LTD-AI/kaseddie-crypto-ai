// Trading Platform JavaScript
class TradingPlatform {
    constructor() {
        this.apiBase = 'http://localhost:3002/api';
        this.currentTab = 'dashboard';
        this.isListening = false;
        this.recognition = null;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupVoiceRecognition();
        this.loadInitialData();
        this.setupEventListeners();
        this.startDataRefresh();
    }

    setupNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });
    }

    switchTab(tabName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        this.currentTab = tabName;

        // Load tab-specific data
        switch(tabName) {
            case 'portfolio':
                this.loadPortfolioData();
                break;
            case 'analytics':
                this.loadAnalyticsData();
                break;
        }
    }

    setupVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onstart = () => {
                this.isListening = true;
                document.getElementById('voiceStatus').textContent = 'Listening... Speak now!';
                document.querySelector('.pulse').style.animationDuration = '0.5s';
            };
            
            this.recognition.onresult = (event) => {
                const command = event.results[0][0].transcript;
                this.processVoiceCommand(command);
            };
            
            this.recognition.onerror = (event) => {
                this.isListening = false;
                document.getElementById('voiceStatus').textContent = `Error: ${event.error}`;
                document.querySelector('.pulse').style.animationDuration = '1.5s';
            };
            
            this.recognition.onend = () => {
                this.isListening = false;
                document.getElementById('voiceStatus').textContent = 'Click to start listening...';
                document.querySelector('.pulse').style.animationDuration = '1.5s';
            };
        }
    }

    setupEventListeners() {
        // Voice button
        document.getElementById('voiceBtn').addEventListener('click', () => {
            this.showVoiceModal();
        });

        // Voice animation click
        document.getElementById('voiceAnimation').addEventListener('click', () => {
            this.toggleVoiceRecognition();
        });
    }

    async loadInitialData() {
        await Promise.all([
            this.loadPrices(),
            this.loadPortfolioOverview(),
            this.loadMarketAnalysis()
        ]);
    }

    async loadPrices() {
        try {
            const response = await fetch(`${this.apiBase}/prices`);
            const data = await response.json();
            
            this.updateTickerPrices(data.prices);
            this.updatePriceList(data.prices);
        } catch (error) {
            console.error('Failed to load prices:', error);
            // Use demo data
            const demoData = {
                bitcoin: { usd: 65420, usd_24h_change: 2.5 },
                ethereum: { usd: 3580, usd_24h_change: 1.8 }
            };
            this.updateTickerPrices(demoData);
            this.updatePriceList(demoData);
        }
    }

    updateTickerPrices(prices) {
        if (prices.bitcoin) {
            document.getElementById('btc-price').textContent = `$${prices.bitcoin.usd.toLocaleString()}`;
            document.getElementById('btc-change').textContent = `${prices.bitcoin.usd_24h_change >= 0 ? '+' : ''}${prices.bitcoin.usd_24h_change.toFixed(2)}%`;
            document.getElementById('btc-change').className = `change ${prices.bitcoin.usd_24h_change >= 0 ? 'positive' : 'negative'}`;
        }
        
        if (prices.ethereum) {
            document.getElementById('eth-price').textContent = `$${prices.ethereum.usd.toLocaleString()}`;
            document.getElementById('eth-change').textContent = `${prices.ethereum.usd_24h_change >= 0 ? '+' : ''}${prices.ethereum.usd_24h_change.toFixed(2)}%`;
            document.getElementById('eth-change').className = `change ${prices.ethereum.usd_24h_change >= 0 ? 'positive' : 'negative'}`;
        }
    }

    updatePriceList(prices) {
        const priceList = document.getElementById('priceList');
        let html = '';
        
        Object.entries(prices).forEach(([symbol, data]) => {
            const changeClass = data.usd_24h_change >= 0 ? 'positive' : 'negative';
            const changeSign = data.usd_24h_change >= 0 ? '+' : '';
            
            html += `
                <div class="price-item">
                    <div>
                        <span class="symbol">${symbol.toUpperCase()}</span>
                    </div>
                    <div style="text-align: right;">
                        <div class="price">$${data.usd.toLocaleString()}</div>
                        <div class="change ${changeClass}">${changeSign}${data.usd_24h_change.toFixed(2)}%</div>
                    </div>
                </div>
            `;
        });
        
        priceList.innerHTML = html;
    }

    async loadPortfolioOverview() {
        try {
            // Mock portfolio data for demo
            const totalValue = 12450.00;
            const profitLoss = 1250.00;
            const profitPercent = 11.2;
            
            document.getElementById('totalValue').textContent = `$${totalValue.toLocaleString()}`;
            document.getElementById('portfolioChange').textContent = `+$${profitLoss.toLocaleString()} (+${profitPercent}%)`;
            document.getElementById('portfolioChange').className = 'change positive';
        } catch (error) {
            console.error('Failed to load portfolio:', error);
        }
    }

    async loadMarketAnalysis() {
        try {
            const response = await fetch(`${this.apiBase}/market-analysis/ethereum`);
            const data = await response.json();
            
            if (data.sentiment) {
                document.getElementById('marketSentiment').textContent = data.sentiment.charAt(0).toUpperCase() + data.sentiment.slice(1);
                document.getElementById('marketSentiment').className = `sentiment ${data.sentiment === 'positive' ? 'bullish' : data.sentiment === 'negative' ? 'bearish' : 'neutral'}`;
            }
            
            if (data.recommendation) {
                document.getElementById('aiRecommendation').textContent = `${data.recommendation.action.toUpperCase()} signal: ${data.recommendation.reason}`;
            }
        } catch (error) {
            console.error('Failed to load market analysis:', error);
        }
    }

    async executeStrategy(strategyName) {
        try {
            const response = await fetch(`${this.apiBase}/execute-strategy`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ strategy: strategyName, asset: 'ethereum' })
            });
            
            const result = await response.json();
            this.showStrategyResults(strategyName, result);
        } catch (error) {
            console.error('Strategy execution failed:', error);
            this.showNotification('Strategy execution failed', 'error');
        }
    }

    showStrategyResults(strategyName, result) {
        const resultsDiv = document.getElementById('strategyResults');
        const contentDiv = document.getElementById('resultsContent');
        
        let html = `
            <div class="strategy-result">
                <h4>${strategyName.replace('_', ' ').toUpperCase()} Strategy Results</h4>
                <div class="result-grid">
                    <div class="result-item">
                        <span class="label">Action:</span>
                        <span class="value ${result.action}">${result.action?.toUpperCase() || 'N/A'}</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Confidence:</span>
                        <span class="value">${result.confidence ? (result.confidence * 100).toFixed(1) + '%' : 'N/A'}</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Reason:</span>
                        <span class="value">${result.reason || 'No reason provided'}</span>
                    </div>
        `;
        
        if (result.predictedPrice) {
            html += `
                <div class="result-item">
                    <span class="label">Predicted Price:</span>
                    <span class="value">$${result.predictedPrice.toLocaleString()}</span>
                </div>
            `;
        }
        
        html += `
                </div>
            </div>
        `;
        
        contentDiv.innerHTML = html;
        resultsDiv.style.display = 'block';
        
        // Add CSS for result styling
        const style = document.createElement('style');
        style.textContent = `
            .strategy-result h4 {
                color: var(--primary-color);
                margin-bottom: 20px;
                font-size: 18px;
            }
            .result-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
            }
            .result-item {
                display: flex;
                justify-content: space-between;
                padding: 10px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
            }
            .result-item .label {
                color: var(--text-muted);
            }
            .result-item .value {
                font-weight: bold;
            }
            .result-item .value.buy {
                color: var(--accent-color);
            }
            .result-item .value.sell {
                color: var(--secondary-color);
            }
            .result-item .value.hold {
                color: #ffa502;
            }
        `;
        document.head.appendChild(style);
    }

    showVoiceModal() {
        document.getElementById('voiceModal').classList.add('active');
    }

    closeVoiceModal() {
        document.getElementById('voiceModal').classList.remove('active');
        if (this.isListening) {
            this.recognition.stop();
        }
    }

    toggleVoiceRecognition() {
        if (!this.recognition) {
            this.showNotification('Speech recognition not supported', 'error');
            return;
        }

        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }

    async processVoiceCommand(command) {
        try {
            document.getElementById('voiceStatus').textContent = `Processing: "${command}"`;
            
            const response = await fetch(`${this.apiBase}/voice-command`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command })
            });
            
            const result = await response.json();
            
            const resultDiv = document.getElementById('voiceResult');
            resultDiv.style.display = 'block';
            
            if (result.error) {
                resultDiv.innerHTML = `<div style="color: var(--secondary-color);">❌ ${result.error}</div>`;
            } else {
                resultDiv.innerHTML = `<div style="color: var(--accent-color);">✅ ${result.response}</div>`;
                // Refresh data after successful command
                this.loadInitialData();
            }
        } catch (error) {
            console.error('Voice command failed:', error);
            document.getElementById('voiceResult').innerHTML = `<div style="color: var(--secondary-color);">❌ Network error</div>`;
        }
    }

    async loadPortfolioData() {
        const portfolioContent = document.getElementById('portfolioContent');
        portfolioContent.innerHTML = `
            <div class="portfolio-overview">
                <h3>Portfolio Holdings</h3>
                <div class="holdings-grid">
                    <div class="holding-item">
                        <div class="crypto-info">
                            <span class="crypto-name">Ethereum</span>
                            <span class="crypto-symbol">ETH</span>
                        </div>
                        <div class="holding-amount">
                            <span class="amount">3.556 ETH</span>
                            <span class="value">$12,446</span>
                        </div>
                    </div>
                    <div class="holding-item">
                        <div class="crypto-info">
                            <span class="crypto-name">Bitcoin</span>
                            <span class="crypto-symbol">BTC</span>
                        </div>
                        <div class="holding-amount">
                            <span class="amount">0.191 BTC</span>
                            <span class="value">$12,415</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async loadAnalyticsData() {
        const analyticsContent = document.getElementById('analyticsContent');
        analyticsContent.innerHTML = `
            <div class="analytics-overview">
                <h3>AI Performance Metrics</h3>
                <div class="metrics-grid">
                    <div class="metric-card">
                        <h4>Success Rate</h4>
                        <div class="metric-value">82.5%</div>
                        <div class="metric-change positive">+2.1%</div>
                    </div>
                    <div class="metric-card">
                        <h4>Total Profit</h4>
                        <div class="metric-value">$3,247</div>
                        <div class="metric-change positive">+15.2%</div>
                    </div>
                    <div class="metric-card">
                        <h4>Trades Executed</h4>
                        <div class="metric-value">127</div>
                        <div class="metric-change positive">+8</div>
                    </div>
                </div>
            </div>
        `;
    }

    startDataRefresh() {
        // Refresh prices every 30 seconds
        setInterval(() => {
            this.loadPrices();
        }, 30000);
        
        // Refresh portfolio every 60 seconds
        setInterval(() => {
            this.loadPortfolioOverview();
        }, 60000);
    }

    showNotification(message, type = 'info') {
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
            background: ${type === 'success' ? 'var(--accent-color)' : type === 'error' ? 'var(--secondary-color)' : 'var(--primary-color)'};
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Global functions for HTML onclick events
function executeStrategy(strategyName) {
    window.tradingPlatform.executeStrategy(strategyName);
}

function quickAction(action) {
    // Open real buy/sell interface
    window.open(`buy-sell-interface.html?action=${action}`, '_blank', 'width=1000,height=700');
}

function executeAIStrategy() {
    // Open strategy interface with AI prediction pre-selected
    window.open('strategy-interface.html?strategy=ai_prediction', '_blank', 'width=1200,height=800');
}

function closeResults() {
    document.getElementById('strategyResults').style.display = 'none';
}

function closeVoiceModal() {
    window.tradingPlatform.closeVoiceModal();
}

function startKYC() {
    window.tradingPlatform.showNotification('KYC process will be implemented soon!', 'info');
}

function openManualTradingInterface() {
    window.tradingPlatform.showNotification('Manual trading interface activated!', 'success');
    window.tradingPlatform.switchTab('manual');
}

function executeManualTrade(action) {
    const asset = document.getElementById('tradeAsset').value;
    const amount = document.getElementById('tradeAmount').value;
    
    if (!amount || amount <= 0) {
        window.tradingPlatform.showNotification('Please enter a valid amount', 'error');
        return;
    }
    
    // Open buy/sell interface with pre-filled data
    const url = `buy-sell-interface.html?action=${action}&asset=${asset}&amount=${amount}`;
    window.open(url, '_blank', 'width=1000,height=700');
}

function setOrderType(type) {
    window.tradingPlatform.showNotification(`${type.toUpperCase()} order type selected`, 'info');
}

// Wallet functions
function openDepositInterface() {
    window.open('deposit-withdraw.html#deposit', '_blank', 'width=1200,height=900');
}

function openWithdrawInterface() {
    window.open('deposit-withdraw.html#withdraw', '_blank', 'width=1200,height=900');
}

// Voice command functions
function startVoiceRecognition() {
    if (window.tradingPlatform) {
        window.tradingPlatform.toggleVoiceRecognition();
    } else {
        window.platform.showNotification('Voice recognition activated - Click microphone to start', 'success');
    }
}

function showVoiceCommands() {
    const commands = [
        '"Buy 1 ethereum" - Purchase cryptocurrency',
        '"Sell 0.5 bitcoin" - Sell cryptocurrency', 
        '"Analyze market" - Get market analysis',
        '"Show portfolio" - View portfolio balance',
        '"Execute momentum strategy" - Run AI strategy'
    ];
    const message = 'Voice Commands:\n' + commands.join('\n');
    if (window.tradingPlatform) {
        window.tradingPlatform.showNotification(message, 'info');
    } else {
        window.platform.showNotification(message, 'info');
    }
}

function testVoiceCommand(command) {
    if (window.tradingPlatform) {
        window.tradingPlatform.processVoiceCommand(command);
    } else {
        window.platform.showNotification(`Testing voice command: "${command}"`, 'info');
    }
}

// Initialize trading platform when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.tradingPlatform = new TradingPlatform();
});

// Add slide-in animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);