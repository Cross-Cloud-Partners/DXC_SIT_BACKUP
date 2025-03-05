import { LightningElement,wire,api,track } from 'lwc';
import getSkillCertification from '@salesforce/apex/CreateNewResourceRequest.getSkillCertification';
import getSkillSet from '@salesforce/apex/CreateNewResourceRequest.getSkillSet';
import getSkillRatings from '@salesforce/apex/CreateNewResourceRequest.getSkillRatings';
import getSetOfSkillCertifications from '@salesforce/apex/CreateNewResourceRequest.getSetOfSkillCertifications';
import { ShowToastEvent } from "lightning/platformShowToastEvent";



export default class AddCertificationSkill extends LightningElement {
    isShowModal = false

    // skill/certification
    picklistOrdered;
    searchResults;
    selectedSearchResult;
    searchValue;
    @api selectedValueVisible ='';
    // @api selectedValue='';

    // skill set
    picklistOrderedSet;
    searchResultsSet;
    selectedSearchResultSet;
    searchValueSet;
    @api selectedValueVisibleSet='';
    isSkillSetCertification = true;

    allSectionClosed = true;

    // get isSkillSetCertificationGettr(){
    //     console.log('isSkillSetCertificationGettr called')
    //     return this.isSkillSetCertification ? true : false;
    // } 

    ratingOptions =[];

    skillCertificationData=[];
    skillCertificationDataSet=[];

    isSkillVisible = false;
    isSpinner = false;
    
    @api skillId;
    @api minimumRating ='';

    // skill / certification columns
    actions = [
        { label: 'Remove Skill', name: 'Remove Skill' },
    ];
    skillColumns = [
        { label: 'Skill / Certification', fieldName: 'name' },
        // { label: 'Minimum Rating', fieldName: 'website', type: 'url', editable: true },
        {
            label: 'Minimum Rating', fieldName: 'minimumRating', type: 'picklistColumn', editable: true, typeAttributes: {
                placeholder: 'Choose Type', options: { fieldName: 'pickListOptions' }, 
                value: { fieldName: 'minimumRating' }, // default value for picklist,
                context: { fieldName: 'Id' } // binding account Id with context variable to be returned back
            },
            
        },
        {
            type: 'action',
            typeAttributes: { rowActions: this.actions },
        },
       
    ];

    // Skill set Columns
    actionsSet = [
        { label: 'Remove Skill Set', name: 'Remove Skill Set' },
    ];
    skillSetColumns = [
        { label: 'Skill / Certification', fieldName: 'name' },
        // { label: 'Minimum Rating', fieldName: 'website', type: 'url', editable: true },
        {
            label: 'Minimum Rating', fieldName: 'minimumRating', type: 'picklistColumn', editable: true, typeAttributes: {
                placeholder: 'Choose Type', options: { fieldName: 'pickListOptions' }, 
                value: { fieldName: 'minimumRating' }, // default value for picklist,
                context: { fieldName: 'Id' } // binding account Id with context variable to be returned back
            },
            
        },
        {
            type: 'action',
            typeAttributes: { rowActions: this.actionsSet },
        },
       
    ];

    skillCertificationOptions=[
                {"label": 'Skill/Certification' , "value":'Skill/Certification'},
                {"label": 'Skill Set' , "value":'Skill Set'}

            ]

    handleClick(event){
        this.isShowModal = true
    }


    hideModalBox(){
        console.log('hideModalBox !!!!!!!!!-----');

        this.isShowModal = false;
       
    }
    scValue = 'Skill/Certification';
    skillCertificationChanger(event){
        console.log('skillCertificationChanger-- '+event.detail.value);
        console.log('isSkillSetCertification '+this.isSkillSetCertification);
        this.scValue = event.detail.value;
        this.isSpinner = true
        if( this.scValue == 'Skill/Certification'){
            this.isSkillSetCertification = true;
        }else if(this.scValue ==  'Skill Set'){
            this.isSkillSetCertification = false;
        }

        setTimeout(() => {
            this.isSpinner = false;
        }, "1000");
        console.log('isSkillSetCertification 2 '+this.isSkillSetCertification);
    }

    @wire (getSkillCertification, { searchValue: "$searchValue" })
    skillCertification({error, data }){
        if(data){
            console.log('@@ getSkill certification -- '+JSON.stringify(data));
            this.picklistOrdered = data;

            console.log('picklistOrdered '+JSON.stringify(this.picklistOrdered));
        }else if(error){
            console.log('erro skill '+JSON.stringify(error));
        }
    }

    @wire (getSkillSet, { searchValueSet: "$searchValueSet" })
    skillCertificationSet({error, data }){
        if(data){
            console.log('@@ Skill set  -- '+JSON.stringify(data));
            this.picklistOrderedSet = data;

            console.log('picklistOrdered '+JSON.stringify(this.picklistOrderedSet));
        }else if(error){
            console.log('erro skill '+JSON.stringify(error));
        }
    }

    // @wire(getSkillRatings)
    // ratingPicklist({error, data }){
    //     if(data){
    //         console.log('@@ getSkillRatingsData -- '+JSON.stringify(data));
    //         this.ratingOptions = data;
    //     }else if(error){
    //         console.log('erro skill '+JSON.stringify(error));
    //     }
    // }
    connectedCallback() {
        console.log('connected callback 2.2.3');
        this.handleRatingOptions();
    }   

    async handleRatingOptions() {
        try {
            let result = await getSkillRatings();
            this.ratingOptions = result;
            
        } catch (error) {
            this.ratingOptions =[]
            console.log('errorrr '+JSON.stringify(error));
            
        }
    }

    selectedIds=[];
    selectedIdsSet=[];

    async addSkillHandler(){
        console.log('addSkillHandler called@@@@@@@@');

        if( this.scValue == 'Skill/Certification'){
            //05-07-2024 == new line added 186-188 and 232
            if(this.selectedSearchResult == undefined){
                this.showNotification('Error', 'Please select at least one Sklii/Certification', 'error');
            }else{
                let isDuplicate = false;
                this.skillCertificationData.forEach(ele => {
                if(ele.id == this.selectedSearchResult.value){
                    isDuplicate = true;
                }  
                })
                if(isDuplicate){
                    this.showNotification('Error', 'Duplicate skill selected.', 'error');
                }else{
                    console.log('in else----');
                    this.selectedValueVisible = '';
                    // this.isSkillSetCertification = true;
                    console.log('this.skillCertificationData 1 '+JSON.stringify(this.skillCertificationData));
                    this.isSpinner = true;
                    this.isSkillVisible = false;

                    let tempskillCertificationData=this.skillCertificationData;
                    this.skillCertificationData =[];
                    console.log('1111111111111');
                    console.log('this.selectedSearchResult '+JSON.stringify(this.selectedSearchResult));
                    let temp={"id":this.selectedSearchResult.value, "name":this.selectedSearchResult.label, "pickListOptions": '', "minimumRating":'', "isSetofSkill": false};
                    tempskillCertificationData.push(temp);
                    console.log('222222222222');
                    if(!this.selectedIds.includes(this.selectedSearchResult.value)){
                        this.selectedIds.push(this.selectedSearchResult.value);
                    }
                    console.log('33333333333333');
                    tempskillCertificationData.forEach(ele => {
                        ele.pickListOptions = this.ratingOptions;
                    });
                    this.skillCertificationData = tempskillCertificationData;
                    console.log('4444444444444444');
                    setTimeout(() => {
                        this.isSkillVisible = this.skillCertificationData.length>0 ? true : false;
                        this.isSpinner = false;
                    }, "2000");
                    console.log('555555555555555');
                    this.dispatchEvent(new CustomEvent('skillcertificationhandler', {
                        detail: {
                            skillCertificationData: this.skillCertificationData,
                            skillCertificationDataSet: this.skillCertificationDataSet,
                            selectedIds: this.selectedIds,
                            isSpinner: true
                        }
                    }));
                    this.selectedSearchResult = undefined;
                    console.log('this.skillCertificationData 2 '+JSON.stringify(this.skillCertificationData));
                    // this.skillCertificationData.forEach(ele => {
                    //     this.selectedIds.push(ele.id);
                    // })
                }
            }
        }else if(this.scValue ==  'Skill Set'){
            //=========  05-07-2024 == new line added 241-243 and 302 ========================================================
            if(this.selectedSearchResultSet == undefined){
                this.showNotification('Error', 'Please select at least one SkillSet', 'error');
            }else{
                let isDuplicate = false;
                this.skillCertificationDataSet.forEach(ele => {
                if(ele.setId == this.selectedSearchResultSet.value){
                    isDuplicate = true;
                }  
                })
                if(isDuplicate){
                    this.showNotification('Error', 'Duplicate skill sets selected.', 'error');
                }else{
                    try{
                        this.selectedValueVisibleSet ='';
                        // this.isSkillSetCertification = false;
                        console.log('this.skillCertificationDataSet 1 '+JSON.stringify(this.skillCertificationDataSet));

                        this.isSpinner = true;
                        this.isSkillVisible = false;

                        console.log('tryeee....');
                        let result = await getSetOfSkillCertifications({setId: this.selectedSearchResultSet.value});
                        console.log('result  '+JSON.stringify(result));

                        // let tempskillCertificationData=this.skillCertificationDataSet;
                        // this.skillCertificationDataSet =[];
                        let tempskillCertificationData=[];
                        let tempskillCertificationDataSet = this.skillCertificationDataSet;
                        this.skillCertificationDataSet =[];
                        if(result.length>0){
                            let selectedIds =[];
                            result.forEach(ele => {
                                selectedIds.push(ele.pse__Skill_Certification__c);
                                let temp={"id":ele.pse__Skill_Certification__c, "name":ele.pse__Skill_Certification__r.Name, "pickListOptions": '', "minimumRating":'', "isSetofSkill": true, "setId":result[0].pse__Skill_Set__c, checked: true};
                                tempskillCertificationData.push(temp);
                                
                                tempskillCertificationData.forEach(ele => {
                                    ele.pickListOptions = this.ratingOptions;
                                });
                                
                            });
                            let setName = result[0].pse__Skill_Set__r.Name;
                            // this.skillCertificationDataSet.push({setName: tempskillCertificationData});
                            
                            tempskillCertificationDataSet.push({"setId":result[0].pse__Skill_Set__c ,"title":setName ,"data": tempskillCertificationData, "selectedIds":selectedIds});
                            this.skillCertificationDataSet = tempskillCertificationDataSet;

                            setTimeout(() => {
                                this.isSkillVisible = this.skillCertificationDataSet.length>0 ? true : false;
                                this.isSpinner = false;
                            }, "2000");

                            this.dispatchEvent(new CustomEvent('skillcertificationhandler', {
                                detail: {
                                    skillCertificationData: this.skillCertificationData,
                                    skillCertificationDataSet: this.skillCertificationDataSet,
                                    selectedIds: this.selectedIds,
                                    isSpinner: true
                                }
                            }));

                            this.selectedSearchResultSet = undefined;
                            console.log('this.skillCertificationDataSet 2 '+JSON.stringify(this.skillCertificationDataSet));
                            
                            // this.skillCertificationDataSet.forEach(ele => {
                            //     console.log('test e iddss '+JSON.stringify(ele));
                            //     ele.data.forEach(childele => {
                            //         this.selectedIdsSet.push(childele.id);
                            //     });
                            // })
                        }

                    }catch(e){
                        console.log('err @@ '+JSON.stringify(e));
                    }
                }
            }
        }
    }

    handleRowSelection(event){
        console.log('handleSelection '+JSON.stringify(event.detail.selectedRows));
        this.selectedIds =[];
        let temp=[];
        event.detail.selectedRows.forEach(ele=> {
            temp.push(ele.id);
        })
        this.selectedIds = temp;
        console.log('selectedIds-- '+this.selectedIds);


        this.dispatchEvent(new CustomEvent('skillcertificationhandler', {
            detail: {
                skillCertificationData: this.skillCertificationData,
                skillCertificationDataSet: this.skillCertificationDataSet,
                selectedIds: this.selectedIds,
                isSpinner: true
            }
        }));
        
        // this.skillCertificationData =[];
        // this.skillCertificationData = event.detail.selectedRows;
        // const result = this.skillCertificationData.filter((element) => element.id == event.detail.selectedRows.id);
        // console.log('result -- '+JSON.stringify(result));
        // this.skillCertificationData =[];
        // this.skillCertificationData = result;

        console.log('skillCertificationData @@ - '+this.skillCertificationData);
        console.log('event.target  '+event.target.dataset.id)

    }

    
    handleRowSelectionSet(event){
        console.log('event  '+JSON.stringify(event));
        console.log('handleSelection detail '+JSON.stringify(event.detail));
        console.log('handleSelection set '+JSON.stringify(event.detail.selectedRows));
        console.log('emptyy or not '+event.detail.selectedRows);
        console.log('## '+JSON.stringify(event.target));
        console.log('## '+JSON.stringify(event.target.dataset.id));
        if(event.detail.config.action == 'rowSelect'){
            if(event.detail.selectedRows.length == 1){
                console.log('if.f.fuoooo')
                this.skillCertificationDataSet.forEach(ele => {
                    if(event.target.dataset.id == ele.setId){
                        console.log('oooooo');
                        // ele['setId'] = event.target.dataset.id;
                        // ele['title'] = event.target.dataset.name;
                        // ele['data'] = event.detail.selectedRows;
                        let tempSelectId =[];
                        console.log('event.detail.selectedRows[0].id '+event.detail.selectedRows[0].id);
                        tempSelectId.push(event.detail.selectedRows[0].id); 
                        console.log('tempSelectId '+tempSelectId);
                        ele['selectedIds'] = tempSelectId;

                    }
                })
            }else{
                console.log('else')
                this.skillCertificationDataSet.forEach(ele => {
                    // console.log('test e iddss '+JSON.stringify(ele));
                    let tempSelecetdIds =[];
                    event.detail.selectedRows.forEach(ele => {
                        tempSelecetdIds.push(ele.id);
                    })
                    ele.selectedIds = tempSelecetdIds;

                })  

            }
        }
        if(event.detail.config.action == 'rowDeselect'&& event.detail.selectedRows.length>0){
            this.skillCertificationDataSet.forEach(ele => {
                // console.log('test e iddss '+JSON.stringify(ele));
                let tempSelecetdIds = ele.selectedIds.filter((childele) => childele != event.detail.config.value)
                console.log('tempSelecetdIds --000 '+JSON.stringify(tempSelecetdIds));
                ele.selectedIds = tempSelecetdIds;
            })  
        }
        if(event.detail.config.action == 'rowDeselect' && event.detail.selectedRows.length==0){

            this.skillCertificationDataSet.forEach(ele => {
                if(ele.setId == event.target.dataset.id){
                    ele.selectedIds = [];
                }
            }) 

        }
        if(event.detail.config.action == 'deselectAllRows'){

            this.skillCertificationDataSet.forEach(ele => {
                if(ele.setId == event.target.dataset.id){
                    ele.selectedIds = [];
                }
            }) 
        }
        if(event.detail.config.action == 'selectAllRows'){
            this.skillCertificationDataSet.forEach(ele => {
                ele.data.forEach(eleChild => {
                    ele.selectedIds.push(eleChild.id); 
                })
                
            }) 
        }

        console.log('skillCertificationDataSet $--- '+JSON.stringify(this.skillCertificationDataSet));
    }


     handleRowAction(event) {
         console.log('handleRowAction....');
            console.log('@@@ '+event.target.dataset.id);
            const action = event.detail.action;
            const row = event.detail.row;
            console.log(JSON.stringify(event.detail.action)+' --Action--roww-- '+JSON.stringify(event.detail.row));
            
            if(event.detail.row.isSetofSkill){
                let tempList =[];
                let tempSCData = this.skillCertificationDataSet;
                this.skillCertificationDataSet =[];
                tempSCData.forEach(ele => {
                    
                    if(ele.setId != event.target.dataset.id){
                        console.log('match...');
                        tempList.push(ele);
                    } 
                });
                console.log('tempList----  '+JSON.stringify(tempList));
                this.skillCertificationDataSet = tempList;
                // ==================================
                // let filteredData = this.skillCertificationDataSet.map(obj => ({
                //     ...obj, 
                //     data: obj.data.filter(item => item.id != event.detail.row.id)
                // }));
                // this.skillCertificationDataSet =[];
                // this.skillCertificationDataSet = filteredData;
                // ==================================
                this.dispatchEvent(new CustomEvent('skillcertificationhandler', {
                            detail: {
                                skillCertificationData: this.skillCertificationData,
                                skillCertificationDataSet: this.skillCertificationDataSet,
                                selectedIds: this.selectedIds,
                                isSpinner: true
                            }
                        }));
                console.log('skillCertificationDataSet--- '+JSON.stringify(this.skillCertificationDataSet));
            }else{
                let tempList =[];
                this.skillCertificationData.forEach(ele => {
                    if(ele.id != event.detail.row.id){
                        tempList.push(ele);
                    } 
                });
                this.skillCertificationData =[];
                this.skillCertificationData = tempList;
                // console.log('skillCertificationData----  '+JSON.stringify(this.skillCertificationData));
                this.dispatchEvent(new CustomEvent('skillcertificationhandler', {
                            detail: {
                                skillCertificationData: this.skillCertificationData,
                                skillCertificationDataSet: this.skillCertificationDataSet,
                                selectedIds: this.selectedIds,
                                isSpinner: true
                            }
                        }));
            }
            
    


     }

    handleCellChange(event) {
        //this.updateDraftValues(event.detail.draftValues[0]);
        console.log('draft val==  '+JSON.stringify( event.detail));

        this.skillCertificationData.forEach(ele => {
            if(ele.id == event.detail.draftValues[0].id){
                ele["minimumRating"] = event.detail.draftValues[0].minimumRating;
            }
        })
        this.dispatchEvent(new CustomEvent('skillcertificationhandler', {
            detail: {
                skillCertificationData: this.skillCertificationData,
                skillCertificationDataSet: this.skillCertificationDataSet,
                selectedIds: this.selectedIds,
                isSpinner: true
            }
        }));
        console.log('this.skillCertificationData 3 '+JSON.stringify(this.skillCertificationData));

    }

    handleCellChangeSet(event){
        console.log('draft val==  '+JSON.stringify( event.detail));

         this.skillCertificationDataSet.forEach(ele => {
            ele.data.forEach(chileElement => {
                if(chileElement.id == event.detail.draftValues[0].id){
                    chileElement["minimumRating"] = event.detail.draftValues[0].minimumRating;
                }

            })
        })
        this.dispatchEvent(new CustomEvent('skillcertificationhandler', {
            detail: {
                skillCertificationData: this.skillCertificationData,
                skillCertificationDataSet: this.skillCertificationDataSet,
                selectedIds: this.selectedIds,
                isSpinner: true
            }
        }));
        console.log('this.skillCertificationDataSet 4 '+JSON.stringify(this.skillCertificationDataSet));
    }

    async handleSave(){
        let allSkillIsFilled = true; 
        let allSkillIsFilledSet = true;

        if(this.skillCertificationData.length > 0 && this.selectedIds.length>0){
            this.skillCertificationData.forEach(ele => {
                if(this.selectedIds.includes(ele.id)){
                    if(this.skillCertificationData.length == 1 && ele.minimumRating == '' && ele.certificationId == ''){
                        console.log('1111');
                        allSkillIsFilled = true;
                    }else if(this.skillCertificationData.length == 1 && ((ele.minimumRating != '' && ele.certificationId == '') || (ele.minimumRating == '' && ele.certificationId != '') )){
                        console.log('22222');
                        allSkillIsFilled = false;
                    }else if(this.skillCertificationData.length > 1 && ((ele.minimumRating != '' && ele.certificationId == '') || (ele.minimumRating == '' && ele.certificationId != '') )){
                        console.log('33333');
                        allSkillIsFilled = false;
                    }
                }
            })
            console.log('allSkillIsFilled--- '+allSkillIsFilled);
        }
        
        if(this.skillCertificationDataSet.length>0){
            this.skillCertificationDataSet.forEach(ele => {
                for (const element of ele.data) {
                    if(ele.selectedIds.includes(element.id)){
                        if(ele.data.length == 1 && ((element.minimumRating != '' && element.id == '') || (element.minimumRating == '' && element.id != '') )){
                            console.log('22222');
                            allSkillIsFilledSet = false;
                            break;
                        }else if(ele.data.length > 1 && ((element.minimumRating != '' && element.id == '') || (element.minimumRating == '' && element.id != '') )){
                            console.log('33333');
                            allSkillIsFilledSet = false;
                            break;
                        }
                    }
                    console.log('@@-- '+element);
                }
            });
            console.log('allSkillIsFilled--- '+allSkillIsFilledSet);
        }

        if(allSkillIsFilled && allSkillIsFilledSet){
            let tempResourceRequestData =[];
            this.skillCertificationData.forEach(ele => {
                let tempObj ={"certificationId": ele.id, "minimumRating": ele.minimumRating, "setId": ''};
                tempResourceRequestData.push(tempObj);
            })

            this.skillCertificationDataSet.forEach(ele => {
                ele.data.forEach(childEle => {
                    let tempObj ={"certificationId": childEle.id, "minimumRating": childEle.minimumRating, "setId": ele.setId};
                    tempResourceRequestData.push(tempObj);
                })
            })
            
            console.log('tempResourceRequestData $$$- '+JSON.stringify(tempResourceRequestData));

            try{
                let result = await createResourceSkillRequestTesting({resourceRequestId: 'aFdVZ000006lqns0AA', certificationSkillObj: tempResourceRequestData});
                console.log('result -- '+JSON.stringify(result));


                // console.log('this.skillCertificationDataSet 2 '+JSON.stringify(this.skillCertificationDataSet));

                

            }catch(e){
                console.log('err @@ '+JSON.stringify(e));
            }
        }else{
            this.showNotification('Error', 'Duplicate skill sets selected.', 'error');
        }


    }


    // Skill Set Methods================================================
    // ==============================================================================
    searchSet(event) {
        console.log('search called....')
        this.searchValueSet = '%'+event.detail.value.toLowerCase()+'%';
        console.log('11111111');
        const input = event.detail.value.toLowerCase();
        console.log('22222222');
        let result;
        if(this.picklistOrderedSet){
            console.log('if side if');
            result = this.picklistOrderedSet.filter((picklistOption) =>
                picklistOption.label.toLowerCase().includes(input)
            );
            console.log('33333333');
            this.searchResultsSet = result;
        }
    }

   
    selectSearchResultSet(event) {
        console.log('select###.@@...'+event.target.dataset.name);
        let selectedValue = event.target.dataset.name;
        //console.log();
        console.log('selectedValue=== '+selectedValue);
        this.selectedSearchResultSet = this.picklistOrderedSet.find(
        (picklistOption) => picklistOption.value === selectedValue
        );
        console.log('selectedSearchResult8888 '+JSON.stringify(this.selectedSearchResultSet));
        console.log('@#### '+this.selectedSearchResultSet.label);

        this.selectedValueVisibleSet = this.selectedSearchResultSet ? this.selectedSearchResultSet.label : null;
        
        // 
        // this.seletedCertificatiSkill.certificationId = selectedValue;
        // this.seletedCertificatiSkill.cetificationLabel = this.selectedValueVisible;

        // this.dispatchEvent(new CustomEvent('skillhandler', {
        //     detail: this.seletedCertificatiSkill
        // }));

        console.log('select end')

        this.clearSearchResultsSet();
    }

    clearSearchResultsSet() {
        this.searchResultsSet = null;
        // this.selectedValue ='';
        //this.jsonObject.selectedValue = this.selectedValue;
    }

    showPicklistOptionsSet() {
        if (!this.searchResultsSet) {
            this.searchResultsSet = this.picklistOrderedSet;
        }
    }


    // Skill / Certifications Methods================================================
    // ==============================================================================
    search(event) {
        console.log('search called....')
        this.searchValue = '%'+event.detail.value.toLowerCase()+'%';
        console.log('11111111');
        const input = event.detail.value.toLowerCase();
        console.log('22222222');
        let result;
        if(this.picklistOrdered){
            console.log('if side if');
            result = this.picklistOrdered.filter((picklistOption) =>
                picklistOption.label.toLowerCase().includes(input)
            );
            console.log('33333333');
            this.searchResults = result;
        }
    }

   
    selectSearchResult(event) {
        console.log('select###.@@...'+event.target.dataset.name);
        let selectedValue = event.target.dataset.name;
        //console.log();
        console.log('selectedValue=== '+selectedValue);
        this.selectedSearchResult = this.picklistOrdered.find(
        (picklistOption) => picklistOption.value === selectedValue
        );
        console.log('selectedSearchResult8888 '+JSON.stringify(this.selectedSearchResult));
        console.log('@#### '+this.selectedSearchResult.label);

        this.selectedValueVisible = this.selectedSearchResult ? this.selectedSearchResult.label : null;
        
        // 
        // this.seletedCertificatiSkill.certificationId = selectedValue;
        // this.seletedCertificatiSkill.cetificationLabel = this.selectedValueVisible;

        // this.dispatchEvent(new CustomEvent('skillhandler', {
        //     detail: this.seletedCertificatiSkill
        // }));

        console.log('select end')

        this.clearSearchResults();
    }

    clearSearchResults() {
        this.searchResults = null;
        // this.selectedValue ='';
        //this.jsonObject.selectedValue = this.selectedValue;
    }

    showPicklistOptions() {
        if (!this.searchResults) {
            this.searchResults = this.picklistOrdered;
        }
    }

    showNotification(titleText, messageText, variant) {
        const evt = new ShowToastEvent({
            title: titleText,
            message: messageText,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }

    handleSectionToggle(event) {
        const openSections = event.detail.openSections;

        if (openSections.length === 0) {
            this.allSectionClosed = false;
            console.log('All sections are closed.  '+this.allSectionClosed);
            // this.activeSectionsMessage = 'All sections are closed';
        } else {
            this.allSectionClosed = true;
            console.log('section not closed.  '+this.allSectionClosed);
            // this.activeSectionsMessage =
            //     'Open sections: ' + openSections.join(', ');
        }
    }
}