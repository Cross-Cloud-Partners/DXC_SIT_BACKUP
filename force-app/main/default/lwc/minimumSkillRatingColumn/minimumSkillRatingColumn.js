import { api, LightningElement } from 'lwc';

export default class MinimumSkillRatingColumn extends LightningElement {
    @api rowId;
    @api label;
    @api placeholder;
    @api options;
    @api value;

    renderedCallback() {
        console.log(this.api);
    }
    
    handleChange(event) {
        let minimumRating = event.detail.value;
        let id = this.rowId;
        const comboboxChangeEvent = new CustomEvent('cellchange', {
            detail: {
                customDraftChanges: [
                    {
                        minimumRating,
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