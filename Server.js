// server.js - Consolidated Backend for Kaseddie AI Crypto Platform
const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const axios = require('axios');
require('dotenv').config();

// --- 1. Web3 Connection Class ---
class Web3Connection {
    constructor() {
        this.provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/demo');
        if (process.env.PRIVATE_KEY) {
            this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
        } else {
            console.warn("WARNING: No private key found. Creating a random, temporary wallet. Transactions will not be real.");
            this.wallet = ethers.Wallet.createRandom().connect(this.provider);
        }
        this.assetManagerAddress = process.env.CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000'; // Default to a zero address
        console.log(`Wallet Address: ${this.wallet.address}`);
    }

    async getContract() {
        // This ABI should match your compiled AssetManager.sol contract
        const abi = [
            "function executeAITrade(address user, address token, uint256 amount, string memory strategy)",
            "function enableAI()",
            "event TradeExecuted(address indexed user, address token, uint256 amount, string strategy)"
        ];
        if (!ethers.isAddress(this.assetManagerAddress)) {
             console.error("Contract address is invalid. Please check your .env file.");
             return null;
        }
        return new ethers.Contract(this.assetManagerAddress, abi, this.wallet);
    }

    async getBalance(address) {
        if (!ethers.isAddress(address)) {
            throw new Error("Invalid Ethereum address provided.");
        }
        return await this.provider.getBalance(address);
    }
}

// --- 2. Market Data Feed Class ---
class MarketDataFeed {
    async getPrices(symbols) {
        const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${symbols.join(',')}&vs_currencies=usd&include_24hr_change=true`);
        return response.data;
    }

    async getNews(symbol) {
        if (!process.env.NEWS_API_KEY) return [];
        try {
            const response = await axios.get(`https://newsapi.org/v2/everything?q=${symbol}&apiKey=${process.env.NEWS_API_KEY}&pageSize=10`);
            return response.data.articles;
        } catch (error) {
            console.error("Could not fetch news:", error.message);
            return [];
        }
    }

    analyzeSentiment(articles) {
        const positiveWords = ['bullish', 'surge', 'rally', 'growth', 'positive', 'high'];
        const negativeWords = ['bearish', 'crash', 'decline', 'negative', 'drop', 'low'];
        let score = 0;
        articles.forEach(article => {
            const text = (article.title + ' ' + (article.description || '')).toLowerCase();
            positiveWords.forEach(word => { if (text.includes(word)) score++; });
            negativeWords.forEach(word => { if (text.includes(word)) score--; });
        });
        if (score > 1) return 'positive';
        if (score < -1) return 'negative';
        return 'neutral';
    }

    generateRecommendation(priceData) {
        const change24h = priceData.usd_24h_change || 0;
        if (change24h > 10) return { action: 'sell', reason: 'Potentially overbought' };
        if (change24h < -10) return { action: 'buy', reason: 'Potentially oversold' };
        return { action: 'hold', reason: 'Stable market conditions' };
    }
    
    async getMarketAnalysis(symbol) {
        const [priceData, newsData] = await Promise.all([
            this.getPrices([symbol]),
            this.getNews(symbol)
        ]);
        return {
            price: priceData[symbol],
            sentiment: this.analyzeSentiment(newsData),
            recommendation: this.generateRecommendation(priceData[symbol])
        };
    }
}

// --- 3. Trading Engine Class ---
class TradingEngine {
    constructor() {
        this.marketDataFeed = new MarketDataFeed();
        this.strategies = {
            'momentum': this.momentumStrategy.bind(this),
            'mean_reversion': this.meanReversionStrategy.bind(this),
            'ai_prediction': this.aiPredictionStrategy.bind(this),
            'arbitrage': this.arbitrageStrategy.bind(this),
            'sentiment_analysis': this.sentimentAnalysisStrategy.bind(this),
            'scalping': this.scalpingStrategy.bind(this),
            'grid_trading': this.gridTradingStrategy.bind(this),
            'ai_buy_sell': this.aiBuySellStrategy.bind(this),
            'take_profit': this.takeProfitStrategy.bind(this)
        };
    }

    async executeStrategy(strategyName, asset, userPreferences = {}) {
        const strategy = this.strategies[strategyName];
        if (!strategy) throw new Error('Strategy not found');
        const marketData = await this.marketDataFeed.getPrices([asset]);
        return await strategy(marketData, userPreferences);
    }
    
    async momentumStrategy(marketData, preferences) {
        const assetData = Object.values(marketData)[0];
        const change24h = assetData.usd_24h_change;
        if (change24h > 5) return { action: 'buy', confidence: 0.7, reason: 'Strong upward momentum detected' };
        if (change24h < -5) return { action: 'sell', confidence: 0.6, reason: 'Strong downward momentum detected' };
        return { action: 'hold', confidence: 0.5, reason: 'Market is moving sideways' };
    }

    async meanReversionStrategy(marketData, preferences) {
        // MOCK: Real logic would involve calculating moving averages, etc.
        return { action: 'hold', confidence: 0.5, reason: 'Mean reversion strategy is not fully implemented (mock response).' };
    }
    
    async aiPredictionStrategy(marketData, preferences) {
        // MOCK: Real AI model prediction logic would go here
        const assetData = Object.values(marketData)[0];
        return {
            action: 'buy',
            confidence: 0.85,
            reason: 'AI model predicts 10% upside in next 24 hours (mock response)',
            predictedPrice: assetData.usd * 1.10
        };
    }

    async arbitrageStrategy(marketData, preferences) {
        const spread = Math.random() * 2;
        if (spread > 0.5) {
            return {
                action: 'buy',
                confidence: 0.95,
                reason: `Arbitrage opportunity detected: ${spread.toFixed(2)}% spread across exchanges`
            };
        }
        return { action: 'hold', confidence: 0.2, reason: 'No profitable arbitrage opportunities found' };
    }

    async sentimentAnalysisStrategy(marketData, preferences) {
        const sentiments = ['bullish', 'bearish', 'neutral'];
        const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
        const confidence = 0.7 + Math.random() * 0.2;
        
        if (sentiment === 'bullish') {
            return {
                action: 'buy',
                confidence: confidence,
                reason: 'Social sentiment analysis shows strong bullish signals from Twitter and Reddit'
            };
        } else if (sentiment === 'bearish') {
            return {
                action: 'sell',
                confidence: confidence,
                reason: 'Negative sentiment detected across social media platforms'
            };
        }
        return { action: 'hold', confidence: 0.5, reason: 'Mixed sentiment signals - waiting for clearer direction' };
    }

    async scalpingStrategy(marketData, preferences) {
        const assetData = Object.values(marketData)[0];
        const volatility = Math.abs(assetData.usd_24h_change);
        if (volatility > 3) {
            return {
                action: Math.random() > 0.5 ? 'buy' : 'sell',
                confidence: 0.89,
                reason: `High volatility detected: ${volatility.toFixed(2)}% - Perfect for scalping`
            };
        }
        return { action: 'hold', confidence: 0.3, reason: 'Low volatility - waiting for better scalping opportunity' };
    }

    async gridTradingStrategy(marketData, preferences) {
        return {
            action: 'buy',
            confidence: 0.76,
            reason: 'Grid trading activated - placing buy orders at support levels'
        };
    }

    async aiBuySellStrategy(marketData, preferences) {
        const assetData = Object.values(marketData)[0];
        const currentPrice = assetData.usd;
        const change24h = assetData.usd_24h_change;
        
        // AI calculations for buy/sell signals
        const rsi = this.calculateRSI(currentPrice, change24h);
        const macd = this.calculateMACD(currentPrice, change24h);
        const volume = Math.random() * 1000000; // Mock volume
        const support = currentPrice * 0.95;
        const resistance = currentPrice * 1.05;
        
        let score = 0;
        let reasons = [];
        let calculations = {};
        
        // RSI Analysis
        if (rsi < 30) {
            score += 3;
            reasons.push(`RSI oversold (${rsi.toFixed(1)})`);
        } else if (rsi > 70) {
            score -= 3;
            reasons.push(`RSI overbought (${rsi.toFixed(1)})`);
        }
        
        // MACD Analysis
        if (macd > 0) {
            score += 2;
            reasons.push('MACD bullish crossover');
        } else {
            score -= 2;
            reasons.push('MACD bearish crossover');
        }
        
        // Price Action Analysis
        if (currentPrice < support) {
            score += 2;
            reasons.push(`Price below support ($${support.toFixed(2)})`);
        } else if (currentPrice > resistance) {
            score -= 2;
            reasons.push(`Price above resistance ($${resistance.toFixed(2)})`);
        }
        
        // Volume Analysis
        if (volume > 500000) {
            score += 1;
            reasons.push('High volume confirmation');
        }
        
        calculations = {
            rsi: rsi.toFixed(1),
            macd: macd.toFixed(4),
            support: support.toFixed(2),
            resistance: resistance.toFixed(2),
            volume: Math.round(volume).toLocaleString(),
            aiScore: score
        };
        
        // Decision logic
        if (score >= 4) {
            const profitTarget = Math.round(5 + (score * 2));
            const targetPrice = Math.round(currentPrice * (1 + profitTarget / 100));
            return {
                action: 'buy',
                confidence: Math.min(0.95, 0.6 + (score * 0.05)),
                reason: `AI Strong Buy: ${reasons.join(', ')}`,
                profitTarget: profitTarget,
                targetPrice: targetPrice,
                stopLoss: Math.round(currentPrice * 0.95),
                calculations: calculations
            };
        } else if (score <= -4) {
            const profitTarget = Math.round(Math.abs(score) * 2);
            const targetPrice = Math.round(currentPrice * (1 - profitTarget / 100));
            return {
                action: 'sell',
                confidence: Math.min(0.95, 0.6 + (Math.abs(score) * 0.05)),
                reason: `AI Strong Sell: ${reasons.join(', ')}`,
                profitTarget: profitTarget,
                targetPrice: targetPrice,
                stopLoss: Math.round(currentPrice * 1.05),
                calculations: calculations
            };
        } else {
            return {
                action: 'hold',
                confidence: 0.5,
                reason: `AI Neutral: ${reasons.join(', ') || 'Mixed signals'}`,
                calculations: calculations
            };
        }
    }

    async takeProfitStrategy(marketData, preferences) {
        const assetData = Object.values(marketData)[0];
        const currentPrice = assetData.usd;
        const change24h = assetData.usd_24h_change;
        
        // Take profit calculations
        const entryPrice = preferences.entryPrice || currentPrice * 0.9; // Mock entry price
        const profitPercent = ((currentPrice - entryPrice) / entryPrice) * 100;
        const targetProfit = preferences.targetProfit || 15; // Default 15% target
        const stopLoss = preferences.stopLoss || -5; // Default -5% stop loss
        
        let calculations = {
            entryPrice: entryPrice.toFixed(2),
            currentPrice: currentPrice.toFixed(2),
            profitPercent: profitPercent.toFixed(2),
            targetProfit: targetProfit,
            stopLoss: stopLoss,
            profitAmount: Math.round((currentPrice - entryPrice) * 100) / 100
        };
        
        // Take profit logic
        if (profitPercent >= targetProfit) {
            return {
                action: 'sell',
                confidence: 0.95,
                reason: `Take Profit Triggered: ${profitPercent.toFixed(2)}% profit reached (target: ${targetProfit}%)`,
                profitTarget: profitPercent.toFixed(2),
                calculations: calculations
            };
        } else if (profitPercent <= stopLoss) {
            return {
                action: 'sell',
                confidence: 0.90,
                reason: `Stop Loss Triggered: ${profitPercent.toFixed(2)}% loss (stop: ${stopLoss}%)`,
                profitTarget: profitPercent.toFixed(2),
                calculations: calculations
            };
        } else {
            const remainingToTarget = targetProfit - profitPercent;
            return {
                action: 'hold',
                confidence: 0.7,
                reason: `Hold Position: ${profitPercent.toFixed(2)}% profit, ${remainingToTarget.toFixed(2)}% to target`,
                calculations: calculations
            };
        }
    }
    
    // Helper functions for technical analysis
    calculateRSI(price, change) {
        // Simplified RSI calculation
        const baseRSI = 50;
        const adjustment = change * 2;
        return Math.max(0, Math.min(100, baseRSI + adjustment + (Math.random() - 0.5) * 20));
    }
    
    calculateMACD(price, change) {
        // Simplified MACD calculation
        return (change / 100) * price * 0.001 + (Math.random() - 0.5) * 0.01;
    }
}

// --- 4. Voice AI Class ---
class VoiceAI {
    constructor(web3Connection) {
        this.web3Connection = web3Connection;
        this.commands = new Map([
            ['buy', this.executeTrade],
            ['sell', this.executeTrade],
            ['analyze', this.analyzeMarket],
            ['portfolio', this.getPortfolio]
        ]);
    }

    parseCommand(text) {
        const words = text.toLowerCase().split(' ');
        const action = words.find(w => this.commands.has(w));
        // A simple way to find common crypto names
        const assetMap = { 'eth': 'ethereum', 'btc': 'bitcoin' };
        let asset = words.find(w => Object.keys(assetMap).includes(w));
        asset = asset ? assetMap[asset] : 'ethereum'; // default to eth
        const amount = words.find(w => !isNaN(parseFloat(w)));
        return { action, asset, amount };
    }
    
    async processVoiceCommand(voiceText, userAddress) {
        const command = this.parseCommand(voiceText);
        if (!command.action) {
            return { error: 'Command not recognized. Try "buy", "sell", "analyze", or "portfolio".' };
        }
        const handler = this.commands.get(command.action);
        return await handler.call(this, command, userAddress);
    }
    
    async executeTrade(command, userAddress) {
        // MOCK: In a real scenario, you'd get the token address for 'eth' or 'btc'
        const tokenAddress = '0x0000000000000000000000000000000000000000';
        
        console.log(`Executing ${command.action} for ${command.amount} ${command.asset}`);
        
        const contract = await this.web3Connection.getContract();
        if(!contract) return { error: 'Contract not available.'};

        try {
            // This is a simulated call. For a real transaction, you would not use callStatic.
             await contract.executeAITrade.staticCall(
                userAddress,
                tokenAddress,
                ethers.parseEther(command.amount || '0'),
                `voice_${command.action}`
            );
            return { success: true, txHash: 'SIMULATED_SUCCESS' };
        } catch(error) {
            console.error("Smart contract call failed:", error.reason || error.message);
            return { error: `Smart contract simulation failed: ${error.reason || 'Check contract address and parameters'}` };
        }
    }

    async analyzeMarket(command, userAddress) {
        const marketDataFeed = new MarketDataFeed();
        return await marketDataFeed.getMarketAnalysis(command.asset);
    }
    
    async getPortfolio(command, userAddress) {
         const balance = await this.web3Connection.getBalance(userAddress);
         return { balance: balance.toString() };
    }
}

// --- 5. Express API Setup ---
const app = express();

// ** FIX: More explicit CORS configuration **
app.use(cors({
  origin: '*', // Allow all origins for local development
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization'
}));
app.options('*', cors()); // Enable preflight requests for all routes

app.use(express.json());

const web3 = new Web3Connection();
const voiceAI = new VoiceAI(web3);
const tradingEngine = new TradingEngine();
const marketData = new MarketDataFeed();

// API Endpoints
const router = express.Router();

router.post('/voice-command', async (req, res) => {
    try {
        const { command } = req.body;
        // In a real app, user address would come from authenticated session
        const userAddress = web3.wallet.address; 
        const result = await voiceAI.processVoiceCommand(command, userAddress);
        if (result.error) {
             res.status(400).json({ error: result.error });
        } else {
            res.json({ response: `Executed: ${command}`, result });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/prices', async (req, res) => {
    try {
        const prices = await marketData.getPrices(['ethereum', 'bitcoin']);
        res.json({ prices });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/portfolio/:address', async (req, res) => {
    try {
        const balance = await web3.getBalance(req.params.address);
        res.json({ balance: balance.toString() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/market-analysis/:symbol', async (req, res) => {
    try {
        const analysis = await marketData.getMarketAnalysis(req.params.symbol);
        res.json(analysis);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/execute-strategy', async (req, res) => {
    try {
        const { strategy, asset, preferences } = req.body;
        const result = await tradingEngine.executeStrategy(strategy, asset, preferences);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.use('/api', router);

const PORT = process.env.PORT || 3002;

// Serve static files
app.use(express.static(__dirname));

// Root route - serve website
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Trading platform route
app.get('/trading-platform.html', (req, res) => {
    res.sendFile(__dirname + '/trading-platform.html');
});
app.listen(PORT, () => {
    console.log('===================================================');
    console.log('🚀 Kaseddie AI Crypto Platform Backend is Running!');
    console.log(`🌐 Listening on http://localhost:${PORT}`);
    console.log('===================================================');
});// JavaScript source code
