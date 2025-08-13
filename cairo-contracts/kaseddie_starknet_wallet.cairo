#[starknet::contract]
mod KaseddieWallet {
    use starknet::{ContractAddress, get_caller_address};

    #[storage]
    struct Storage {
        balances: LegacyMap<ContractAddress, u256>,
        investments: LegacyMap<(ContractAddress, u32), u256>,
        profits: LegacyMap<ContractAddress, u256>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        Deposit: Deposit,
        Withdraw: Withdraw,
        Investment: Investment,
    }

    #[derive(Drop, starknet::Event)]
    struct Deposit {
        user: ContractAddress,
        amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct Withdraw {
        user: ContractAddress,
        amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct Investment {
        user: ContractAddress,
        strategy_id: u32,
        amount: u256,
    }

    #[external(v0)]
    fn deposit(ref self: ContractState, amount: u256) {
        let caller = get_caller_address();
        let current = self.balances.read(caller);
        self.balances.write(caller, current + amount);
        self.emit(Deposit { user: caller, amount });
    }

    #[external(v0)]
    fn withdraw(ref self: ContractState, amount: u256) {
        let caller = get_caller_address();
        let current = self.balances.read(caller);
        assert(current >= amount, 'Insufficient balance');
        self.balances.write(caller, current - amount);
        self.emit(Withdraw { user: caller, amount });
    }

    #[external(v0)]
    fn invest(ref self: ContractState, strategy_id: u32, amount: u256) {
        let caller = get_caller_address();
        let balance = self.balances.read(caller);
        assert(balance >= amount, 'Insufficient balance');
        
        self.balances.write(caller, balance - amount);
        let current_investment = self.investments.read((caller, strategy_id));
        self.investments.write((caller, strategy_id), current_investment + amount);
        
        self.emit(Investment { user: caller, strategy_id, amount });
    }

    #[external(v0)]
    fn get_balance(self: @ContractState, user: ContractAddress) -> u256 {
        self.balances.read(user)
    }

    #[external(v0)]
    fn get_investment(self: @ContractState, user: ContractAddress, strategy_id: u32) -> u256 {
        self.investments.read((user, strategy_id))
    }
}