import { LightningElement, track, api, wire} from 'lwc';
import createResourceRequest from '@salesforce/apex/CreateNewResourceRequest.createResourceRequest';
import getOpportunityRecord from '@salesforce/apex/PSAPlatformUtility.getOpportunityRecord';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CloseActionScreenEvent } from 'lightning/actions';
import { NavigationMixin } from 'lightning/navigation';

import { getRecord } from 'lightning/uiRecordApi';
import USER_ID from '@salesforce/user/Id';
import USERPROFILE_ID from '@salesforce/schema/User.ProfileId';
import USERPROFILE_NAME from '@salesforce/schema/User.Profile.Name';

export default class CreateNewResourceRequest extends NavigationMixin(LightningElement) {
    userId = USER_ID;
    currentUserProfileName
    userProfiles = ['System Administrator','PSA Admin', 'NEW BUSINESS OPERATIONS', 'NEW DELIVERY OWNER', 'NEW PROJECT MANAGEMENT', 'NEW RESOURCE MANAGEMENT', 'PROJECT MANAGEMENT', 'BUSINESS OPERATIONS', 'RESOURCE MANAGEMENT'];

    opxId = '';
    startDate ='';
    endDate ='';
    hours ='';
    region ='';
    practice ='';
    group ='';
    resourceRole ='';
    deliveryRole ='';
    resource ='';
    projectKey ='';
    billingKey ='00';

    laborType = '';
    requestPriority ='';
    billRateDailyRate =false;
    lowCostResource =false;
    billingKeyDescription ='';
    notes
    primarySkillCertification
    primarySkillMinimumRating
    resourceRequestName
    requestedBillRate
    plannedBillRate
    minimumRating

    oppId ='';
    oppOwnerValue ='';
    oppNameValue ='';
    oppoStageName ='';
    oppCloseDate ='';
    oppDealType ='';

    @api isHome = false;
    isSpinner = true;

    // picklist varibales
    picklistOrdered;
    searchResults;
    selectedSearchResult;
    selectedValue='';
    searchValue;

    @track isShowModal = true;

    jsonObject = {
        oppName:'',
        startDate: '',
        endDate: '',
        hours: '',
        opxId: '',
        recoId: '',
        group: '',
        practice: '',
        region: '',
        resourceRole:'',
        deliveryRole:'',
        resource:'',
        projectKey:'',
        billingKey:'00',
        laborType:'',
        requestPriority:'',
        billRateDailyRate:false,
        lowCostResource:false,
        billingKeyDescription:'',
        notes:'',
        primarySkillCertification:'',
        primarySkillMinimumRating:'',
        resourceRequestName:'',
        requestedBillRate:'',
        plannedBillRate:'',
        minimumRating:'',
        selectedValue:'',
        contractorRequest: '', // CR-206
        reasonForSubcoHire: '', // CR-206
    };

    @api recordId;
    
    connectedCallback() {
        console.log('resource request 123@@... ');
        this.opxId = '';
        this.startDate ='';
        this.endDate ='';
        this.hours ='';
        this.region ='';
        this.practice ='';
        this.group ='';
        this.resourceRole ='';
        this.deliveryRole ='';
        this.resource ='';
        this.projectKey ='';
        this.billingKey ='00';

        this.laborType = '';
        this.requestPriority = '';
        this.billRateDailyRate = false;
        this.lowCostResource = false;
        this.billingKeyDescription = '';
        this.notes = '';
        this.primarySkillCertification = '';
        this.primarySkillMinimumRating = '';
        this.resourceRequestName = '';
        this.requestedBillRate = '';
        this.plannedBillRate = '';

        this.oppId ='';
        this.oppOwnerValue ='';
        this.oppNameValue ='';
        this.oppoStageName ='';
        this.oppCloseDate ='';
        this.oppDealType ='';
        this.minimumRating='';
        this.selectedValue='';
    }

    handleOnLoad(){
        this.isSpinner = false;
    }

    @wire(getRecord, { recordId: USER_ID, fields: [USERPROFILE_ID,USERPROFILE_NAME]}) 
    userDetails({error, data}) {
        if (data) {
            console.log('data!!! '+JSON.stringify(data));
            this.currentUserProfileName = data.fields.Profile.displayValue;
            console.log('currentUserProfileName@@@@@...   '+this.currentUserProfileName);
            // ========================================================
            if(!this.userProfiles.includes(this.currentUserProfileName)){
                this.toastMassage('Error','error','You do not have access to use this functionality.');
                setTimeout(() => {
                    this.hideModalBox();
                }, "4000");
            }
        } else if (error) {
            console.log('else wire')
        }
    }

    @wire(getOpportunityRecord, { recoId: "$opxId" })
    opportunity({ error, data }) {
        if (data) {
            console.log('data @@@ '+JSON.stringify(data));
            this.oppId = data.Id;
            this.oppNameValue = data.Name;
            this.oppOwnerValue = data.Owner__r.Name; 
            this.oppoStageName = data.StageName;        
            this.oppCloseDate = data.CloseDate;       
            this.oppDealType = data.Deal_Type__c;   
        } else if (error) {
            console.log('error @@@ '+JSON.stringify(error));
              if(error.body.message.includes('You do not have access')){
            console.log('@@ error -- '+JSON.stringify(error));
                const evt =  new ShowToastEvent({
                    title: error.statusText,
                    message: error.body.message,
                    variant: 'error'
                });
        this.dispatchEvent(evt);  
            }                      
            this.oppOwnerValue = '';
            this.oppNameValue = '';


        }
        
    }

    certificationDataList =[];
    // child method
    skillcertificationhandler(event){
        let temp=[];
        temp.push(event.detail);
        this.certificationDataList = temp;
    }

    //resource request "test" was created.
    handleSave(){
        const allValid = this.opxId != '' && this.startDate != '' && this.endDate != '' && this.hours!='' && this.billingKey!='' && this.region && this.resourceRole!='' && this.deliveryRole!= '' && this.practice!= '';
        // ===========================================================================================================================
        let tempResourceRequestData =[];
        let allSkillIsFilled = true; 
        if(this.certificationDataList.length > 0){
            this.certificationDataList[0].skillCertificationData.forEach(ele => {
                if(this.certificationDataList[0].selectedIds.includes(ele.id)){
                    let tempObj ={"certificationId": ele.id, "minimumRating": ele.minimumRating, "setId": ''};
                    tempResourceRequestData.push(tempObj);
                }
            })
            this.certificationDataList[0].skillCertificationDataSet.forEach(ele => {
                ele.data.forEach(childEle => {
                    if(ele.selectedIds.includes(childEle.id)){
                        let tempObj ={"certificationId": childEle.id, "minimumRating": childEle.minimumRating, "setId": ele.setId};
                        tempResourceRequestData.push(tempObj);
                    }
                })
            })
            // ============================================================================================================================
            
            tempResourceRequestData.forEach(ele => {
                if(tempResourceRequestData.length == 1 && ele.minimumRating == '' && ele.certificationId == ''){
                    allSkillIsFilled = true;
                }else if(tempResourceRequestData.length == 1 && ((ele.minimumRating != '' && ele.certificationId == '') || (ele.minimumRating == '' && ele.certificationId != '') )){
                    allSkillIsFilled = false;
                }else if(tempResourceRequestData.length > 1 && ((ele.minimumRating != '' && ele.certificationId == '') || (ele.minimumRating == '' && ele.certificationId != '') )){
                    allSkillIsFilled = false;
                }
            })
        }

        if (allValid){
            if(allSkillIsFilled){
                this.isSpinner = true;
                this.jsonObject['oppName'] = this.oppNameValue;
                createResourceRequest({resourceObj: this.jsonObject, certificationSkillObj: tempResourceRequestData})
                .then((result) => {
                    console.log('resulttttt success!!!!!  -- '+JSON.stringify(result));
                    if(result.message == 'success'){
                        let baseurl = window.location.origin; 
                        
                        const event = new ShowToastEvent({
                            title: 'Success',
                            variant: 'success',
                            message: '{0} {1} was created.',
                            messageData: [
                                'Resource Request',
                                {
                                    url: baseurl +'/'+result.recoId,
                                    label: result.name,
                                },
                            ],
                        });
                        this.dispatchEvent(event);

                        this.dispatchEvent(new CloseActionScreenEvent());
                        // =======================
                        this.redirectToCreatedRecord('pse__Resource_Request__c', result.recoId);
                    }else{
                        this.isSpinner = false;
                        this.toastMassage('Error','error','Opportunity not found related to OPX ID.');
                        this.dispatchEvent(new CloseActionScreenEvent());
                    }
                })
                .catch((e) => {
                    this.isSpinner = false;
                    console.log('e.... '+JSON.stringify(e));
                    // let msg = e.body.message;                
                    // msg =  (e.body.pageErrors != null && Object.values(e.body.pageErrors)[0].statusCode != null &&  Object.values(e.body.pageErrors)[0].statusCode == 'FIELD_CUSTOM_VALIDATION_EXCEPTION') ? Object.values(e.body.pageErrors)[0].message : msg;
                    let msg = this.findErrorMessage(e);
                    console.log('msg -- '+msg);
                    this.toastMassage('Error','error',msg);

                });
            }else{
                this.toastMassage('Error','error','Skill/Certification or Minimum Rating is empty');
            }       
        } else {
            this.toastMassage('Error','error','Please fill out all required fields.');
        } 
    }

    recordEditHandler(event){
        console.log('recordEditHandler-- '+event.target.name+' - '+event.target.value);
        this[event.target.name] = event.target.value;
        this.jsonObject[event.target.name] = event.target.value;
    }
    
    hideModalBox(){
        this.isShowModal = false;
        if(this.isHome == true){
            window.location.href = '/lightning/page/home';
        }else{
            const objectApiName = 'pse__Resource_Request__c';
            const listViewUrl = `/lightning/o/${objectApiName}/list`;
            window.location.href = listViewUrl;
        }
    }

    redirectToCreatedRecord(objectApiName, recordId){
        setTimeout(() => {
            this.isShowModal = false;
            const listViewUrl = `/lightning/r/${objectApiName}/${recordId}/view`;
            window.location.href = listViewUrl;
        }, "4000");
    }

    toastMassage(title,variant,message){
        const event = new ShowToastEvent({
            title: title,
            variant: variant,
            message: message,
        });
        this.dispatchEvent(event);
    }

    findErrorMessage(obj) {
        for (let key in obj) {
            if (key === 'message') {
                return obj[key];
            }
            if (typeof obj[key] === 'object') {
                let result = this.findErrorMessage(obj[key]);
                if (result) {
                    return result;
                }
            }
        }
        return null; // If no "message" key is found
    }
}