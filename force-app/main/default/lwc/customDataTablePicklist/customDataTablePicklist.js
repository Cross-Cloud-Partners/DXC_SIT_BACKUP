// ==== start - CR -175 - ===== //
import LightningDatatable from 'lightning/datatable';
import minimumRatingColumn from './minimumRatingColumn.html';
import picklistColumn from './picklistColumn.html';
import primarySkillColumn from './primarySkillColumn.html';
// import pickliststatic from './pickliststatic.html';
 
export default class CustomDataTablePicklist extends LightningDatatable {
    static customTypes = {
        picklistColumn: {
            template: picklistColumn,
            // editTemplate: picklistColumn,
            standardCellLayout: true,
            typeAttributes: ['label', 'placeholder', 'options', 'value', 'context', 'variant','name', 'handleChange']
        },
        primarySkillColumn: {
            template: primarySkillColumn,
            standardCellLayout: true,
            typeAttributes: ['label', 'placeholder', 'options', 'value', 'context', 'variant','name', 'handleChange', 'rowId']
        },
        minimumRatingColumn: {
            template: minimumRatingColumn,
            standardCellLayout: true,
            typeAttributes: ['label', 'placeholder', 'options', 'value', 'context', 'variant','name', 'handleChange', 'rowId']
        },
    };
}
// ==== end - CR -175 - ===== //