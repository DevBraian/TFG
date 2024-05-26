import { LightningElement } from 'lwc';
import queryToolingAPI from '@salesforce/apex/ToolingAPIUtility.queryToolingAPI';


export default class FlowSelector extends LightningElement {


    data;
    items;
    selectedItemValue;


    connectedCallback(){
        console.log("HELLO JS from c-flowSelector")

        //We need an aux string to build de query using WHERE='sth . . .'
        let queryString = `SELECT MasterLabel,Status FROM Flow`

        // Llamar al método de Apex y manejar la promesa
        queryToolingAPI({ query: queryString })
            .then(result => {

                this.data = JSON.parse(result)

                this.items = this.orderDataByStatus(this.data)

                console.log('Query result: 11:', result);
            })
            .catch(error => {
                console.error('Error querying Tooling API2:', error);
            });
    }

    handleOnselect(event) {
        this.selectedItemValue = event.detail.name;
        const auxSelectedItemValue= event.detail.name;

        const customEvent = new CustomEvent('itemselected',{detail:auxSelectedItemValue});
        this.dispatchEvent(customEvent);
    }

    orderDataByStatus(dataObject) {
        const statusMap = {};
        dataObject.records.forEach(record => {
            const status = record.Status;
            
            //Building parent items
            if (!statusMap[status]) {
                statusMap[status] = {
                    label: status,
                    name: status,
                    expanded: ((status==='Active')?true:false),
                    items: []
                };
            }

            //Building child items in each Status
            statusMap[status].items.push({
                label: record.MasterLabel,
                name: record.MasterLabel,
                items: []
            });
        });

        return Object.values(statusMap);
    }
}