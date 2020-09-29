public with sharing class AccountController {

    @AuraEnabled(cacheable=false)
    public static Integer getNumberOfAllAccounts(){
        Integer count = [SELECT COUNT() FROM Account];
        return count;
    }

    @AuraEnabled(cacheable=false)
    public static List<Account> getAccounts(Integer numOfRecords, Integer numOfRecordsToSkip){
        List<Account> accounts= [SELECT Id, Name FROM Account ORDER BY Name NULLS FIRST LIMIT :numOfRecords OFFSET :numOfRecordsToSkip];
        return accounts;
    }
}
