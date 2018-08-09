public class ShowHistory {
	@AuraEnabled
    public static List<Calc_Hist__c> getHistory() {
        return [SELECT Formula__c, Result__c FROM Calc_Hist__c];
    }
    
    @AuraEnabled
    public static Calc_Hist__c saveHistory(Calc_Hist__c hist) {
        
        upsert hist;
        return hist;
    }
    
    @AuraEnabled
    public static List<Calc_Hist__c> removeHistory() {
        List<Calc_Hist__c> toRemove = [SELECT Formula__c, Result__c FROM Calc_Hist__c];
        delete toRemove;
        List<Calc_Hist__c> emptyList = [SELECT Formula__c, Result__c FROM Calc_Hist__c];
        return emptyList;
    }

}