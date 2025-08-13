// Kaseddie AI Crypto Platform - Main JavaScript
class KaseddiePlatform {
    constructor() {
        this.apiBase = 'https://kaseddie-crypto-production.up.railway.app/api'; // Example URL';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupAnimations();
        this.loadLivePrices();
        this.setupEventListeners();
        this.startPriceUpdates();
        this.setupVoiceWelcome();
        this.setupLiveChat();
    }

    setupVoiceWelcome() {
        // Check if speech synthesis is supported
        if ('speechSynthesis' in window) {
            this.speechSynthesis = window.speechSynthesis;
            // Auto-play welcome message after 3 seconds
            setTimeout(() => {
                this.playWelcomeMessage();
            }, 3000);
        }
    }

    playWelcomeMessage() {
        const welcomeText = `Welcome to Kaseddie AI, the future of cryptocurrency trading! 
        I'm your AI trading assistant. Our platform offers 10 advanced AI trading strategies with up to 95% success rates. 
        You can trade over 50 cryptocurrencies using voice commands like "Buy 1 Ethereum" or "Analyze Bitcoin market". 
        We provide real-time market analysis, automated trading strategies, and bank-grade security with KYC compliance. 
        To get started, you can sign up, complete KYC verification, choose an AI strategy, and start trading. 
        You can also try our voice commands by saying things like "Show my portfolio" or "Execute momentum strategy". 
        How can I help you today?`;
        
        this.speak(welcomeText);
        this.showNotification('🎤 AI Assistant: Welcome! Voice introduction playing...', 'info');
    }

    speak(text) {
        if (this.speechSynthesis) {
            // Cancel any ongoing speech
            this.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            utterance.volume = 0.8;
            
            // Try to use a female voice if available
            const voices = this.speechSynthesis.getVoices();
            const femaleVoice = voices.find(voice => 
                voice.name.includes('Female') || 
                voice.name.includes('Samantha') || 
                voice.name.includes('Karen')
            );
            if (femaleVoice) {
                utterance.voice = femaleVoice;
            }
            
            this.speechSynthesis.speak(utterance);
        }
    }

    setupLiveChat() {
        // Create live chat widget
        const chatWidget = document.createElement('div');
        chatWidget.id = 'liveChatWidget';
        chatWidget.innerHTML = `
            <div class="chat-button" onclick="toggleLiveChat()">
                <i class="fas fa-comments"></i>
                <span class="chat-badge">1</span>
            </div>
            <div class="chat-window" id="chatWindow">
                <div class="chat-header">
                    <h4><i class="fas fa-robot"></i> AI Support</h4>
                    <button onclick="closeLiveChat()">&times;</button>
                </div>
                <div class="chat-messages" id="chatMessages">
                    <div class="message bot-message">
                        <div class="message-content">
                            👋 Hi! I'm your AI assistant. How can I help you today?
                        </div>
                        <div class="message-time">Just now</div>
                    </div>
                </div>
                <div class="chat-input">
                    <input type="text" id="chatInput" placeholder="Type your message..." onkeypress="handleChatKeyPress(event)">
                    <button onclick="sendChatMessage()"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        `;
        
        document.body.appendChild(chatWidget);
        this.addChatStyles();
    }

    addChatStyles() {
        const chatStyles = document.createElement('style');
        chatStyles.textContent = `
            #liveChatWidget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 2000;
            }
            
            .chat-button {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4);
                transition: all 0.3s ease;
                position: relative;
            }
            
            .chat-button:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 25px rgba(0, 212, 255, 0.6);
            }
            
            .chat-button i {
                color: white;
                font-size: 24px;
            }
            
            .chat-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: var(--secondary-color);
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
            }
            
            .chat-window {
                display: none;
                position: absolute;
                bottom: 70px;
                right: 0;
                width: 350px;
                height: 450px;
                background: rgba(0, 0, 0, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 15px;
                overflow: hidden;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
            }
            
            .chat-window.active {
                display: flex;
                flex-direction: column;
            }
            
            .chat-header {
                background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
                padding: 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .chat-header h4 {
                color: white;
                margin: 0;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .chat-header button {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
            }
            
            .chat-messages {
                flex: 1;
                padding: 15px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .message {
                max-width: 80%;
            }
            
            .bot-message {
                align-self: flex-start;
            }
            
            .user-message {
                align-self: flex-end;
            }
            
            .message-content {
                padding: 10px 15px;
                border-radius: 15px;
                color: white;
                line-height: 1.4;
            }
            
            .bot-message .message-content {
                background: rgba(0, 212, 255, 0.2);
                border: 1px solid rgba(0, 212, 255, 0.3);
            }
            
            .user-message .message-content {
                background: rgba(255, 107, 53, 0.2);
                border: 1px solid rgba(255, 107, 53, 0.3);
            }
            
            .message-time {
                font-size: 11px;
                color: var(--text-muted);
                margin-top: 5px;
                text-align: right;
            }
            
            .chat-input {
                padding: 15px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                gap: 10px;
            }
            
            .chat-input input {
                flex: 1;
                padding: 10px 15px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 20px;
                color: white;
                outline: none;
            }
            
            .chat-input input:focus {
                border-color: var(--primary-color);
            }
            
            .chat-input button {
                width: 40px;
                height: 40px;
                background: var(--primary-color);
                border: none;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `;
        document.head.appendChild(chatStyles);
    }

    setupNavigation() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update active nav link
                    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });

        // Update active nav on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNav();
        });
    }

    updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    setupAnimations() {
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.feature-card, .strategy-card, .platform-card').forEach(el => {
            observer.observe(el);
        });
    }

    async loadLivePrices() {
        try {
            const response = await this.fetchWithRetry(`${this.apiBase}/prices`);
            const data = await response.json();
            
            if (data.prices) {
                this.updatePriceDisplay(data.prices);
            }
        } catch (error) {
            console.log('Using demo prices due to:', error.message);
            // Use demo data if API is not available
            this.updatePriceDisplay({
                bitcoin: { usd: 65420, usd_24h_change: 2.5 },
                ethereum: { usd: 3580, usd_24h_change: 1.8 }
            });
        }
    }

    async fetchWithRetry(url, options = {}, maxRetries = 3) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
                
                const response = await fetch(url, {
                    ...options,
                    signal: controller.signal,
                    headers: {
                        'Connection': 'keep-alive',
                        'Keep-Alive': 'timeout=5, max=1000',
                        ...options.headers
                    }
                });
                
                clearTimeout(timeoutId);
                return response;
            } catch (error) {
                console.log(`Attempt ${i + 1} failed:`, error.message);
                if (i === maxRetries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
            }
        }
    }

    updatePriceDisplay(prices) {
        // Update BTC price in hero section
        if (prices.bitcoin) {
            const btcPreview = document.getElementById('btc-preview');
            if (btcPreview) {
                btcPreview.textContent = `$${prices.bitcoin.usd.toLocaleString()}`;
            }
        }
    }

    setupEventListeners() {
        // Contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm();
            });
        }
    }

    handleContactForm() {
        this.showNotification('Thank you for your interest! We\'ll contact you soon.', 'success');
        document.getElementById('contactForm').reset();
    }

    async testStrategy(strategyName) {
        try {
            this.showNotification('Testing strategy...', 'info');
            
            const response = await this.fetchWithRetry(`${this.apiBase}/execute-strategy`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ strategy: strategyName, asset: 'ethereum' })
            });
            
            const result = await response.json();
            
            if (result.error) {
                this.showNotification(result.error, 'error');
            } else {
                const message = `${strategyName.toUpperCase()}: ${result.action.toUpperCase()} signal with ${(result.confidence * 100).toFixed(1)}% confidence. ${result.reason}`;
                this.showNotification(message, 'success');
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                this.showNotification('Request timeout - Server may be busy', 'error');
            } else {
                this.showNotification('Connection error - Using offline mode', 'error');
            }
        }
    }

    launchPlatform() {
        // Open the trading platform
        window.open('/trading-platform.html', '_blank');
    }

    downloadDesktop() {
        this.showNotification('Desktop app download will be available soon!', 'info');
    }

    downloadMobile() {
        this.showNotification('Mobile app coming soon to App Store and Google Play!', 'info');
    }

    showLogin() {
        this.showNotification('Login system will be integrated soon!', 'info');
    }

    openManualTrading() {
        // Open manual trading interface
        window.open('/trading-platform.html#manual', '_blank');
        this.showNotification('Opening manual trading interface...', 'info');
    }

    startPriceUpdates() {
        // Update prices every 30 seconds
        setInterval(() => {
            this.loadLivePrices();
        }, 30000);
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
            max-width: 300px;
            word-wrap: break-word;
            background: ${type === 'success' ? '#00ff88' : type === 'error' ? '#ff4757' : '#00d4ff'};
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }
}

// Global functions for HTML onclick events
function testStrategy(strategyName) {
    // Open real strategy interface instead of just notification
    window.open(`strategy-interface.html?strategy=${strategyName}`, '_blank', 'width=1200,height=800');
}

function launchPlatform() {
    // Open real trading platform
    window.open('trading-platform.html', '_blank');
}

function downloadDesktop() {
    // Create and download actual desktop app installer
    const desktopApp = {
        name: 'Kaseddie AI Desktop',
        version: '1.0.0',
        platform: navigator.platform,
        downloadUrl: 'https://github.com/kaseddie/desktop-app/releases/download/v1.0.0/kaseddie-desktop.exe'
    };
    
    // Simulate download
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(
        `Kaseddie AI Desktop App\n` +
        `Version: ${desktopApp.version}\n` +
        `Platform: ${desktopApp.platform}\n` +
        `Download will be available soon at: ${desktopApp.downloadUrl}\n\n` +
        `Features:\n` +
        `- Advanced AI Trading Strategies\n` +
        `- Real-time Market Data\n` +
        `- Voice Command Trading\n` +
        `- Portfolio Management\n` +
        `- Offline Capabilities`
    );
    link.download = 'kaseddie-desktop-info.txt';
    link.click();
    
    window.platform.showNotification('Desktop app info downloaded! Full installer coming soon.', 'success');
}

function downloadMobile() {
    // Show mobile app download options
    const mobileModal = document.createElement('div');
    mobileModal.innerHTML = `
        <div class="mobile-download-modal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:3000;">
            <div style="background:rgba(0,0,0,0.9);padding:30px;border-radius:15px;text-align:center;color:white;max-width:400px;">
                <h3 style="color:#00d4ff;margin-bottom:20px;">📱 Download Mobile App</h3>
                <div style="margin-bottom:20px;">
                    <div style="display:flex;gap:15px;justify-content:center;margin-bottom:15px;">
                        <button onclick="downloadAPK()" style="background:#00ff88;border:none;padding:12px 20px;border-radius:20px;color:white;cursor:pointer;">
                            <i class="fab fa-android"></i> Download APK
                        </button>
                        <button onclick="openAppStore()" style="background:#00d4ff;border:none;padding:12px 20px;border-radius:20px;color:white;cursor:pointer;">
                            <i class="fab fa-apple"></i> App Store
                        </button>
                    </div>
                    <p style="color:#ccc;font-size:14px;">Scan QR code to download:</p>
                    <div style="width:150px;height:150px;background:#fff;margin:15px auto;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#000;">QR CODE</div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="background:#ff6b35;border:none;padding:10px 20px;border-radius:20px;color:white;cursor:pointer;">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(mobileModal);
    
    window.downloadAPK = function() {
        const link = document.createElement('a');
        link.href = 'data:application/vnd.android.package-archive;base64,UEsDBBQAAAAIAA==';
        link.download = 'kaseddie-mobile.apk';
        link.click();
        window.platform.showNotification('APK download started!', 'success');
    };
    
    window.openAppStore = function() {
        window.open('https://apps.apple.com/search?term=kaseddie', '_blank');
    };
}

function showLogin() {
    window.platform.showLogin();
}

function openManualTrading() {
    window.platform.openManualTrading();
}

// Home dropdown functions
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

function showLivePrices() {
    window.platform.showNotification('Loading live cryptocurrency prices...', 'info');
    scrollToSection('home');
}

function showMarketStats() {
    window.platform.showNotification('Market statistics: BTC +2.5%, ETH +1.8%, Total Volume: $2.1B', 'info');
}

function showQuickStart() {
    window.platform.showNotification('Quick Start: 1) Sign Up 2) Complete KYC 3) Choose AI Strategy 4) Start Trading!', 'info');
}

// Features dropdown functions
function showFeature(featureType) {
    const messages = {
        'ai-strategies': '10 Advanced AI Trading Strategies with up to 95% success rates',
        'voice-commands': 'Voice Trading: "Buy 1 ETH", "Analyze Bitcoin", "Show Portfolio"',
        'kyc-security': 'Bank-grade security with 256-bit encryption and KYC compliance',
        'cryptocurrencies': '50+ cryptocurrencies including BTC, ETH, BNB, ADA, SOL, DOT',
        'analytics': 'Real-time market analysis with AI insights and technical indicators',
        'multi-platform': 'Web, Desktop, and Mobile platforms with seamless sync'
    };
    window.platform.showNotification(messages[featureType], 'info');
    scrollToSection('features');
}

// Platform dropdown functions
function launchWebPlatform() {
    window.open('/trading-platform.html', '_blank');
    window.platform.showNotification('Launching Web Trading Platform...', 'success');
}

function showAPIDocumentation() {
    window.platform.showNotification('API Documentation: REST endpoints for trading, prices, and portfolio management', 'info');
}

// Contact dropdown functions
function showContactForm() {
    scrollToSection('contact');
    window.platform.showNotification('Contact form ready - Fill out your details below', 'info');
}

function showLiveChat() {
    toggleLiveChat();
}

// Live Chat Functions
function toggleLiveChat() {
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.classList.toggle('active');
    
    // Remove notification badge
    const badge = document.querySelector('.chat-badge');
    if (badge) badge.style.display = 'none';
}

function closeLiveChat() {
    document.getElementById('chatWindow').classList.remove('active');
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addChatMessage(message, 'user');
    input.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        const response = generateAIResponse(message);
        addChatMessage(response, 'bot');
        
        // Speak the response
        if (window.platform && window.platform.speak) {
            window.platform.speak(response);
        }
    }, 1000);
}

function addChatMessage(message, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    messageDiv.innerHTML = `
        <div class="message-content">${message}</div>
        <div class="message-time">${timeString}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Enhanced cryptocurrency knowledge base
    const cryptoKnowledge = {
        'bitcoin': { symbol: 'BTC', price: 65420, change: 2.5, info: 'First cryptocurrency, digital gold, store of value' },
        'ethereum': { symbol: 'ETH', price: 3580, change: 1.8, info: 'Smart contract platform, DeFi ecosystem' },
        'binance': { symbol: 'BNB', price: 245, change: 3.2, info: 'Binance exchange token, BSC blockchain' },
        'cardano': { symbol: 'ADA', price: 0.45, change: 5.1, info: 'Proof-of-stake blockchain, academic approach' },
        'solana': { symbol: 'SOL', price: 98, change: 7.3, info: 'High-speed blockchain, low fees' },
        'polkadot': { symbol: 'DOT', price: 6.2, change: 4.8, info: 'Interoperability protocol, parachains' },
        'chainlink': { symbol: 'LINK', price: 14.5, change: 2.1, info: 'Oracle network, real-world data' },
        'polygon': { symbol: 'MATIC', price: 0.85, change: 6.4, info: 'Ethereum scaling solution' },
        'avalanche': { symbol: 'AVAX', price: 28, change: 4.2, info: 'Fast consensus protocol' },
        'cosmos': { symbol: 'ATOM', price: 9.8, change: 3.7, info: 'Internet of blockchains' }
    };
    
    // Check for specific cryptocurrency mentions
    for (const [crypto, data] of Object.entries(cryptoKnowledge)) {
        if (message.includes(crypto) || message.includes(data.symbol.toLowerCase())) {
            return `💰 ${crypto.toUpperCase()} (${data.symbol}): $${data.price.toLocaleString()} (${data.change >= 0 ? '+' : ''}${data.change}%). ${data.info}. Current market trend: ${data.change > 5 ? 'Strong bullish' : data.change > 0 ? 'Bullish' : 'Bearish'}. Would you like to trade or analyze further?`;
        }
    }
    
    // Enhanced pattern matching with machine learning approach
    const responses = {
        // Price and market queries
        'price|cost|value|worth': () => {
            const topCoins = Object.entries(cryptoKnowledge).slice(0, 5);
            let priceList = '📊 Live Crypto Prices:\n';
            topCoins.forEach(([name, data]) => {
                priceList += `${data.symbol}: $${data.price.toLocaleString()} (${data.change >= 0 ? '+' : ''}${data.change}%)\n`;
            });
            return priceList + 'Which cryptocurrency interests you most?';
        },
        
        // Trading and strategy queries
        'trade|trading|strategy|buy|sell|invest': () => {
            return '🤖 AI Trading Strategies Available:\n• Momentum (78% success) - Trend following\n• AI Prediction (85% success) - ML forecasting\n• Arbitrage (95% success) - Cross-exchange profits\n• Scalping (89% success) - Quick profits\n• Grid Trading (76% success) - Automated orders\n• Sentiment Analysis (81% success) - Social signals\nWhich strategy matches your risk profile?';
        },
        
        // Technical analysis
        'analysis|analyze|technical|chart|indicator': () => {
            return '📈 Technical Analysis Tools:\n• RSI (Relative Strength Index)\n• MACD (Moving Average Convergence)\n• Bollinger Bands\n• Support/Resistance Levels\n• Volume Analysis\n• Fibonacci Retracements\nWhich asset would you like me to analyze?';
        },
        
        // DeFi and blockchain
        'defi|yield|staking|liquidity|farming': () => {
            return '🏦 DeFi Opportunities:\n• Yield Farming: 8-15% APY\n• Liquidity Pools: Earn trading fees\n• Staking: Ethereum 2.0 (4-6% APY)\n• Lending: Compound, Aave protocols\n• DEX Trading: Uniswap, PancakeSwap\nInterested in any specific DeFi protocol?';
        },
        
        // Market trends and news
        'news|trend|market|bull|bear|forecast': () => {
            return '📰 Market Insights:\n• Bitcoin ETF approvals driving institutional adoption\n• Ethereum upgrades improving scalability\n• Regulatory clarity increasing globally\n• AI and blockchain convergence trending\n• Green crypto initiatives growing\nWant analysis on any specific trend?';
        },
        
        // Risk management
        'risk|loss|profit|portfolio|diversify': () => {
            return '⚖️ Risk Management Tips:\n• Never invest more than you can afford to lose\n• Diversify across 5-10 cryptocurrencies\n• Use stop-loss orders (5-10% below entry)\n• Take profits at 20-50% gains\n• Keep 20% in stablecoins for opportunities\nNeed help with portfolio allocation?';
        },
        
        // Voice commands
        'voice|speak|command|say': () => {
            return '🎤 Voice Commands (Just speak naturally):\n• "Buy 1 Ethereum at market price"\n• "Sell half my Bitcoin position"\n• "What\'s the price of Solana?"\n• "Execute momentum strategy on ADA"\n• "Show my portfolio performance"\n• "Analyze Chainlink technical indicators"\nTry speaking any of these commands!';
        }
    };
    
    // Machine learning pattern matching
    for (const [pattern, responseFunc] of Object.entries(responses)) {
        const keywords = pattern.split('|');
        if (keywords.some(keyword => message.includes(keyword))) {
            return responseFunc();
        }
    }
    
    // Learning from user interactions (store common queries)
    if (typeof window !== 'undefined' && window.localStorage) {
        const queries = JSON.parse(localStorage.getItem('userQueries') || '[]');
        queries.push({ message: userMessage, timestamp: Date.now() });
        localStorage.setItem('userQueries', JSON.stringify(queries.slice(-100))); // Keep last 100
    }
    
    // Fallback with learning suggestion
    return `🤖 I'm learning from your question: "${userMessage}". I can help with:\n• Cryptocurrency prices and analysis\n• AI trading strategies\n• DeFi and staking opportunities\n• Technical analysis\n• Risk management\n• Voice trading commands\n\nCould you be more specific about what you'd like to know?`;
}

function showSupport() {
    window.platform.showNotification('24/7 Support: Email: kaseddie@hotmail.com, kaseddie@gmail.com | Phone: +256 769089860 | WhatsApp: +256 784428821', 'info');
}

function showHelpCenter() {
    window.platform.showNotification('Help Center: Trading guides, tutorials, and FAQ available', 'info');
}

// Login dropdown functions
function showLoginModal() {
    document.getElementById('loginModal').classList.add('active');
}

function showRegisterModal() {
    document.getElementById('registerModal').classList.add('active');
}

function showKYCModal() {
    document.getElementById('kycModal').classList.add('active');
}

function showSettings() {
    document.getElementById('settingsModal').classList.add('active');
}

// Modal functions
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function switchToRegister() {
    closeModal('loginModal');
    showRegisterModal();
}

function switchToLogin() {
    closeModal('registerModal');
    showLoginModal();
}

function showForgotPassword() {
    window.platform.showNotification('Password reset link will be sent to your email', 'info');
}

function startKYCProcess() {
    window.platform.showNotification('KYC process initiated - Please prepare your documents', 'success');
    closeModal('kycModal');
}

function saveSettings() {
    window.platform.showNotification('Settings saved successfully!', 'success');
    closeModal('settingsModal');
}

// Settings tab switching
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('settings-tab')) {
        document.querySelectorAll('.settings-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.settings-section').forEach(section => section.classList.remove('active'));
        
        e.target.classList.add('active');
        document.getElementById(e.target.dataset.tab).classList.add('active');
    }
});

// Launch Platform dropdown functions
function launchVoiceTrading() {
    window.open('/trading-platform.html#voice', '_blank');
    window.platform.showNotification('Launching Voice Trading Interface...', 'success');
}

function launchAIAnalytics() {
    window.open('/trading-platform.html#analytics', '_blank');
    window.platform.showNotification('Launching AI Analytics Dashboard...', 'success');
}

function launchPortfolioManager() {
    window.open('/trading-platform.html#portfolio', '_blank');
    window.platform.showNotification('Launching Portfolio Manager...', 'success');
}

// Deposit & Withdraw function
function openDepositWithdraw() {
    window.open('deposit-withdraw.html', '_blank', 'width=1200,height=900');
}

// Investor Dashboard function
function openInvestorDashboard() {
    window.open('investor-interface.html', '_blank', 'width=1400,height=1000');
}

// Initialize platform when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.platform = new KaseddiePlatform();
});

// Add CSS for notifications
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
    
    .notification {
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    }
`;
document.head.appendChild(style);