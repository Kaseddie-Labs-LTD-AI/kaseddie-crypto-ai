// Professional Kaseddie AI Video Presentation
class KaseddiePresentation {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 11;
        this.isPlaying = true;
        this.speechSynthesis = window.speechSynthesis;
        this.currentUtterance = null;
        
        this.slideContent = [
            {
                title: "Welcome to Kaseddie AI",
                narration: "Welcome to Kaseddie AI, the future of intelligent cryptocurrency trading. I'm your AI assistant, and today I'll show you how we're revolutionizing investment strategies for professional traders.",
                duration: 8000
            },
            {
                title: "Professional Trading Platform", 
                narration: "Kaseddie AI is a professional-grade cryptocurrency trading platform that combines advanced artificial intelligence with institutional-quality security for serious investors.",
                duration: 8000
            },
            {
                title: "AI Trading Strategies",
                narration: "Our platform offers 10 sophisticated AI trading strategies. AI Prediction achieves 62% accuracy. Cross-Exchange Arbitrage delivers 68% success rates. Social Sentiment Analysis and AI Scalping complete our comprehensive suite.",
                duration: 10000
            },
            {
                title: "Voice Command Trading",
                narration: "Experience revolutionary voice-controlled trading. Simply say 'Buy 1 Ethereum' or 'Analyze Bitcoin market' and watch our AI execute your commands instantly.",
                duration: 8000
            },
            {
                title: "Mobile-Optimized Platform",
                narration: "Perfect mobile experience with smooth scrolling, touch-optimized controls, and responsive design that fits any screen size.",
                duration: 8000
            },
            {
                title: "Security & Features",
                narration: "Your security is paramount. We employ bank-grade 256-bit encryption, multi-factor authentication, and complete KYC compliance across all platforms.",
                duration: 8000
            },
            {
                title: "Performance Projections",
                narration: "Our projections: Target 68% success rates, expected 5K+ users in first year, designed for mobile-first trading experience with perfect scrolling.",
                duration: 8000
            },
            {
                title: "Getting Started",
                narration: "Getting started is simple: Sign up, complete KYC verification, choose your AI strategy, and start trading. Kaseddie AI adapts to your experience level.",
                duration: 8000
            },
            {
                title: "Investor Dashboard",
                narration: "Our investor dashboard provides transparent access to development progress, financial projections, and investment opportunities. See real-time updates on our journey to 10K+ users.",
                duration: 8000
            },
            {
                title: "Investment Opportunity",
                narration: "We're an honest new project seeking early investors. Starting from $1,000 seed investments up to $50,000 strategic partnerships. Total funding goal: $500,000 to launch our MVP.",
                duration: 8000
            },
            {
                title: "Thank You",
                narration: "Thank you for your time. Kaseddie AI - where cutting-edge artificial intelligence meets professional cryptocurrency trading. Welcome to the future of intelligent investing.",
                duration: 8000
            }
        ];
        
        this.init();
    }
    
    init() {
        this.setupDots();
        this.setupEventListeners();
        this.setupVoice();
        
        // Start presentation after a brief delay
        setTimeout(() => {
            this.startPresentation();
        }, 1000);
    }
    
    setupDots() {
        const dotsContainer = document.getElementById('slide-dots');
        dotsContainer.innerHTML = '';
        
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.onclick = () => this.goToSlide(i);
            dotsContainer.appendChild(dot);
        }
    }
    
    setupEventListeners() {
        // Navigation arrows
        document.querySelector('.arrow-left').onclick = () => this.previousSlide();
        document.querySelector('.arrow-right').onclick = () => this.nextSlide();
        
        // Autoplay toggle
        document.getElementById('autoplay-toggle').onclick = () => this.toggleAutoplay();
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
            if (e.key === ' ') this.toggleAutoplay();
        });
    }
    
    setupVoice() {
        // Wait for voices to load
        if (this.speechSynthesis.getVoices().length === 0) {
            this.speechSynthesis.onvoiceschanged = () => {
                console.log('Voices loaded:', this.speechSynthesis.getVoices().length);
            };
        }
    }
    
    async speak(text) {
        return new Promise((resolve) => {
            if (!this.speechSynthesis) {
                resolve();
                return;
            }
            
            this.speechSynthesis.cancel();
            
            this.currentUtterance = new SpeechSynthesisUtterance(text);
            this.currentUtterance.rate = 0.9;
            this.currentUtterance.pitch = 1.0;
            this.currentUtterance.volume = 1.0;
            
            // Find best female voice
            const voices = this.speechSynthesis.getVoices();
            const femaleVoice = voices.find(v => 
                v.name.includes('Zira') || 
                v.name.includes('Female') ||
                v.name.includes('Samantha') ||
                v.name.includes('Karen')
            ) || voices.find(v => v.lang.startsWith('en-')) || voices[0];
            
            if (femaleVoice) {
                this.currentUtterance.voice = femaleVoice;
                console.log('Using voice:', femaleVoice.name);
            }
            
            this.currentUtterance.onend = resolve;
            this.currentUtterance.onerror = resolve;
            
            this.speechSynthesis.speak(this.currentUtterance);
        });
    }
    
    async startPresentation() {
        console.log('Starting presentation');
        this.showSlide(0);
        await this.playSlide(0);
    }
    
    async playSlide(slideIndex) {
        if (!this.isPlaying || slideIndex >= this.totalSlides) return;
        
        console.log('Playing slide:', slideIndex);
        
        const slideData = this.slideContent[slideIndex];
        
        // Start voice narration
        const voicePromise = this.speak(slideData.narration);
        
        // Handle special slide animations
        this.handleSlideAnimations(slideIndex);
        
        // Wait for voice to complete
        await voicePromise;
        
        // Wait additional time if needed
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Auto-advance to next slide
        if (this.isPlaying && slideIndex < this.totalSlides - 1) {
            this.nextSlide();
        }
    }
    
    handleSlideAnimations(slideIndex) {
        switch(slideIndex) {
            case 2: // AI Strategies
                setTimeout(() => this.highlightStrategy('ai_prediction'), 2000);
                setTimeout(() => this.highlightStrategy('arbitrage'), 4000);
                setTimeout(() => this.highlightStrategy('sentiment_analysis'), 6000);
                setTimeout(() => this.highlightStrategy('scalping'), 8000);
                break;
                
            case 3: // Voice Commands
                setTimeout(() => this.showVoiceDemo(), 2000);
                break;
                
            case 5: // Security Features
                setTimeout(() => this.animateSecurityFeatures(), 2000);
                break;
                
            case 6: // Performance Stats
                setTimeout(() => this.animateStats(), 2000);
                break;
                
            case 7: // Getting Started
                setTimeout(() => this.animateSteps(), 2000);
                break;
        }
    }
    
    showSlide(index) {
        // Hide all slides
        document.querySelectorAll('.slide').forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Show current slide
        const currentSlideElement = document.getElementById(`scene-${index}`);
        if (currentSlideElement) {
            currentSlideElement.classList.add('active');
        }
        
        // Update dots
        document.querySelectorAll('.dot').forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        this.currentSlide = index;
    }
    
    goToSlide(index) {
        if (index < 0 || index >= this.totalSlides) return;
        
        this.speechSynthesis.cancel();
        this.showSlide(index);
        
        if (this.isPlaying) {
            this.playSlide(index);
        }
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }
    
    previousSlide() {
        const prevIndex = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
        this.goToSlide(prevIndex);
    }
    
    toggleAutoplay() {
        this.isPlaying = !this.isPlaying;
        
        const button = document.getElementById('autoplay-toggle');
        if (this.isPlaying) {
            button.innerHTML = '<i class="fas fa-pause"></i> Pause';
            this.playSlide(this.currentSlide);
        } else {
            button.innerHTML = '<i class="fas fa-play"></i> Play';
            this.speechSynthesis.cancel();
        }
    }
    
    // Animation helper functions
    highlightStrategy(strategyKey) {
        document.querySelectorAll('.strategy-card').forEach(card => {
            card.classList.remove('highlight');
            if (card.dataset.strategy === strategyKey) {
                card.classList.add('highlight');
            }
        });
    }
    
    async showVoiceDemo() {
        const commandText = document.getElementById('voice-command');
        const commandResponse = document.getElementById('voice-response');
        
        if (commandText && commandResponse) {
            commandText.style.opacity = 1;
            
            setTimeout(() => {
                commandResponse.style.opacity = 1;
            }, 2000);
        }
    }
    
    animateSecurityFeatures() {
        document.querySelectorAll('.security-item').forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animate');
            }, index * 300);
        });
    }
    
    async animateStats() {
        await this.animateStat('stat-success', 68, '%');
        await this.animateStat('stat-users', 5, 'K');
        await this.animateStat('stat-funding', 500, 'K');
    }
    
    animateStat(id, targetValue, suffix = '') {
        return new Promise(resolve => {
            const element = document.getElementById(id);
            const parentItem = element?.closest('.stat-item');
            if (!element || !parentItem) { resolve(); return; }
            
            parentItem.classList.add('animate');
            
            let currentValue = 0;
            const increment = targetValue / 30;
            
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= targetValue) {
                    currentValue = targetValue;
                    clearInterval(timer);
                    resolve();
                }
                
                if (id === 'stat-funding') {
                    element.textContent = `$${Math.round(currentValue)}${suffix}`;
                } else {
                    element.textContent = `${Math.round(currentValue)}${suffix}`;
                }
            }, 50);
        });
    }
    
    animateSteps() {
        document.querySelectorAll('.step-item').forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animate');
            }, index * 400);
        });
    }
}

// Initialize presentation when page loads
document.addEventListener('DOMContentLoaded', () => {
    new KaseddiePresentation();
});

// Pitch deck download function
function downloadPitchDeck() {
    const pitchDeckContent = `
KASEDDIE AI - INVESTMENT PITCH DECK
==================================

EXECUTIVE SUMMARY
- Market: $2.8T cryptocurrency market opportunity
- Problem: 95% of traders lose money due to emotional decisions
- Solution: AI-powered trading platform targeting up to 95% success rate
- Stage: Pre-launch development phase
- Investment: Seeking $2.5M Seed/Series A funding

MARKET OPPORTUNITY
- Total Addressable Market: $2.8T
- Serviceable Addressable Market: $280B
- Target Market: Professional traders and institutions

PRODUCT FEATURES (In Development)
- 10 AI trading algorithms in testing phase
- Revolutionary voice command trading interface
- Multi-platform support (Web, Mobile, Desktop)
- Institutional-grade security and compliance framework

BUSINESS MODEL
- Trading fees: 0.1% per transaction
- Premium subscriptions: $99-$499/month
- Enterprise solutions: Custom pricing
- API licensing for institutional clients

FINANCIAL PROJECTIONS (Post-Launch)
Year 1: $500K projected revenue, 10K target users
Year 2: $2.5M projected revenue, 50K target users  
Year 3: $10M projected revenue, 250K target users
Year 4: $25M projected revenue, 1M target users

INVESTMENT TERMS
- Amount: $2.5M Series A
- Valuation: $25M pre-money
- Use of funds: 40% Product, 30% Marketing, 20% Team, 10% Operations

CONTACT INFORMATION
Email: kaseddielabltd@gmail.com
Phone: +256 769089860
WhatsApp: +256 784428821
Website: kaseddie-crypto-ai.netlify.app
    `;

    const blob = new Blob([pitchDeckContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Kaseddie-AI-Investment-Pitch-Deck.txt';
    link.click();
    URL.revokeObjectURL(url);
    
    // Show notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = '<i class="fas fa-download"></i> Pitch Deck Downloaded Successfully!';
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}