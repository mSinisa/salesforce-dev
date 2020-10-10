public with sharing class AsyncAccountHelper implements Queueable, Database.AllowsCallouts {
    
    private List<Account> accounts;

    public AsyncAccountHelper(List<Account> accounts){
        this.accounts = accounts;
    }

    public void execute(QueueableContext context) {
        System.debug('queable class abt to start');
        Decimal bitcoinValueInUSD = BitcoinConverter.getValueOfOneBitcoinInUSD();
        List<Account> accountsToUpdate = new List<Account>();
        for(Account a : this.accounts) {
            a.Annual_Revenue_in_Bitcoin__c = a.AnnualRevenue / bitcoinValueInUSD;
            accountsToUpdate.add(a);
        }
        update(accountsToUpdate);
    }
}
