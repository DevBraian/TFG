import { LightningElement } from 'lwc';
import queryRecentObject from '@salesforce/apex/ToolingAPIUtility.queryRecentObject';

export default class Result extends LightningElement {

    records;
    columns = [
        { label: 'Id', fieldName: 'recordLink', type:'url', typeAttributes: {label:{fieldName:'id'}, target:'_blank'}},
        { label: 'Name', fieldName: 'name' },
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

    connectedCallback() {
        console.log('Hello JS from c-result')
        //let baseurl = this.window.location.origin

        queryRecentObject().then(res => {
            console.log('recent objs', res)
            let resObj = JSON.parse(res)
            

            this.data = resObj.records.map(record => ({
                id: record.Id,
                name: record.Name,
                type: record.Type,
                dateref: record.LastReferencedDate,
                recordLink:`${window.location.origin}/lightning/r/${record.Type}/${record.Id}/view`
            }));

        }).catch(err => {
            console.log(err)
        })
    }

}