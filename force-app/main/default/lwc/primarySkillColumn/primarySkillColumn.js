import { api, LightningElement, track } from 'lwc';

export default class PrimarySkillColumn extends LightningElement {
    @api rowId;
    @api value;

    @track selectedValue = false;

    get isChecked() {
        console.log(this.value);
        return this.value;
    }

    renderedCallback() {
        console.log(this.value);
        this.selectedValue = this.value;
    }
    
    handleChange(event) {
        let primarySkill = event.detail.checked;
        let id = this.rowId;
        const comboboxChangeEvent = new CustomEvent('cellchange', {
            detail: {
                customDraftChanges: [
                    {
                        primarySkill,
                        id,
                    }
                ]
            },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(comboboxChangeEvent);
    }
}