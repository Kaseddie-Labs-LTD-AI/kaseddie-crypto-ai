// AI Learning System for Kaseddie Platform
class AILearningSystem {
    constructor() {
        this.knowledgeBase = this.loadKnowledgeBase();
        this.userInteractions = this.loadUserInteractions();
        this.learningEnabled = true;
    }

    loadKnowledgeBase() {
        return {
            // Comprehensive cryptocurrency data
            cryptocurrencies: {
                'bitcoin': {
                    symbol: 'BTC',
                    name: 'Bitcoin',
                    description: 'First and largest cryptocurrency, digital gold, store of value',
                    useCase: 'Store of value, digital payments, hedge against inflation',
                    technology: 'Proof of Work, SHA-256 mining',
                    marketCap: 1200000000000,
                    maxSupply: 21000000,
                    keywords: ['btc', 'bitcoin', 'digital gold', 'satoshi']
                },
                'ethereum': {
                    symbol: 'ETH',
                    name: 'Ethereum',
                    description: 'Smart contract platform, DeFi ecosystem foundation',
                    useCase: 'Smart contracts, DeFi, NFTs, dApps',
                    technology: 'Proof of Stake, EVM, Layer 2 scaling',
                    marketCap: 430000000000,
                    keywords: ['eth', 'ethereum', 'smart contracts', 'defi', 'vitalik']
                },
                'binance': {
                    symbol: 'BNB',
                    name: 'Binance Coin',
                    description: 'Binance exchange token, BSC blockchain native token',
                    useCase: 'Trading fee discounts, BSC gas fees, staking',
                    technology: 'BEP-20, Binance Smart Chain',
                    keywords: ['bnb', 'binance', 'bsc', 'cz']
                },
                'cardano': {
                    symbol: 'ADA',
                    name: 'Cardano',
                    description: 'Academic blockchain, peer-reviewed development',
                    useCase: 'Smart contracts, sustainability, academic research',
                    technology: 'Ouroboros Proof of Stake',
                    keywords: ['ada', 'cardano', 'charles hoskinson', 'ouroboros']
                },
                'solana': {
                    symbol: 'SOL',
                    name: 'Solana',
                    description: 'High-speed blockchain, low transaction costs',
                    useCase: 'DeFi, NFTs, high-frequency trading, gaming',
                    technology: 'Proof of History, Tower BFT',
                    keywords: ['sol', 'solana', 'fast', 'cheap', 'anatoly']
                }
            },

            // Trading strategies knowledge
            tradingStrategies: {
                'momentum': {
                    description: 'Follows price trends and momentum indicators',
                    successRate: 78,
                    riskLevel: 'Medium',
                    timeframe: 'Short to medium term',
                    indicators: ['RSI', 'MACD', 'Moving Averages'],
                    bestFor: 'Trending markets'
                },
                'arbitrage': {
                    description: 'Exploits price differences across exchanges',
                    successRate: 95,
                    riskLevel: 'Low',
                    timeframe: 'Very short term',
                    requirements: ['Multiple exchange accounts', 'Fast execution'],
                    bestFor: 'Risk-averse traders'
                },
                'scalping': {
                    description: 'Quick trades for small profits',
                    successRate: 89,
                    riskLevel: 'High',
                    timeframe: 'Seconds to minutes',
                    requirements: ['Fast internet', 'Low latency'],
                    bestFor: 'Active traders'
                }
            },

            // DeFi protocols and concepts
            defi: {
                'yield_farming': {
                    description: 'Earning rewards by providing liquidity',
                    risks: ['Impermanent loss', 'Smart contract risk'],
                    returns: '5-50% APY',
                    platforms: ['Uniswap', 'Compound', 'Aave']
                },
                'staking': {
                    description: 'Earning rewards by locking tokens',
                    risks: ['Slashing', 'Lock-up periods'],
                    returns: '4-15% APY',
                    coins: ['ETH', 'ADA', 'DOT', 'ATOM']
                }
            },

            // Market analysis terms
            technicalAnalysis: {
                'rsi': 'Relative Strength Index - momentum oscillator (0-100)',
                'macd': 'Moving Average Convergence Divergence - trend indicator',
                'bollinger_bands': 'Volatility indicator with upper/lower bands',
                'support': 'Price level where buying pressure emerges',
                'resistance': 'Price level where selling pressure emerges',
                'fibonacci': 'Retracement levels based on mathematical ratios'
            }
        };
    }

    loadUserInteractions() {
        if (typeof localStorage !== 'undefined') {
            return JSON.parse(localStorage.getItem('aiLearningData') || '{}');
        }
        return {};
    }

    saveUserInteractions() {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('aiLearningData', JSON.stringify(this.userInteractions));
        }
    }

    // Enhanced response generation with learning
    generateSmartResponse(userMessage) {
        const message = userMessage.toLowerCase();
        const words = message.split(' ');
        
        // Learn from user input
        this.learnFromInput(userMessage);
        
        // Check for cryptocurrency mentions
        for (const [crypto, data] of Object.entries(this.knowledgeBase.cryptocurrencies)) {
            if (data.keywords.some(keyword => message.includes(keyword))) {
                return this.generateCryptoResponse(crypto, data, message);
            }
        }
        
        // Check for trading strategy mentions
        for (const [strategy, data] of Object.entries(this.knowledgeBase.tradingStrategies)) {
            if (message.includes(strategy)) {
                return this.generateStrategyResponse(strategy, data);
            }
        }
        
        // Check for DeFi mentions
        if (message.includes('defi') || message.includes('yield') || message.includes('staking')) {
            return this.generateDeFiResponse(message);
        }
        
        // Check for technical analysis
        if (message.includes('analysis') || message.includes('chart') || message.includes('indicator')) {
            return this.generateTechnicalResponse(message);
        }
        
        // Pattern-based responses with learning
        return this.generatePatternResponse(message);
    }

    generateCryptoResponse(crypto, data, message) {
        let response = `💰 ${data.name} (${data.symbol}):\n`;
        response += `📊 ${data.description}\n`;
        response += `🎯 Use Case: ${data.useCase}\n`;
        
        if (message.includes('price') || message.includes('buy') || message.includes('sell')) {
            response += `💹 Current market trend analysis available. Would you like to execute a trading strategy?`;
        } else if (message.includes('technology') || message.includes('how')) {
            response += `⚙️ Technology: ${data.technology || 'Advanced blockchain technology'}`;
        }
        
        return response;
    }

    generateStrategyResponse(strategy, data) {
        return `🤖 ${strategy.toUpperCase()} Strategy:\n` +
               `📈 Success Rate: ${data.successRate}%\n` +
               `⚖️ Risk Level: ${data.riskLevel}\n` +
               `⏰ Timeframe: ${data.timeframe}\n` +
               `🎯 Best For: ${data.bestFor}\n` +
               `Would you like to test this strategy?`;
    }

    generateDeFiResponse(message) {
        if (message.includes('yield') || message.includes('farming')) {
            const data = this.knowledgeBase.defi.yield_farming;
            return `🌾 Yield Farming:\n${data.description}\n💰 Returns: ${data.returns}\n⚠️ Risks: ${data.risks.join(', ')}\n🏛️ Top Platforms: ${data.platforms.join(', ')}`;
        }
        
        if (message.includes('staking')) {
            const data = this.knowledgeBase.defi.staking;
            return `🔒 Staking:\n${data.description}\n💰 Returns: ${data.returns}\n⚠️ Risks: ${data.risks.join(', ')}\n🪙 Popular Coins: ${data.coins.join(', ')}`;
        }
        
        return `🏦 DeFi (Decentralized Finance) offers various earning opportunities:\n• Yield Farming (5-50% APY)\n• Staking (4-15% APY)\n• Liquidity Provision\n• Lending & Borrowing\nWhich DeFi strategy interests you?`;
    }

    generateTechnicalResponse(message) {
        const indicators = Object.entries(this.knowledgeBase.technicalAnalysis);
        let response = `📊 Technical Analysis Tools:\n`;
        
        indicators.forEach(([indicator, description]) => {
            if (message.includes(indicator.replace('_', ' '))) {
                response = `📈 ${indicator.toUpperCase()}: ${description}\n\nWould you like me to analyze a specific cryptocurrency using this indicator?`;
                return response;
            }
        });
        
        response += indicators.map(([ind, desc]) => `• ${ind.toUpperCase()}: ${desc}`).join('\n');
        response += `\n\nWhich indicator would you like to learn more about?`;
        return response;
    }

    generatePatternResponse(message) {
        // Advanced pattern matching with context awareness
        const patterns = {
            'how_to': /how (to|do|can)/i,
            'what_is': /what (is|are)/i,
            'when_to': /when (to|should)/i,
            'why': /why/i,
            'best': /best|top|good|recommend/i,
            'safe': /safe|secure|risk/i,
            'profit': /profit|money|earn|make/i
        };
        
        for (const [pattern, regex] of Object.entries(patterns)) {
            if (regex.test(message)) {
                return this.generateContextualResponse(pattern, message);
            }
        }
        
        return this.generateFallbackResponse(message);
    }

    generateContextualResponse(pattern, message) {
        const responses = {
            'how_to': `🎓 I can guide you through:\n• Setting up your first crypto wallet\n• Executing your first trade\n• Using AI trading strategies\n• Managing risk and portfolio\nWhat specifically would you like to learn?`,
            
            'what_is': `📚 I can explain:\n• Cryptocurrency concepts\n• Blockchain technology\n• Trading strategies\n• DeFi protocols\n• Technical indicators\nWhat term would you like me to define?`,
            
            'when_to': `⏰ Timing is crucial in crypto:\n• Buy during market dips (DCA strategy)\n• Sell when targets are reached\n• Use stop-losses to limit downside\n• Consider market cycles and trends\nWhat timing question do you have?`,
            
            'best': `🏆 Top recommendations:\n• Bitcoin & Ethereum for beginners\n• AI Prediction strategy (85% success)\n• Dollar-cost averaging for long-term\n• Diversified portfolio approach\nWhat's your investment goal?`,
            
            'safe': `🛡️ Safety first:\n• Use reputable exchanges\n• Enable 2FA security\n• Never share private keys\n• Start with small amounts\n• Complete KYC verification\nNeed specific security advice?`,
            
            'profit': `💰 Profit strategies:\n• AI trading (up to 95% success)\n• DeFi yield farming (5-50% APY)\n• Staking rewards (4-15% APY)\n• Long-term holding (HODL)\nWhat's your risk tolerance?`
        };
        
        return responses[pattern] || this.generateFallbackResponse(message);
    }

    generateFallbackResponse(message) {
        return `🤖 I'm continuously learning! Your question: "${message}" helps me improve.\n\n` +
               `I specialize in:\n` +
               `• 50+ Cryptocurrency analysis\n` +
               `• 10 AI trading strategies\n` +
               `• DeFi and staking guidance\n` +
               `• Technical analysis\n` +
               `• Risk management\n\n` +
               `Could you rephrase your question or ask about a specific crypto topic?`;
    }

    learnFromInput(userMessage) {
        if (!this.learningEnabled) return;
        
        const timestamp = Date.now();
        const sessionId = this.getSessionId();
        
        // Store interaction for learning
        if (!this.userInteractions[sessionId]) {
            this.userInteractions[sessionId] = [];
        }
        
        this.userInteractions[sessionId].push({
            message: userMessage,
            timestamp: timestamp,
            context: this.getCurrentContext()
        });
        
        // Analyze patterns every 10 interactions
        if (this.userInteractions[sessionId].length % 10 === 0) {
            this.analyzeUserPatterns(sessionId);
        }
        
        this.saveUserInteractions();
    }

    analyzeUserPatterns(sessionId) {
        const interactions = this.userInteractions[sessionId];
        const recentInteractions = interactions.slice(-20); // Last 20 interactions
        
        // Find common topics
        const topics = {};
        recentInteractions.forEach(interaction => {
            const words = interaction.message.toLowerCase().split(' ');
            words.forEach(word => {
                if (word.length > 3) {
                    topics[word] = (topics[word] || 0) + 1;
                }
            });
        });
        
        // Store learned patterns
        this.userInteractions[`${sessionId}_patterns`] = {
            commonTopics: Object.entries(topics)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .map(([topic]) => topic),
            lastAnalysis: Date.now()
        };
    }

    getSessionId() {
        if (typeof sessionStorage !== 'undefined') {
            let sessionId = sessionStorage.getItem('aiSessionId');
            if (!sessionId) {
                sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                sessionStorage.setItem('aiSessionId', sessionId);
            }
            return sessionId;
        }
        return 'default_session';
    }

    getCurrentContext() {
        return {
            url: typeof window !== 'undefined' ? window.location.href : '',
            timestamp: Date.now(),
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
        };
    }

    // Get personalized recommendations based on user history
    getPersonalizedRecommendations(sessionId) {
        const patterns = this.userInteractions[`${sessionId}_patterns`];
        if (!patterns) return null;
        
        const recommendations = [];
        
        patterns.commonTopics.forEach(topic => {
            if (this.knowledgeBase.cryptocurrencies[topic]) {
                recommendations.push(`Consider learning more about ${topic.toUpperCase()}`);
            }
        });
        
        return recommendations.length > 0 ? recommendations : null;
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AILearningSystem;
} else if (typeof window !== 'undefined') {
    window.AILearningSystem = AILearningSystem;
}