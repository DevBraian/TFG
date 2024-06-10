public with sharing class ToolingAPIUtility {
    public static final String endpoint = '/services/data/v51.0/tooling/query/?q=';
    public static final String namedCredential = 'myOrgNC'; //Nombre del Named Credential

    public static final String endpoint1 = '/services/data/v56.0/query?q=';
    public static final String query1 = 'SELECT Id, Name, Type, LastReferencedDate  FROM RecentlyViewed ORDER BY LastViewedDate DESC LIMIT 10';
    

    
    @AuraEnabled(cacheable=true)
    public static String queryToolingAPI(String query) {
        
        String urlString = endpoint + EncodingUtil.urlEncode(query, 'UTF-8');
        String baseUrl = 'callout:' + namedCredential;

        HttpRequest request = new HttpRequest();
        
        request.setEndpoint(baseUrl + urlString);
        request.setMethod('GET');
        request.setHeader('Content-Type', 'application/json');
        
        Http http = new Http();
        HttpResponse response = http.send(request);
        
        return response.getBody();
    }

    @AuraEnabled(cacheable=true)
    public static String queryRecentObject() {
        
        String urlString = endpoint1 + EncodingUtil.urlEncode(query1, 'UTF-8');
        String baseUrl = 'callout:' + namedCredential;

        HttpRequest request = new HttpRequest();
        
        request.setEndpoint(baseUrl + urlString);
        request.setMethod('GET');
        request.setHeader('Content-Type', 'application/json');
        
        Http http = new Http();
        HttpResponse response = http.send(request);
        
        return response.getBody();
    }

}