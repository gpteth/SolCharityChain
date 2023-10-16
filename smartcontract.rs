#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

#[ink::contract]
mod charity_chain {
    use ink_prelude::string::String;
    use ink_storage::collections::{HashMap as StorageHashMap, Vec as StorageVec};
    use ink_storage::traits::{PackedLayout, SpreadLayout};

    #[ink(storage)]
    pub struct CharityChain {
        donations: StorageVec<Donation>,
        projects: StorageVec<Project>,
        balances: StorageHashMap<AccountId, Balance>,
    }

    #[derive(Debug, Clone, scale::Encode, scale::Decode, PackedLayout, SpreadLayout)]
    pub struct Donation {
        from: AccountId,
        amount: Balance,
        timestamp: Timestamp,
    }

    #[derive(Debug, Clone, scale::Encode, scale::Decode, PackedLayout, SpreadLayout)]
    pub struct Project {
        title: String,
        description: String,
        target_amount: Balance,
        current_amount: Balance,
        is_completed: bool,
    }

    #[derive(Debug, Clone, scale::Encode, scale::Decode, PackedLayout, SpreadLayout)]
    pub struct Balance(u64);

    impl CharityChain {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                donations: StorageVec::new(),
                projects: StorageVec::new(),
                balances: StorageHashMap::new(),
            }
        }

        #[ink(message)]
        pub fn donate(&mut self, amount: Balance) {
            let caller = self.env().caller();
            self.update_balance(caller, amount);
            self.donations.push(Donation {
                from: caller,
                amount,
                timestamp: self.env().block_timestamp(),
            });
        }

        #[ink(message)]
        pub fn create_project(&mut self, title: String, description: String, target_amount: Balance) {
            let caller = self.env().caller();
            self.projects.push(Project {
                title,
                description,
                target_amount,
                current_amount: Balance(0),
                is_completed: false,
            });
        }

        #[ink(message)]
        pub fn contribute_to_project(&mut self, project_index: u32, amount: Balance) {
            let caller = self.env().caller();
            let project = self.projects.get_mut(project_index as usize).unwrap();
            project.current_amount.0 += amount.0;
            self.update_balance(caller, -amount);
            self.check_project_completion(project_index);
        }

        #[ink(message)]
        pub fn get_donations(&self) -> Vec<Donation> {
            self.donations.clone()
        }

        #[ink(message)]
        pub fn get_projects(&self) -> Vec<Project> {
            self.projects.clone()
        }

        #[ink(message)]
        pub fn get_project_details(&self, project_index: u32) -> Option<Project> {
            self.projects.get(project_index as usize).cloned()
        }

        fn update_balance(&mut self, account: AccountId, amount: Balance) {
            let balance = self.balances.entry(account).or_insert(Balance(0));
            balance.0 = balance.0 + amount.0;
        }

        fn check_project_completion(&mut self, project_index: u32) {
            let project = self.projects.get_mut(project_index as usize).unwrap();
            if project.current_amount.0 >= project.target_amount.0 {
                project.is_completed = true;
            }
        }

        #[ink(message)]
        pub fn finalize_project(&mut self, project_index: u32) {
            let caller = self.env().caller();
            let project = self.projects.get(project_index as usize).unwrap();

            // Ensure the project is completed before finalizing
            assert!(project.is_completed, "Project is not completed yet");

            // Transfer the funds to the project creator
            let project_creator_balance = self.balances.get_mut(&project.from).unwrap();
            project_creator_balance.0 += project.target_amount.0;

            // Reset the project's current amount and set it as completed
            let project = self.projects.get_mut(project_index as usize).unwrap();
            project.current_amount.0 = 0;
            project.is_completed = false;

            // Emit an event or perform any other desired actions
        }
    }
}
