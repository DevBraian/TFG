import { LightningElement, api } from 'lwc';
import queryRecentObject from '@salesforce/apex/ToolingAPIUtility.queryRecentObject';

export default class Result extends LightningElement {

    records;
    columns = [
        {
            label: 'Id',
            fieldName: 'recordLink',
            type: 'url',
            typeAttributes: {
                label: { fieldName: 'id' },
                target: '_blank'
            }
        },
        {
            label: 'Name',
            fieldName: 'name',
            cellAttributes: {
                class: { fieldName: 'rowClass' }
            } 
        },
        { label: 'Object', fieldName: 'type' },
        {
            label: 'Date', fieldName: 'dateref', type: 'date', typeAttributes: {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }, wrapText: true
        }
    ];
    data = []

    _recordCreatedId;

    @api
    get recordCreatedId(){
        return this._recordCreatedId;
    }

    set recordCreatedId(value){
        this._recordCreatedId=value;
        console.log('set recordcreated id:-------', this._recordCreatedId)
    }

    connectedCallback() {
        console.log('Hello JS from c-result')

        queryRecentObject().then(res => {
            console.log('recent objs', res)
            let resObj = JSON.parse(res)

            this.data = resObj.records.map(record => ({
                id: record.Id,
                name: record.Name,
                type: record.Type,
                dateref: record.LastReferencedDate,
                recordLink: `${window.location.origin}/lightning/r/${record.Type}/${record.Id}/view`,
                rowClass: record.Id===this._recordCreatedId ? 'slds-text-color_success slds-text-title_caps': ''
            }));

        }).catch(err => {
            console.log(err)
        })
    }

}