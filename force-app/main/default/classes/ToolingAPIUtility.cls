public with sharing class ToolingAPIUtility {
    public static final String endpoint = '/services/data/v51.0/tooling/query/?q=';
    public static final String namedCredential = 'myOrgNC'; // Reemplaza con el nombre de tu Named Credential

    
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
}