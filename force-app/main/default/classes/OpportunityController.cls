public with sharing class OpportunityController {
    @AuraEnabled
    public static String createOpportunities(List<Id> accountIds, String closeDate, String stage, Decimal amount){
        List<Opportunity> oppsTocreate = new List<Opportunity>();

        for(Account a : [SELECT Id, Name FROM Account WHERE Id IN :accountIds]){
            Opportunity opp = new Opportunity();
            opp.Amount = amount;
            opp.AccountId = a.Id;
            opp.StageName = stage;
            opp.CloseDate = Date.valueOf(closeDate);
            opp.Name = 'New auto opportunity create for ' + a.Name;
            oppsTocreate.add(opp);
        }

        List<Database.SaveResult> results = Database.insert(oppsToCreate, false);
        return JSON.serialize(results);
    }
}
