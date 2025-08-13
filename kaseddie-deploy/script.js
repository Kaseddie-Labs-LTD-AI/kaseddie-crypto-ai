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
        if ('speechSynthesis' in window) {
            this.speechSynthesis = window.speechSynthesis;
            setTimeout(() => {
                this.playWelcomeMessage();
            }, 3000);
        }
    }

    playWelcomeMessage() {
        const welcomeText = `Welcome to Kaseddie AI, the future of cryptocurrency trading! I'm your AI trading assistant. Our platform offers 10 advanced AI trading strategies with up to 95% success rates.`;
        this.speak(welcomeText);
        this.showNotification('🎤 AI Assistant: Welcome! Voice introduction playing...', 'info');
    }

    speak(text) {
        if (this.speechSynthesis) {
            this.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            utterance.volume = 0.8;
            this.speechSynthesis.speak(utterance);
        }
    }

    setupLiveChat() {
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
                        <div class="message-content">👋 Hi! I'm your AI assistant. How can I help you today?</div>
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
            #liveChatWidget { position: fixed; bottom: 20px; right: 20px; z-index: 2000; }
            .chat-button { width: 60px; height: 60px; background: linear-gradient(135deg, #00d4ff, #ff6b35); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4); transition: all 0.3s ease; position: relative; }
            .chat-button:hover { transform: scale(1.1); }
            .chat-button i { color: white; font-size: 24px; }
            .chat-badge { position: absolute; top: -5px; right: -5px; background: #ff6b35; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; }
            .chat-window { display: none; position: absolute; bottom: 70px; right: 0; width: 350px; height: 450px; background: rgba(0, 0, 0, 0.95); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 15px; overflow: hidden; }
            .chat-window.active { display: flex; flex-direction: column; }
            .chat-header { background: linear-gradient(135deg, #00d4ff, #ff6b35); padding: 15px; display: flex; justify-content: space-between; align-items: center; }
            .chat-header h4 { color: white; margin: 0; display: flex; align-items: center; gap: 8px; }
            .chat-header button { background: none; border: none; color: white; font-size: 20px; cursor: pointer; }
            .chat-messages { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
            .message { max-width: 80%; }
            .bot-message { align-self: flex-start; }
            .user-message { align-self: flex-end; }
            .message-content { padding: 10px 15px; border-radius: 15px; color: white; line-height: 1.4; }
            .bot-message .message-content { background: rgba(0, 212, 255, 0.2); border: 1px solid rgba(0, 212, 255, 0.3); }
            .user-message .message-content { background: rgba(255, 107, 53, 0.2); border: 1px solid rgba(255, 107, 53, 0.3); }
            .message-time { font-size: 11px; color: #888; margin-top: 5px; text-align: right; }
            .chat-input { padding: 15px; border-top: 1px solid rgba(255, 255, 255, 0.1); display: flex; gap: 10px; }
            .chat-input input { flex: 1; padding: 10px 15px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 20px; color: white; outline: none; }
            .chat-input button { width: 40px; height: 40px; background: #00d4ff; border: none; border-radius: 50%; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        `;
        document.head.appendChild(chatStyles);
    }

    setupNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });
    }

    setupAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.feature-card, .strategy-card, .platform-card').forEach(el => {
            observer.observe(el);
        });
    }

    async loadLivePrices() {
        try {
            // Use demo data for deployment
            this.updatePriceDisplay({
                bitcoin: { usd: 65420, usd_24h_change: 2.5 },
                ethereum: { usd: 3580, usd_24h_change: 1.8 }
            });
        } catch (error) {
            console.log('Using demo prices');
        }
    }

    updatePriceDisplay(prices) {
        if (prices.bitcoin) {
            const btcPreview = document.getElementById('btc-preview');
            if (btcPreview) {
                btcPreview.textContent = `$${prices.bitcoin.usd.toLocaleString()}`;
            }
        }
    }

    setupEventListeners() {
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

    startPriceUpdates() {
        setInterval(() => {
            this.loadLivePrices();
        }, 30000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; padding: 15px 20px; border-radius: 8px; color: white; font-weight: 500; z-index: 3000; animation: slideIn 0.3s ease-out; max-width: 300px; word-wrap: break-word;
            background: ${type === 'success' ? '#00ff88' : type === 'error' ? '#ff4757' : '#00d4ff'};
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
    }
}

// Global functions
function testStrategy(strategyName) {
    alert(`${strategyName.toUpperCase()} Strategy: Demo mode - 85% success rate with AI analysis. Contact us for live trading!`);
}

function launchPlatform() {
    alert('Trading Platform: Contact kaseddie@hotmail.com or +256 769089860 for platform access!');
}

function downloadDesktop() {
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('Kaseddie AI Desktop App\nContact: kaseddie@hotmail.com\nPhone: +256 769089860\nWhatsApp: +256 784428821');
    link.download = 'kaseddie-contact.txt';
    link.click();
    window.platform.showNotification('Contact info downloaded!', 'success');
}

function downloadMobile() {
    alert('Mobile App: Contact kaseddie@hotmail.com or WhatsApp +256 784428821 for mobile app access!');
}

function showLogin() {
    alert('Login: Contact kaseddie@hotmail.com for account setup!');
}

function openManualTrading() {
    alert('Manual Trading: Contact +256 769089860 for trading access!');
}

function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

function showLivePrices() {
    window.platform.showNotification('Live Prices: BTC $65,420 (+2.5%), ETH $3,580 (+1.8%)', 'info');
    scrollToSection('home');
}

function showMarketStats() {
    window.platform.showNotification('Market Stats: BTC +2.5%, ETH +1.8%, Total Volume: $2.1B', 'info');
}

function showQuickStart() {
    window.platform.showNotification('Quick Start: Contact kaseddie@hotmail.com to get started!', 'info');
}

function showFeature(featureType) {
    const messages = {
        'ai-strategies': '10 AI Trading Strategies with up to 95% success rates',
        'voice-commands': 'Voice Trading: "Buy 1 ETH", "Analyze Bitcoin"',
        'kyc-security': 'Bank-grade security with KYC compliance',
        'cryptocurrencies': '50+ cryptocurrencies supported',
        'analytics': 'Real-time market analysis with AI insights',
        'multi-platform': 'Web, Desktop, and Mobile platforms'
    };
    window.platform.showNotification(messages[featureType], 'info');
    scrollToSection('features');
}

function launchWebPlatform() {
    alert('Web Platform: Contact kaseddie@hotmail.com for platform access!');
}

function showAPIDocumentation() {
    window.platform.showNotification('API Docs: Contact kaseddie@hotmail.com for API access', 'info');
}

function showContactForm() {
    scrollToSection('contact');
    window.platform.showNotification('Contact form ready - Fill out your details below', 'info');
}

function showLiveChat() {
    toggleLiveChat();
}

function toggleLiveChat() {
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.classList.toggle('active');
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
    
    addChatMessage(message, 'user');
    input.value = '';
    
    setTimeout(() => {
        const response = generateAIResponse(message);
        addChatMessage(response, 'bot');
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
    
    if (message.includes('price') || message.includes('bitcoin') || message.includes('ethereum')) {
        return '📈 Current prices: Bitcoin $65,420 (+2.5%), Ethereum $3,580 (+1.8%). Contact kaseddie@hotmail.com for live trading!';
    }
    
    if (message.includes('strategy') || message.includes('trading')) {
        return '🤖 We offer 10 AI strategies with up to 95% success rates! Contact +256 769089860 for access.';
    }
    
    if (message.includes('contact') || message.includes('help')) {
        return '📞 Contact us: kaseddie@hotmail.com, kaseddie@gmail.com | Phone: +256 769089860 | WhatsApp: +256 784428821';
    }
    
    return '🤖 I can help with trading strategies, prices, and platform info. Contact kaseddie@hotmail.com for full access!';
}

function showSupport() {
    window.platform.showNotification('24/7 Support: kaseddie@hotmail.com, kaseddie@gmail.com | +256 769089860 | WhatsApp: +256 784428821', 'info');
}

function showHelpCenter() {
    window.platform.showNotification('Help: Contact kaseddie@hotmail.com for assistance', 'info');
}

function showLoginModal() {
    alert('Login: Contact kaseddie@hotmail.com for account access!');
}

function showRegisterModal() {
    alert('Register: Contact kaseddie@hotmail.com to create account!');
}

function showKYCModal() {
    alert('KYC: Contact +256 769089860 for verification process!');
}

function showSettings() {
    alert('Settings: Contact kaseddie@hotmail.com for account settings!');
}

function launchVoiceTrading() {
    alert('Voice Trading: Contact +256 769089860 for voice command access!');
}

function launchAIAnalytics() {
    alert('AI Analytics: Contact kaseddie@hotmail.com for analytics dashboard!');
}

function launchPortfolioManager() {
    alert('Portfolio Manager: Contact +256 769089860 for portfolio access!');
}

function openDepositWithdraw() {
    alert('Deposit/Withdraw: Contact kaseddie@hotmail.com for banking integration!');
}

function openInvestorDashboard() {
    alert('Investor Dashboard: Contact kaseddie@hotmail.com for investment opportunities!');
}

// Initialize platform
document.addEventListener('DOMContentLoaded', () => {
    window.platform = new KaseddiePlatform();
});

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    .notification { box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3); }
`;
document.head.appendChild(style);