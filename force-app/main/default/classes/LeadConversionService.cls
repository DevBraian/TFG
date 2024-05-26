public class LeadConversionService {

/*

    @InvocableMethod(description='Convert Leads to Opportunities')
    public static void convertLeads(List<Id> leadIds) {
        List<Lead> leadsToUpdate = [SELECT Id, IsConverted FROM Lead WHERE Id IN :leadIds AND IsConverted = false];
        List<Database.LeadConvert> leadConverts = new List<Database.LeadConvert>();

        for (Lead lead : leadsToUpdate) {
            Database.LeadConvert lc = new Database.LeadConvert();
            lc.setLeadId(lead.Id);
            lc.setDoNotCreateOpportunity(false); // Change to true if you want to prevent opportunity creation
            leadConverts.add(lc);
        }

        if (!leadConverts.isEmpty()) {
            List<Database.LeadConvertResult> convertResults = Database.convertLead(leadConverts);
            // Add any additional logic you want to perform after lead conversion
        }
    }
    
  */
  
  @InvocableMethod   
    public static void LeadAssign(List<Id> LeadIds)  
    {         
        LeadStatus CLeadStatus= [SELECT Id, MasterLabel FROM LeadStatus WHERE IsConverted=true Limit 1];    
        List<Database.LeadConvert> MassLeadconvert = new List<Database.LeadConvert>();    
        for(id currentlead: LeadIds){                
            Database.LeadConvert Leadconvert = new Database.LeadConvert();    
            Leadconvert.setLeadId(currentlead);                               
            Leadconvert.setConvertedStatus(CLeadStatus.MasterLabel);             
            //Leadconvert.setDoNotCreateOpportunity(TRUE); //Remove this line if you want to create an opportunity from Lead Conversion  
            MassLeadconvert.add(Leadconvert);    
        }                  
        if (!MassLeadconvert.isEmpty())
        {            
            List<Database.LeadConvertResult> lcr = Database.convertLead(MassLeadconvert);       
        }    
    }   

}