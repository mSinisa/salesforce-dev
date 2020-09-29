trigger AccountTrigger on Account (before update) {
    AccountTriggerHelper.updateAnnualRevenueInBitcoin(Trigger.new, Trigger.oldMap);
}