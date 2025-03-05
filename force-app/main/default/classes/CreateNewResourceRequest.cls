public without sharing class CreateNewResourceRequest { 
    @AuraEnabled
    public static resourceWrapper createResourceRequest(Map<string,object> resourceObj, List<Map<string,object>> certificationSkillObj ) {
            String startDate = (String) resourceObj.get('startDate');
            String endDate = (String) resourceObj.get('endDate');
            String hours = (String) resourceObj.get('hours');
            String opxid = (String) resourceObj.get('opxId');
            String recoId = (String) resourceObj.get('recoId');
            String groupVal = (String) resourceObj.get('group');
            String practiceVal = (String) resourceObj.get('practice');
            String regionVal = (String) resourceObj.get('region');
            String oppName = (String)resourceObj.get('oppName');
            
            STRING rrCertification = (string) resourceObj.get('selectedValue');
            STRING rrMinimumRating = (string) resourceObj.get('minimumRating');
            
            String ResourceRoleValue = (string) resourceObj.get('resourceRole');
            String ResourceValue = (string) resourceObj.get('resource');
            String ProjectKeyValue = (string) resourceObj.get('projectKey');
            String BillingKeyValue = (string) resourceObj.get('billingKey');
            String DeliveryRoleValue = (string) resourceObj.get('deliveryRole');
        
            String laborTypeVal = (String) resourceObj.get('laborType');
            String requestPriorityVal = (String) resourceObj.get('requestPriority');
            Boolean billRateDailyRateVal = (Boolean) resourceObj.get('billRateDailyRate');
            Boolean lowCostResourceVal = (Boolean) resourceObj.get('lowCostResource');
            String billingKeyDescriptionVal = (String) resourceObj.get('billingKeyDescription');
            String notes = (String) resourceObj.get('notes');
            String resourceRequestNameVal = (String) resourceObj.get('resourceRequestName');
        
            String preferredSchedule = (string) resourceObj.get('preferredSchedule'); // CR-175

            // start - CR-206
            String reasonForSubcoHire = (string) resourceObj.get('reasonForSubcoHire'); 
            Boolean contractorRequest = resourceObj.get('contractorRequest') != null ? Boolean.valueOf(resourceObj.get('contractorRequest')) : false;
            // end - CR-206
        
            Decimal requestedBillRateVal =0;
            if(String.valueOf(resourceObj.get('requestedBillRate')) != '' && String.valueOf(resourceObj.get('requestedBillRate')) != NULL ){
                requestedBillRateVal = Decimal.valueOf(String.valueOf(resourceObj.get('requestedBillRate')));
            }
            
            Decimal plannedBillRateVal = 0;
            if(String.valueOf(resourceObj.get('plannedBillRate')) != '' && String.valueOf(resourceObj.get('requestedBillRate')) != NULL ){
                plannedBillRateVal = Decimal.valueOf(String.valueOf(resourceObj.get('plannedBillRate')));
            }

            Date startdateValue = Date.valueOf(startDate);
            Date enddateValue = Date.valueOf(endDate);
            Integer hoursValue = Integer.valueOf(hours);
        
            ResourceWrapper rwrap = new ResourceWrapper();

            List<opportunity> opp = [SELECT id from opportunity where Opportunity_ID__c =: opxid or name =: opxid limit 1];
            if(opp.size()>0){
                pse__Resource_Request__c rr = new pse__Resource_Request__c();

                rr.pse__Start_Date__c = startdateValue;
                rr.pse__End_Date__c = enddateValue ; 
                rr.pse__SOW_Hours__c = hoursValue;
                rr.pse__Opportunity__c = opp[0].Id;
                if(regionVal != ''){
                    rr.pse__Region__c = regionVal;
                }

                if(oppName != ''){
                    rr.Opportunity_Name1__c = oppName;
                }

                if(practiceVal != ''){
                    rr.pse__Practice__c = practiceVal;
                }
                
                if(opxid != '' || opxid != null){
                    rr.OPX_ID__c = opxid;
                }
                
                if(groupVal != ''){
                    rr.pse__Group__c = groupVal;
                }
                
                if(ResourceRoleValue != ''){
                    rr.pse__Resource_Role__c = ResourceRoleValue;
                }
                
                if(DeliveryRoleValue != ''){
                    rr.Delivery_Role__c = DeliveryRoleValue;
                }
                if(ResourceValue != ''){
                    rr.pse__Resource__c = ResourceValue;
                }
                if(ProjectKeyValue != ''){
                    rr.Project_Key__c = ProjectKeyValue;
                }
                if(BillingKeyValue != ''){
                    rr.Billing_Key_Text__c = BillingKeyValue;
                }
                
                rr.pse__Requested_Bill_Rate__c = requestedBillRateVal;
                rr.pse__Planned_Bill_Rate__c = plannedBillRateVal;
                
                if(laborTypeVal != ''){
                    rr.Labor_Type__c = laborTypeVal;
                }
                if(requestPriorityVal != ''){
                    rr.pse__Request_Priority__c = requestPriorityVal;
                }
      
                rr.Bill_Rate_is_Daily_Rate__c = billRateDailyRateVal;
                
                rr.Low_Cost_Resource__c = lowCostResourceVal;
                
                if(billingKeyDescriptionVal != ''){
                    rr.Billing_Key_Description__c = billingKeyDescriptionVal;
                }
                    
               
                if(notes != null){
                    rr.pse__Notes__c = notes;
                }
             
                if(resourceRequestNameVal != ''){
                    rr.pse__Resource_Request_Name__c = resourceRequestNameVal;
                }

                // start - CR-175
                if(String.isNotBlank(preferredSchedule)) {
                    rr.pse__Preferred_Schedule__c = preferredSchedule;
                }
                // end - CR-175

                // start - CR-206
                rr.Contractor_Request__c = contractorRequest;
                if(String.isNotBlank(reasonForSubcoHire)) {
                    rr.Reason_for_Subco_Hire__c =  reasonForSubcoHire;
                }
                // end - CR-206

                insert rr ;
                //===================================================================
                if(!certificationSkillObj.isEmpty()){
                    createResourceSkillRequest(rr.id, certificationSkillObj);
                }
                //===================================================================================
                
                rwrap.recoId = rr.Id;
                pse__Resource_Request__c rrRecord =[select id,name from pse__Resource_Request__c where id =: rr.Id limit 1];
                rwrap.name = rrRecord.name;
                rwrap.message = 'success';
                
            }else{
                rwrap.recoId = '';
                rwrap.message = 'Opportunity not found';
            }
            return rwrap;

    }
    
    @AuraEnabled
    public static void createResourceSkillRequest(String resourceRequestId , List<Map<string,object>> certificationSkillObj){
        list<pse__Resource_Skill_Request__c> rsrList = new List<pse__Resource_Skill_Request__c>();
        
        for(integer i=0; i<certificationSkillObj.size(); i++){
            string certificationId = '';
            String minimumRating ='';
            String setId ='';
            Boolean primarySkill = false; // CR-175

            certificationId = String.valueOf(certificationSkillObj[i].get('certificationId'));
            minimumRating = String.valueOf(certificationSkillObj[i].get('minimumRating'));
            setId = String.valueOf(certificationSkillObj[i].get('setId'));
            primarySkill = Boolean.valueOf(certificationSkillObj[i].get('primarySkill')); // CR-175
            
            if(certificationId != '' && minimumRating != ''){
                pse__Resource_Skill_Request__c rsr = new pse__Resource_Skill_Request__c();
                
                if( i != 0){
                    rsr.pse__Is_Primary__c = false;
                }
                if(setId != '') rsr.pse__Skill_Set__c = setId;
                rsr.pse__Skill_Certification__c = certificationId;
                rsr.pse__Minimum_Rating__c = minimumRating;
                rsr.pse__Resource_Request__c = resourceRequestId;
                rsr.pse__Is_Primary__c = primarySkill; // CR-175
                rsrList.add(rsr);
            }
        }
        
        if(rsrList.size()>0){
            insert rsrList;
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static list<picklistOptions> getSkillRatings(){
        List<picklistOptions> optionsList = new List<picklistOptions>();
        
        Schema.DescribeFieldResult fieldResult = pse__Skill_Certification_Rating__c.pse__Rating__c.getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        for( Schema.PicklistEntry f : ple)
        {
            picklistOptions options = new picklistOptions();
            options.label = f.getLabel();
            options.value = f.getValue();
            optionsList.add(options);
        }
        return optionsList;

    }
    
    @AuraEnabled(cacheable=true)
    public static list<picklistOptions> getSkillCertification(string searchValue){
        List<picklistOptions> optionsList = new List<picklistOptions>();
        
        List<pse__Skill__c> scList = [select id,name from pse__Skill__c where name like : searchValue limit 500];
        
        for( pse__Skill__c sc : scList)
        {
            picklistOptions options = new picklistOptions();
            options.label = sc.name;
            options.value = sc.Id;
            optionsList.add(options);
        }
        return optionsList;

    }
    
    @AuraEnabled(cacheable=true)
    public static list<picklistOptions> getSkillSet(string searchValueSet){
        List<picklistOptions> optionsList = new List<picklistOptions>();
        
        List<pse__Skill_Set__c> scList = [select id,name from pse__Skill_Set__c where name like : searchValueSet limit 500];
        
        for( pse__Skill_Set__c sc : scList)
        {
            picklistOptions options = new picklistOptions();
            options.label = sc.name;
            options.value = sc.Id;
            optionsList.add(options);
        }
        return optionsList;

    }
    
    @AuraEnabled
    public static List<pse__SkillSet_Skill__c> getSetOfSkillCertifications(string setId){
        return [select id,pse__Skill_Certification__c,pse__Skill_Set__c,pse__Skill_Set__r.Name,pse__Skill_Certification__r.name from pse__SkillSet_Skill__c where pse__Skill_Set__c =: setId ];
    }

    @AuraEnabled(cacheable=true)
    public static Opportunity getOpportunityRecord(string recoId){
    	return [select id,name, Owner__r.Name, StageName, CloseDate, Deal_Type__c from Opportunity where Opportunity_ID__c =: recoId];
    }

    public class ResourceWrapper{
        @AuraEnabled public string recoId { get; set; }
        @AuraEnabled public string name { get; set; }
        @AuraEnabled public string message { get; set; }
    }
    
    public class picklistOptions{
        @AuraEnabled public string label{ get; set;}
        @AuraEnabled public string value{ get; set;}
    }
}