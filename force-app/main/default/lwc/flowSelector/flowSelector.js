import { LightningElement } from 'lwc';
import queryToolingAPI from '@salesforce/apex/ToolingAPIUtility.queryToolingAPI';


export default class FlowSelector extends LightningElement {

    data;
    items;
    selectedItemValue;

    connectedCallback() {
        console.log("HELLO JS from c-flowSelector")

        //Query to SFDC ToolingAPI
        this.getFlows()
    }


    /**
     * This function calls an Apex method to make a query to the ToolingAPI and gets all the flows we have
     * in our SFDC organization.
     */
    getFlows() {
        //We need an aux string to build de query using WHERE='sth . . .'
        let queryString = `SELECT MasterLabel,Status FROM Flow`

        // Llamar al método de Apex y manejar la promesa
        queryToolingAPI({ query: queryString })
            .then(result => {
                this.data = JSON.parse(result)
                this.items = this.orderDataByStatus(this.data)
                console.log('Query result: 222:', result);
            })
            .catch(error => {
                console.error('Error querying Tooling API2:', error);
            });
    }


    /**
     * HANDLER
     * This function handles when we select an item from <lightning-tree>. 
     * Aditionally, it sends a custom event to parent component <c-mainPage> with the item selected.
     * @param {*} event 
     */
    handleOnselect(event) {

        this.selectedItemValue = event.detail.name;

        const customEvent = new CustomEvent('itemselected', { detail: this.selectedItemValue });
        this.dispatchEvent(customEvent);
    }


    /**
     * This function builds the item array that is accepted and used in <lightning-tree>.
     * Parent items -> Flow status (Active, Obsolete, Draft, InvalidDraft)
     * Child items  -> Flow name
     * So we have the flows organized by status.
     * @param {*} dataObject - Result object -> { MasterLabel:flowName, Status:flowStatus }
     * @returns - An array with flowNames organized by flowStatus.
     */
    orderDataByStatus(dataObject) {
        const statusMap = {};
        dataObject.records.forEach(record => {
            const status = record.Status;

            //Building parent items
            if (!statusMap[status]) {
                statusMap[status] = {
                    label: status,
                    name: status,
                    expanded: (status === 'Active'),
                    items: []
                };
            }

            //Building child items in each Status
            statusMap[status].items.push({
                label: record.MasterLabel,
                name: record.MasterLabel+`[${status}]`,
                items: []
            });
        });

        return Object.values(statusMap);
    }
}