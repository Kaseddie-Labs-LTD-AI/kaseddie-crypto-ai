# Kaseddie AI Cairo Smart Contract Deployment Guide

## Overview
This directory contains the production-ready Cairo smart contract for Kaseddie AI's trading execution system on Starknet.

## Contract Features

### Core Functionality
- **AI Trade Execution**: Execute trades based on AI strategy signals
- **User Management**: Authorization and balance tracking
- **Strategy Management**: Enable/disable trading strategies with custom fees
- **Risk Management**: Daily limits, slippage protection, emergency stops
- **Performance Tracking**: Real-time strategy performance metrics

### Security Features
- Owner-only administrative functions
- User authorization system
- Emergency stop mechanism
- Contract pause functionality
- Daily trading limits
- Slippage tolerance protection

### Supported AI Strategies
1. Momentum Strategy (58% success rate)
2. AI Prediction (62% success rate)
3. Mean Reversion (55% success rate)
4. Cross-Exchange Arbitrage (68% success rate)
5. Social Sentiment Analysis (60% success rate)
6. AI Scalping (65% success rate)
7. AI Grid Trading (57% success rate)
8. AI Buy/Sell Signals (64% success rate)
9. Take Profit Algorithm (61% success rate)
10. Manual Trading (User controlled)

## File Structure
```
cairo-contracts/
├── executor.cairo          # Main smart contract
├── test_executor.cairo     # Comprehensive test suite
├── Scarb.toml             # Project configuration
├── lib.cairo              # Module definitions
└── deployment_guide.md    # This file
```

## Prerequisites
- Cairo 2.6.3+
- Scarb package manager
- Starknet Foundry (snforge) for testing
- Starknet CLI for deployment

## Installation & Setup

### 1. Install Dependencies
```bash
# Install Scarb
curl --proto '=https' --tlsv1.2 -sSf https://docs.swmansion.com/scarb/install.sh | sh

# Install Starknet Foundry
curl -L https://raw.githubusercontent.com/foundry-rs/starknet-foundry/master/scripts/install.sh | sh
```

### 2. Build Contract
```bash
cd cairo-contracts
scarb build
```

### 3. Run Tests
```bash
snforge test
```

## Deployment Steps

### Testnet Deployment

1. **Prepare Environment**
```bash
# Set up environment variables
export STARKNET_ACCOUNT=your_account
export STARKNET_RPC=https://starknet-sepolia.public.blastapi.io/rpc/v0_7
```

2. **Declare Contract**
```bash
starknet declare --contract target/dev/kaseddie_executor_AITradeExecutor.contract_class.json
```

3. **Deploy Contract**
```bash
starknet deploy \
  --class_hash <DECLARED_CLASS_HASH> \
  --inputs <OWNER_ADDRESS> <AI_ORACLE_ADDRESS> <MAX_TRADE_AMOUNT_LOW> <MAX_TRADE_AMOUNT_HIGH>
```

### Constructor Parameters
- `owner`: Contract owner address (your address)
- `ai_oracle`: AI system address for trade signals
- `max_trade_amount`: Maximum single trade amount (e.g., 1000000 for 1M units)

### Example Deployment
```bash
starknet deploy \
  --class_hash 0x1234... \
  --inputs 0x05f1c3c5... 0x06a2b4d6... 1000000 0
```

## Post-Deployment Setup

### 1. Authorize Users
```bash
starknet invoke \
  --address <CONTRACT_ADDRESS> \
  --function authorize_user \
  --inputs <USER_ADDRESS>
```

### 2. Configure Strategies
```bash
# Enable custom strategy with 2% fee (200 basis points)
starknet invoke \
  --address <CONTRACT_ADDRESS> \
  --function enable_strategy \
  --inputs <STRATEGY_NAME> 200
```

### 3. Set Trading Limits
```bash
starknet invoke \
  --address <CONTRACT_ADDRESS> \
  --function update_max_trade_amount \
  --inputs <NEW_AMOUNT_LOW> <NEW_AMOUNT_HIGH>
```

## Integration with Backend

### JavaScript Integration Example
```javascript
import { Contract, Account, Provider } from 'starknet';

const provider = new Provider({ sequencer: { network: 'goerli-alpha' } });
const contract = new Contract(abi, contractAddress, provider);

// Execute AI trade
const tradeOrder = {
  user: userAddress,
  asset: 'BTC',
  amount: 1000,
  direction: 'buy',
  strategy: 'momentum',
  timestamp: Date.now(),
  expected_price: 65000000000,
  slippage_tolerance: 500
};

const result = await contract.execute_ai_trade(tradeOrder);
```

## Monitoring & Maintenance

### Key Events to Monitor
- `TradeExecuted`: Successful trade completion
- `TradeRejected`: Failed trade attempts
- `EmergencyStop`: Security incidents
- `StrategyPerformanceUpdated`: Performance metrics

### Regular Maintenance
1. Monitor strategy performance metrics
2. Update trading limits based on market conditions
3. Review and authorize new users
4. Backup contract state periodically

## Security Considerations

### Access Control
- Only owner can authorize users
- Only authorized users can execute trades
- Emergency stop can be triggered by owner or AI oracle

### Risk Management
- Daily trading limits per user
- Maximum single trade amount
- Slippage tolerance protection
- Strategy-based fee collection

### Audit Recommendations
- Conduct security audit before mainnet deployment
- Test all functions with edge cases
- Verify access control mechanisms
- Review emergency procedures

## Troubleshooting

### Common Issues
1. **"User not authorized"**: User must be authorized by contract owner
2. **"Insufficient balance"**: User needs to deposit funds first
3. **"Strategy not enabled"**: Strategy must be enabled by owner
4. **"Daily limit exceeded"**: User has reached daily trading limit

### Debug Commands
```bash
# Check user balance
starknet call --address <CONTRACT> --function get_balance --inputs <USER>

# Check strategy status
starknet call --address <CONTRACT> --function is_strategy_enabled --inputs <STRATEGY>

# Get trade count
starknet call --address <CONTRACT> --function get_trade_count
```

## Support
For technical support and questions:
- Email: kaseddielabltd@gmail.com
- Documentation: https://kaseddie-crypto-ai.netlify.app
- GitHub: https://github.com/Kaseddie-Labs-LTD-AI/kaseddie-crypto-ai