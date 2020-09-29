public with sharing class AccountTriggerHelper {
    public static void updateAnnualRevenueInBitcoin(List<Account> updatedAccounts, Map<Id, Account> accOldValues){
        List<Account> accountsToUpdate =  new List<Account>();
        for(Account a : updatedAccounts) {
            if(a.AnnualRevenue != accOldValues.get(a.Id).AnnualRevenue){
                System.debug('here we update');
                accountsToUpdate.add(a);
            } else {
                System.debug('do not update');
            }
        }
        //here we need to send the list of accounts to queable job and update them with value from api call
        AsyncAccountHelper asyncUpdate = new AsyncAccountHelper(accountsToUpdate);
        System.enqueueJob(asyncUpdate);
    }
}