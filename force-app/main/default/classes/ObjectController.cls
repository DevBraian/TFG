public with sharing class ObjectController {
    @AuraEnabled(cacheable=true)
    public static List<String> getObjects() {
        List<String> objectNames = new List<String>();
        for (Schema.SObjectType obj : Schema.getGlobalDescribe().values()) {
            String objectName = obj.getDescribe().getName();
            // Filtra solo objetos estándar
            if (!obj.getDescribe().isCustom()) {
                objectNames.add(objectName);
            }
        }
        return objectNames;
    }
}