use starknet::{ContractAddress, contract_address_const};
use snforge_std::{declare, ContractClassTrait, start_prank, stop_prank, CheatTarget};

use super::executor::{AITradeExecutor, IAITradeExecutorDispatcher, IAITradeExecutorDispatcherTrait};

fn OWNER() -> ContractAddress {
    contract_address_const::<'owner'>()
}

fn AI_ORACLE() -> ContractAddress {
    contract_address_const::<'ai_oracle'>()
}

fn USER() -> ContractAddress {
    contract_address_const::<'user'>()
}

fn deploy_contract() -> IAITradeExecutorDispatcher {
    let contract = declare("AITradeExecutor");
    let max_trade_amount: u256 = 1000000; // 1M units
    
    let constructor_calldata = array![
        OWNER().into(),
        AI_ORACLE().into(),
        max_trade_amount.low.into(),
        max_trade_amount.high.into()
    ];
    
    let contract_address = contract.deploy(@constructor_calldata).unwrap();
    IAITradeExecutorDispatcher { contract_address }
}

#[test]
fn test_deployment() {
    let contract = deploy_contract();
    
    // Test initial state
    assert(contract.get_trade_count() == 0, 'Initial trade count should be 0');
    assert(contract.get_total_volume() == 0, 'Initial volume should be 0');
    
    // Test strategy initialization
    assert(contract.is_strategy_enabled('momentum'), 'Momentum should be enabled');
    assert(contract.is_strategy_enabled('ai_prediction'), 'AI prediction should be enabled');
    assert(contract.is_strategy_enabled('arbitrage'), 'Arbitrage should be enabled');
}

#[test]
fn test_user_authorization() {
    let contract = deploy_contract();
    
    // Only owner can authorize users
    start_prank(CheatTarget::One(contract.contract_address), OWNER());
    contract.authorize_user(USER());
    stop_prank(CheatTarget::One(contract.contract_address));
    
    assert(contract.is_user_authorized(USER()), 'User should be authorized');
}

#[test]
fn test_deposit_withdraw() {
    let contract = deploy_contract();
    let deposit_amount: u256 = 1000;
    
    start_prank(CheatTarget::One(contract.contract_address), USER());
    
    // Test deposit
    contract.deposit(deposit_amount);
    assert(contract.get_balance(USER()) == deposit_amount, 'Balance should match deposit');
    
    // Test withdraw
    let withdraw_amount: u256 = 500;
    contract.withdraw(withdraw_amount);
    assert(contract.get_balance(USER()) == deposit_amount - withdraw_amount, 'Balance should be updated');
    
    stop_prank(CheatTarget::One(contract.contract_address));
}

#[test]
fn test_strategy_management() {
    let contract = deploy_contract();
    
    start_prank(CheatTarget::One(contract.contract_address), OWNER());
    
    // Test disable strategy
    contract.disable_strategy('momentum');
    assert(!contract.is_strategy_enabled('momentum'), 'Strategy should be disabled');
    
    // Test enable strategy with custom fee
    let custom_fee: u256 = 200; // 2%
    contract.enable_strategy('momentum', custom_fee);
    assert(contract.is_strategy_enabled('momentum'), 'Strategy should be enabled');
    
    stop_prank(CheatTarget::One(contract.contract_address));
}

#[test]
fn test_trade_execution() {
    let contract = deploy_contract();
    let deposit_amount: u256 = 10000;
    let trade_amount: u256 = 1000;
    
    // Setup: authorize user and deposit funds
    start_prank(CheatTarget::One(contract.contract_address), OWNER());
    contract.authorize_user(USER());
    stop_prank(CheatTarget::One(contract.contract_address));
    
    start_prank(CheatTarget::One(contract.contract_address), USER());
    contract.deposit(deposit_amount);
    
    // Create trade order
    let trade_order = AITradeExecutor::TradeOrder {
        user: USER(),
        asset: 'BTC',
        amount: trade_amount,
        direction: 'buy',
        strategy: 'momentum',
        timestamp: 1234567890,
        expected_price: 65000000000, // $65,000 with 6 decimals
        slippage_tolerance: 500, // 5%
    };
    
    // Execute trade
    let success = contract.execute_ai_trade(trade_order);
    assert(success, 'Trade should execute successfully');
    
    // Check updated state
    assert(contract.get_trade_count() == 1, 'Trade count should be 1');
    assert(contract.get_total_volume() == trade_amount, 'Volume should match trade amount');
    
    stop_prank(CheatTarget::One(contract.contract_address));
}

#[test]
#[should_panic(expected: ('User not authorized',))]
fn test_unauthorized_trade() {
    let contract = deploy_contract();
    
    start_prank(CheatTarget::One(contract.contract_address), USER());
    
    let trade_order = AITradeExecutor::TradeOrder {
        user: USER(),
        asset: 'BTC',
        amount: 1000,
        direction: 'buy',
        strategy: 'momentum',
        timestamp: 1234567890,
        expected_price: 65000000000,
        slippage_tolerance: 500,
    };
    
    // This should fail because user is not authorized
    contract.execute_ai_trade(trade_order);
    
    stop_prank(CheatTarget::One(contract.contract_address));
}

#[test]
#[should_panic(expected: ('Insufficient balance',))]
fn test_insufficient_balance_trade() {
    let contract = deploy_contract();
    
    // Setup: authorize user but don't deposit enough funds
    start_prank(CheatTarget::One(contract.contract_address), OWNER());
    contract.authorize_user(USER());
    stop_prank(CheatTarget::One(contract.contract_address));
    
    start_prank(CheatTarget::One(contract.contract_address), USER());
    contract.deposit(100); // Small deposit
    
    let trade_order = AITradeExecutor::TradeOrder {
        user: USER(),
        asset: 'BTC',
        amount: 1000, // Larger than balance
        direction: 'buy',
        strategy: 'momentum',
        timestamp: 1234567890,
        expected_price: 65000000000,
        slippage_tolerance: 500,
    };
    
    // This should fail due to insufficient balance
    contract.execute_ai_trade(trade_order);
    
    stop_prank(CheatTarget::One(contract.contract_address));
}

#[test]
fn test_emergency_stop() {
    let contract = deploy_contract();
    
    start_prank(CheatTarget::One(contract.contract_address), OWNER());
    
    // Trigger emergency stop
    contract.emergency_stop('security_breach');
    
    // Reset emergency stop
    contract.reset_emergency_stop();
    
    stop_prank(CheatTarget::One(contract.contract_address));
}

#[test]
fn test_pause_unpause() {
    let contract = deploy_contract();
    
    start_prank(CheatTarget::One(contract.contract_address), OWNER());
    
    // Test pause
    contract.pause_contract();
    
    // Test unpause
    contract.unpause_contract();
    
    stop_prank(CheatTarget::One(contract.contract_address));
}

#[test]
fn test_strategy_performance_tracking() {
    let contract = deploy_contract();
    let deposit_amount: u256 = 10000;
    let trade_amount: u256 = 1000;
    
    // Setup user and execute trade
    start_prank(CheatTarget::One(contract.contract_address), OWNER());
    contract.authorize_user(USER());
    stop_prank(CheatTarget::One(contract.contract_address));
    
    start_prank(CheatTarget::One(contract.contract_address), USER());
    contract.deposit(deposit_amount);
    
    let trade_order = AITradeExecutor::TradeOrder {
        user: USER(),
        asset: 'BTC',
        amount: trade_amount,
        direction: 'buy',
        strategy: 'momentum',
        timestamp: 1234567890,
        expected_price: 65000000000,
        slippage_tolerance: 500,
    };
    
    contract.execute_ai_trade(trade_order);
    
    // Check strategy performance
    let stats = contract.get_strategy_performance('momentum');
    assert(stats.total_trades == 1, 'Should have 1 trade');
    assert(stats.successful_trades == 1, 'Should have 1 successful trade');
    
    stop_prank(CheatTarget::One(contract.contract_address));
}