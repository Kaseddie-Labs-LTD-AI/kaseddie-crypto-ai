#[starknet::contract]
mod AITradeExecutor {
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};

    #[storage]
    struct Storage {
        // Core contract state
        owner: ContractAddress,
        ai_oracle: ContractAddress,
        is_paused: bool,
        
        // User management
        user_balances: LegacyMap<ContractAddress, u256>,
        user_strategies: LegacyMap<ContractAddress, felt252>,
        authorized_users: LegacyMap<ContractAddress, bool>,
        
        // Trading data
        trade_count: u256,
        total_volume: u256,
        strategy_performance: LegacyMap<felt252, StrategyStats>,
        
        // AI strategy configurations
        strategy_enabled: LegacyMap<felt252, bool>,
        strategy_fee: LegacyMap<felt252, u256>, // Fee in basis points (100 = 1%)
        
        // Risk management
        max_trade_amount: u256,
        daily_trade_limit: LegacyMap<ContractAddress, u256>,
        last_trade_day: LegacyMap<ContractAddress, u64>,
        
        // Emergency controls
        emergency_stop: bool,
        last_heartbeat: u64,
    }

    #[derive(Drop, Serde, starknet::Store)]
    struct StrategyStats {
        total_trades: u256,
        successful_trades: u256,
        total_profit: u256,
        total_loss: u256,
        last_updated: u64,
    }

    #[derive(Drop, Serde)]
    struct TradeOrder {
        user: ContractAddress,
        asset: felt252,
        amount: u256,
        direction: felt252, // 'buy' or 'sell'
        strategy: felt252,
        timestamp: u64,
        expected_price: u256,
        slippage_tolerance: u256, // In basis points
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        TradeExecuted: TradeExecuted,
        TradeRejected: TradeRejected,
        BalanceUpdated: BalanceUpdated,
        StrategyUpdated: StrategyUpdated,
        EmergencyStop: EmergencyStop,
        UserAuthorized: UserAuthorized,
        StrategyPerformanceUpdated: StrategyPerformanceUpdated,
    }

    #[derive(Drop, starknet::Event)]
    struct TradeExecuted {
        #[key]
        user: ContractAddress,
        #[key]
        strategy: felt252,
        asset: felt252,
        amount: u256,
        direction: felt252,
        execution_price: u256,
        fee_paid: u256,
        timestamp: u64,
        trade_id: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct TradeRejected {
        #[key]
        user: ContractAddress,
        reason: felt252,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct BalanceUpdated {
        #[key]
        user: ContractAddress,
        old_balance: u256,
        new_balance: u256,
        change_type: felt252, // 'deposit', 'withdraw', 'trade'
    }

    #[derive(Drop, starknet::Event)]
    struct StrategyUpdated {
        strategy: felt252,
        enabled: bool,
        fee: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct EmergencyStop {
        triggered_by: ContractAddress,
        reason: felt252,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct UserAuthorized {
        user: ContractAddress,
        authorized: bool,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct StrategyPerformanceUpdated {
        strategy: felt252,
        total_trades: u256,
        success_rate: u256, // In basis points
        profit_loss: u256,
    }

    mod Errors {
        const UNAUTHORIZED: felt252 = 'Unauthorized access';
        const CONTRACT_PAUSED: felt252 = 'Contract is paused';
        const EMERGENCY_STOP_ACTIVE: felt252 = 'Emergency stop active';
        const INSUFFICIENT_BALANCE: felt252 = 'Insufficient balance';
        const INVALID_AMOUNT: felt252 = 'Invalid trade amount';
        const STRATEGY_DISABLED: felt252 = 'Strategy not enabled';
        const DAILY_LIMIT_EXCEEDED: felt252 = 'Daily limit exceeded';
        const SLIPPAGE_EXCEEDED: felt252 = 'Slippage tolerance exceeded';
        const INVALID_STRATEGY: felt252 = 'Invalid strategy';
        const USER_NOT_AUTHORIZED: felt252 = 'User not authorized';
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        owner: ContractAddress,
        ai_oracle: ContractAddress,
        max_trade_amount: u256
    ) {
        self.owner.write(owner);
        self.ai_oracle.write(ai_oracle);
        self.max_trade_amount.write(max_trade_amount);
        self.is_paused.write(false);
        self.emergency_stop.write(false);
        self.trade_count.write(0);
        self.total_volume.write(0);
        self.last_heartbeat.write(get_block_timestamp());
        
        // Initialize default strategies
        self._initialize_strategies();
    }

    #[abi(embed_v0)]
    impl AITradeExecutorImpl of super::IAITradeExecutor<ContractState> {
        
        // === CORE TRADING FUNCTIONS ===
        
        fn execute_ai_trade(
            ref self: ContractState,
            trade_order: TradeOrder
        ) -> bool {
            // Security checks
            self._require_not_paused();
            self._require_not_emergency_stopped();
            self._require_authorized_user(trade_order.user);
            self._require_valid_strategy(trade_order.strategy);
            
            // Validate trade parameters
            assert(trade_order.amount > 0, Errors::INVALID_AMOUNT);
            assert(trade_order.amount <= self.max_trade_amount.read(), Errors::INVALID_AMOUNT);
            
            // Check daily limits
            self._check_daily_limits(trade_order.user, trade_order.amount);
            
            // Check user balance
            let user_balance = self.user_balances.read(trade_order.user);
            assert(user_balance >= trade_order.amount, Errors::INSUFFICIENT_BALANCE);
            
            // Calculate fees
            let strategy_fee_rate = self.strategy_fee.read(trade_order.strategy);
            let fee_amount = (trade_order.amount * strategy_fee_rate) / 10000; // Basis points
            
            // Execute the trade (simplified - in real implementation would interact with DEX)
            let execution_price = self._get_execution_price(trade_order.asset, trade_order.amount);
            
            // Check slippage
            let price_diff = if execution_price > trade_order.expected_price {
                execution_price - trade_order.expected_price
            } else {
                trade_order.expected_price - execution_price
            };
            let slippage = (price_diff * 10000) / trade_order.expected_price;
            assert(slippage <= trade_order.slippage_tolerance, Errors::SLIPPAGE_EXCEEDED);
            
            // Update user balance
            let new_balance = user_balance - trade_order.amount - fee_amount;
            self.user_balances.write(trade_order.user, new_balance);
            
            // Update contract state
            let trade_id = self.trade_count.read() + 1;
            self.trade_count.write(trade_id);
            self.total_volume.write(self.total_volume.read() + trade_order.amount);
            
            // Update daily limits
            self._update_daily_limits(trade_order.user, trade_order.amount);
            
            // Update strategy performance
            self._update_strategy_performance(trade_order.strategy, true, trade_order.amount);
            
            // Emit events
            self.emit(TradeExecuted {
                user: trade_order.user,
                strategy: trade_order.strategy,
                asset: trade_order.asset,
                amount: trade_order.amount,
                direction: trade_order.direction,
                execution_price,
                fee_paid: fee_amount,
                timestamp: get_block_timestamp(),
                trade_id,
            });
            
            self.emit(BalanceUpdated {
                user: trade_order.user,
                old_balance: user_balance,
                new_balance,
                change_type: 'trade',
            });
            
            true
        }

        fn deposit(ref self: ContractState, amount: u256) {
            self._require_not_paused();
            assert(amount > 0, Errors::INVALID_AMOUNT);
            
            let caller = get_caller_address();
            let current_balance = self.user_balances.read(caller);
            let new_balance = current_balance + amount;
            
            self.user_balances.write(caller, new_balance);
            
            self.emit(BalanceUpdated {
                user: caller,
                old_balance: current_balance,
                new_balance,
                change_type: 'deposit',
            });
        }

        fn withdraw(ref self: ContractState, amount: u256) {
            self._require_not_paused();
            assert(amount > 0, Errors::INVALID_AMOUNT);
            
            let caller = get_caller_address();
            let current_balance = self.user_balances.read(caller);
            assert(current_balance >= amount, Errors::INSUFFICIENT_BALANCE);
            
            let new_balance = current_balance - amount;
            self.user_balances.write(caller, new_balance);
            
            self.emit(BalanceUpdated {
                user: caller,
                old_balance: current_balance,
                new_balance,
                change_type: 'withdraw',
            });
        }

        // === USER MANAGEMENT ===
        
        fn authorize_user(ref self: ContractState, user: ContractAddress) {
            self._require_owner();
            self.authorized_users.write(user, true);
            
            self.emit(UserAuthorized {
                user,
                authorized: true,
                timestamp: get_block_timestamp(),
            });
        }

        fn revoke_user(ref self: ContractState, user: ContractAddress) {
            self._require_owner();
            self.authorized_users.write(user, false);
            
            self.emit(UserAuthorized {
                user,
                authorized: false,
                timestamp: get_block_timestamp(),
            });
        }

        fn set_user_strategy(ref self: ContractState, strategy: felt252) {
            self._require_not_paused();
            self._require_valid_strategy(strategy);
            
            let caller = get_caller_address();
            self.user_strategies.write(caller, strategy);
        }

        // === STRATEGY MANAGEMENT ===
        
        fn enable_strategy(ref self: ContractState, strategy: felt252, fee: u256) {
            self._require_owner();
            self.strategy_enabled.write(strategy, true);
            self.strategy_fee.write(strategy, fee);
            
            self.emit(StrategyUpdated {
                strategy,
                enabled: true,
                fee,
            });
        }

        fn disable_strategy(ref self: ContractState, strategy: felt252) {
            self._require_owner();
            self.strategy_enabled.write(strategy, false);
            
            self.emit(StrategyUpdated {
                strategy,
                enabled: false,
                fee: 0,
            });
        }

        // === VIEW FUNCTIONS ===
        
        fn get_balance(self: @ContractState, user: ContractAddress) -> u256 {
            self.user_balances.read(user)
        }

        fn get_trade_count(self: @ContractState) -> u256 {
            self.trade_count.read()
        }

        fn get_total_volume(self: @ContractState) -> u256 {
            self.total_volume.read()
        }

        fn get_strategy_performance(self: @ContractState, strategy: felt252) -> StrategyStats {
            self.strategy_performance.read(strategy)
        }

        fn is_strategy_enabled(self: @ContractState, strategy: felt252) -> bool {
            self.strategy_enabled.read(strategy)
        }

        fn is_user_authorized(self: @ContractState, user: ContractAddress) -> bool {
            self.authorized_users.read(user)
        }

        fn get_user_strategy(self: @ContractState, user: ContractAddress) -> felt252 {
            self.user_strategies.read(user)
        }

        // === ADMIN FUNCTIONS ===
        
        fn pause_contract(ref self: ContractState) {
            self._require_owner();
            self.is_paused.write(true);
        }

        fn unpause_contract(ref self: ContractState) {
            self._require_owner();
            self.is_paused.write(false);
        }

        fn emergency_stop(ref self: ContractState, reason: felt252) {
            // Can be called by owner or AI oracle
            let caller = get_caller_address();
            assert(
                caller == self.owner.read() || caller == self.ai_oracle.read(),
                Errors::UNAUTHORIZED
            );
            
            self.emergency_stop.write(true);
            
            self.emit(EmergencyStop {
                triggered_by: caller,
                reason,
                timestamp: get_block_timestamp(),
            });
        }

        fn reset_emergency_stop(ref self: ContractState) {
            self._require_owner();
            self.emergency_stop.write(false);
        }

        fn update_max_trade_amount(ref self: ContractState, new_amount: u256) {
            self._require_owner();
            self.max_trade_amount.write(new_amount);
        }

        fn heartbeat(ref self: ContractState) {
            // AI oracle sends periodic heartbeat
            assert(get_caller_address() == self.ai_oracle.read(), Errors::UNAUTHORIZED);
            self.last_heartbeat.write(get_block_timestamp());
        }
    }

    // === INTERNAL FUNCTIONS ===
    
    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        fn _require_owner(self: @ContractState) {
            assert(get_caller_address() == self.owner.read(), Errors::UNAUTHORIZED);
        }

        fn _require_not_paused(self: @ContractState) {
            assert(!self.is_paused.read(), Errors::CONTRACT_PAUSED);
        }

        fn _require_not_emergency_stopped(self: @ContractState) {
            assert(!self.emergency_stop.read(), Errors::EMERGENCY_STOP_ACTIVE);
        }

        fn _require_authorized_user(self: @ContractState, user: ContractAddress) {
            assert(self.authorized_users.read(user), Errors::USER_NOT_AUTHORIZED);
        }

        fn _require_valid_strategy(self: @ContractState, strategy: felt252) {
            assert(self.strategy_enabled.read(strategy), Errors::STRATEGY_DISABLED);
        }

        fn _initialize_strategies(ref self: ContractState) {
            // Initialize the 10 AI strategies with default fees (1% = 100 basis points)
            let strategies = array![
                'momentum',
                'ai_prediction', 
                'mean_reversion',
                'arbitrage',
                'sentiment_analysis',
                'scalping',
                'grid_trading',
                'ai_buy_sell',
                'take_profit',
                'manual_trading'
            ];
            
            let mut i = 0;
            loop {
                if i >= strategies.len() {
                    break;
                }
                let strategy = *strategies.at(i);
                self.strategy_enabled.write(strategy, true);
                self.strategy_fee.write(strategy, 100); // 1% fee
                i += 1;
            };
        }

        fn _check_daily_limits(self: @ContractState, user: ContractAddress, amount: u256) {
            let current_day = get_block_timestamp() / 86400; // Seconds in a day
            let last_trade_day = self.last_trade_day.read(user);
            
            if current_day == last_trade_day {
                let daily_volume = self.daily_trade_limit.read(user);
                let max_daily = self.max_trade_amount.read() * 10; // 10x max trade as daily limit
                assert(daily_volume + amount <= max_daily, Errors::DAILY_LIMIT_EXCEEDED);
            }
        }

        fn _update_daily_limits(ref self: ContractState, user: ContractAddress, amount: u256) {
            let current_day = get_block_timestamp() / 86400;
            let last_trade_day = self.last_trade_day.read(user);
            
            if current_day == last_trade_day {
                let current_volume = self.daily_trade_limit.read(user);
                self.daily_trade_limit.write(user, current_volume + amount);
            } else {
                self.daily_trade_limit.write(user, amount);
                self.last_trade_day.write(user, current_day);
            }
        }

        fn _get_execution_price(self: @ContractState, asset: felt252, amount: u256) -> u256 {
            // Simplified price oracle - in real implementation would call external price feed
            // For now, return a mock price based on asset
            if asset == 'BTC' {
                65000 * 1000000 // $65,000 with 6 decimals
            } else if asset == 'ETH' {
                3200 * 1000000 // $3,200 with 6 decimals
            } else if asset == 'STRK' {
                2 * 1000000 // $2 with 6 decimals
            } else {
                1000000 // $1 default
            }
        }

        fn _update_strategy_performance(
            ref self: ContractState,
            strategy: felt252,
            success: bool,
            amount: u256
        ) {
            let mut stats = self.strategy_performance.read(strategy);
            stats.total_trades += 1;
            
            if success {
                stats.successful_trades += 1;
                stats.total_profit += amount / 100; // Assume 1% profit
            } else {
                stats.total_loss += amount / 200; // Assume 0.5% loss
            }
            
            stats.last_updated = get_block_timestamp();
            self.strategy_performance.write(strategy, stats);
            
            // Calculate success rate in basis points
            let success_rate = (stats.successful_trades * 10000) / stats.total_trades;
            
            self.emit(StrategyPerformanceUpdated {
                strategy,
                total_trades: stats.total_trades,
                success_rate,
                profit_loss: stats.total_profit - stats.total_loss,
            });
        }
    }
}

#[starknet::interface]
trait IAITradeExecutor<TContractState> {
    // Core trading functions
    fn execute_ai_trade(ref self: TContractState, trade_order: AITradeExecutor::TradeOrder) -> bool;
    fn deposit(ref self: TContractState, amount: u256);
    fn withdraw(ref self: TContractState, amount: u256);
    
    // User management
    fn authorize_user(ref self: TContractState, user: ContractAddress);
    fn revoke_user(ref self: TContractState, user: ContractAddress);
    fn set_user_strategy(ref self: TContractState, strategy: felt252);
    
    // Strategy management
    fn enable_strategy(ref self: TContractState, strategy: felt252, fee: u256);
    fn disable_strategy(ref self: TContractState, strategy: felt252);
    
    // View functions
    fn get_balance(self: @TContractState, user: ContractAddress) -> u256;
    fn get_trade_count(self: @TContractState) -> u256;
    fn get_total_volume(self: @TContractState) -> u256;
    fn get_strategy_performance(self: @TContractState, strategy: felt252) -> AITradeExecutor::StrategyStats;
    fn is_strategy_enabled(self: @TContractState, strategy: felt252) -> bool;
    fn is_user_authorized(self: @TContractState, user: ContractAddress) -> bool;
    fn get_user_strategy(self: @TContractState, user: ContractAddress) -> felt252;
    
    // Admin functions
    fn pause_contract(ref self: TContractState);
    fn unpause_contract(ref self: TContractState);
    fn emergency_stop(ref self: TContractState, reason: felt252);
    fn reset_emergency_stop(ref self: TContractState);
    fn update_max_trade_amount(ref self: TContractState, new_amount: u256);
    fn heartbeat(ref self: TContractState);
}