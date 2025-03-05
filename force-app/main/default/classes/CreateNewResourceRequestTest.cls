@isTest
public class CreateNewResourceRequestTest {
    
     public static Psa_Custom_Development__c settings;
    
    @testSetup
    public static void setup(){
        
         settings = Psa_Custom_Development__c.getOrgDefaults();
        disablePsaResourceRequestGetOwnersTrigger(true);
        
         PsaTestHarness harness = new PsaTestHarness();
        User u = harness.newUserSysAdmin(true);
        u.CompanyName = 'VSI';
        Update u;
       
        Id rtId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Customer').getRecordTypeId();
        Account acc = new Account(
            Name = 'TestAccount',
            RecordTypeId = rtId,
            Phone = '87865154877' ,
            CurrencyIsoCode = 'USD',
            Account_Country__c='United States of America',
            ShippingCity = 'NEW YORK',
            ShippingStreet = 'EC',
            Data_Verification_Status__c='Verified'
            
        );
         System.runAs(u) {
        insert acc ; 
        }
        ID conRecId = Schema.SObjectType.Contact.getRecordTypeInfosByName().get('Resource').getRecordTypeId();
        Contact testContact = new Contact() ; 
        testContact.LastName = 'Testlastname';
        testContact.FirstName = 'TestFirstname';
        testContact.CurrencyIsoCode = 'USD' ;
        testContact.Phone = '68794667890' ;
        testContact.Email= 'test@testmail.com';
        testContact.RecordTypeId = conRecId ; 
        testContact.AccountId = acc.Id ;
        
        insert testContact;
        
        Opportunity newOpp = new Opportunity();
        newOpp.Name = 'OPX-0000000001';
        newOpp.CloseDate = system.today()+30;      
        newOpp.AccountId = acc.Id;
        //newOpp.StageName ='Lost';
        newOpp.StageName ='02 - Validate Opportunity';
        newOpp.Forecast_Category__c = 'PipeLine' ; 
        newOpp.CurrencyIsoCode = 'USD' ;
       // newOpp.Win_Loss_Reason__c = 'test';
        newOpp.RecordTypeid = Schema.SObjectType.Opportunity.getRecordTypeInfosByName().get('Standard').getRecordTypeId();
        insert newOpp ;
        
        
        pse__Skill_Set__c skillset = new pse__Skill_Set__c();
        skillset.CurrencyIsoCode = 'USD' ; 
        skillset.Name = 'SearchValue' ; 
        insert skillset ;
        
        Id recTypeId = Schema.SObjectType.pse__Skill__c.getRecordTypeInfosByName().get('Skill').getRecordTypeId();
        pse__Skill__c skill1 = new pse__Skill__c(
            Name = 'Archive-Test1',               // Skill / Certification Name
            pse__Type__c = 'Service Offering',                 // Type
            RecordTypeId = recTypeId,                        // Record Type
            pse__External_Id__c = 'compt000000000015553'     // External ID
        );
        insert skill1;
        
        Sales_Organization__c salesOrg = new Sales_Organization__c();
        salesOrg.Name = 'Sales Org Test';
        insert salesOrg;
        
        pse__Proj__c proj = new pse__Proj__c();
        proj.CurrencyIsoCode = 'USD' ; 
        proj.Name = 'TEST' ;
        proj.pse__Is_Active__c = true;
        proj.pse__Start_Date__c = System.today();
        proj.pse__End_Date__c = System.today() + 7;
        proj.Sales_Organization_Lookup__c = salesOrg.Id;
        insert proj ;
        
        pse__Practice__c testPractice = new pse__Practice__c(
            Name = 'Test Practice', Active__c = true
        );
        insert testPractice;
        User user = [Select ID, Profile.Name from User where Profile.Name = 'System Administrator' and IsActive = true LIMIT 1]; 
        pse__Region__c regtype = new pse__Region__c(Name = 'West', Active__c = true);
        regtype.pse__Region_Head__c = testContact.ID;
        insert regtype;
        
        pse__Grp__c grpA = new pse__Grp__c(
            Name = 'GroupMasterTest', Active__c = true
        );
        insert grpA;
        
        
        
        pse__Permission_Control__c permissioncontrol2 = new pse__Permission_Control__c();
        permissioncontrol2.pse__User__c = user.ID;
        permissioncontrol2.pse__Cascading_Permission__c = true;
        permissioncontrol2.pse__Staffing__c =true;
        permissioncontrol2.pse__Timecard_Entry__c = true;
        permissioncontrol2.pse__Timecard_Ops_Edit__c = true;
        permissioncontrol2.pse__Resource_Request_Entry__c = true;
        permissioncontrol2.pse__Skills_And_Certifications_Entry__c = true;
        permissioncontrol2.pse__Start_Date__c = System.today();
        permissioncontrol2.pse__Region__c = regtype.Id ;
        insert permissioncontrol2 ; 
        
        
        Billing_Key__c bKey = new Billing_Key__c();
        bKey.CurrencyIsoCode = 'USD';
        bKey.Project__c = proj.Id ;
        insert bkey ;
        
    }
    
    
    
    @isTest
    public static void createResourceRequestV1Test() {
        
        Opportunity opp = [Select Id , Name, Opportunity_ID__c from Opportunity LIMIT 1] ; 
        Contact con = [Select Id, lastName from Contact LIMIT 1] ;  
        pse__Proj__c pKey = [Select Id from pse__Proj__c LIMIT 1] ;  
        
        Billing_Key__c bKey = [Select Id  from Billing_Key__c LIMIT 1];
        pse__Skill__c skillSetId = [Select Id FROM pse__Skill__c LIMIT 1] ; 
        
        pse__Practice__c testPractice = [Select Id , Name From pse__Practice__c LIMIT 1 ] ;
        pse__Region__c regtype = [Select Id , Name From pse__Region__c LIMIT 1 ] ;
        pse__Grp__c grpA = [Select Id , Name From pse__Grp__c LIMIT 1 ] ;
        
        
        Map<String, Object> resourceObj = new Map<String, Object>{
            'startDate' => '2022-11-01' ,
                'endDate' => '2022-12-30',
                'hours' => '300',
                'opxId' => opp.Opportunity_ID__c,
                'recoId' => con.Id,
                'practice' => testPractice.Id,
                'region' => regtype.id,
                'percentAllocated' => Decimal.valueOf('100') ,
                'requestedBillRate' => '1550',
                'plannedBillRate' => '1550',
                'billRateDailyRate' => false,
                'percentAllocated' => Decimal.valueOf('100') ,
                'lowCostResource' => false,
                'billingKey' => '00'
                
                };
                    
                    List<Map<String, Object>> certificationSkillObj = new List<Map<String, Object>>{
                        new Map<String, Object>{
                            'certificationId' => skillSetId.Id,
                            'minimumRating' => '4 – Guru',
                                'primarySkill' => true
                                }
                    };
                        User user = [Select ID, Profile.Name from User where Profile.Name = 'System Administrator' and IsActive = true LIMIT 1]; 
        
        // Test method invocation
        Test.startTest();
        System.runAs(user){
            createNewResourceRequest.createResourceRequest(resourceObj, certificationSkillObj);
        }
        Test.stopTest();
    }
    
    //this test class is to cover the else part i.e opportunity Not Found
    @isTest
    static void testCreateResourceRequestV1_OpportunityNotFound() {
        Contact con = [Select Id, lastName from Contact LIMIT 1] ;   
        
        
        
        Map<String, Object> resourceObj = new Map<String, Object>{
            'startDate' =>String.valueOf(System.today())  ,
                'endDate' => String.valueOf(System.today() + 5),
                'hours' => '40',
                'recoId' => con.Id,
                //'region' => 'TestRegion',
                'percentAllocated' => Decimal.valueOf('100') ,
                'requestedBillRate' => '1550',
                'plannedBillRate' => '1550',
                'billingKey' => '00'
                
                };
                    
                    List<Map<String, Object>> certificationSkillObj = new List<Map<String, Object>>();
        
        // Test method invocation
        Test.startTest();
        createNewResourceRequest.createResourceRequest(resourceObj, certificationSkillObj);
        Test.stopTest();
        
        
    }
    
    
    @isTest
    public static void getSkillRatingsTest(){
        Test.startTest();
        createNewResourceRequest.getSkillRatings();
        Test.stopTest();
    }
    
    @isTest
    public static void getSkillCertificationTest(){
        
        Test.startTest();
        createNewResourceRequest.getSkillCertification('Archive-Test1');
        Test.stopTest(); 
    }
    
    @isTest
    public static void getSkillSetTest(){
        List<pse__Skill_Set__c> psSkill = [select id from pse__Skill_Set__c limit 1];
        List<opportunity> oppList = [select id,Opportunity_ID__c from opportunity Where Opportunity_ID__c != NuLL limit 1];
        Test.startTest();
        createNewResourceRequest.getSkillSet('SearchValue');
        createNewResourceRequest.getSetOfSkillCertifications(psSkill[0].id);
        createNewResourceRequest.getOpportunityRecord(oppList[0].Opportunity_ID__c);
        Test.stopTest(); 
    }
    
        
    // sets a specific custom setting field
    private static void disablePsaResourceRequestGetOwnersTrigger (Boolean isEnabled){ 
      settings.Disable_PsaResourceRequest_GetOwners__c = isEnabled;
      upsert settings;
    }
    
    
}