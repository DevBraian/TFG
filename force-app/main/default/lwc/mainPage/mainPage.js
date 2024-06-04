/* eslint-disable no-dupe-class-members */

import { LightningElement, wire, track } from 'lwc';

import getObjects from '@salesforce/apex/ObjectController.getObjects';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';



export default class MainPage extends LightningElement {

    selectedFlowItem; //this is the name of flow selected in <c-flow-selector>

    get selectedFlowItem(){
        return this.selectedFlowItem;
    }

    set selectedFlowItem(value){
        this.selectedFlowItem = value
    }

    connectedCallback() {
        console.log("HELLO JS from c-mainPage ")
    }

    handleItemSelected(event) {
        this.selectedFlowItem = event.detail;
    }


    @track objectOptions = [];
    selectedObject;
    error;

    @wire(getObjects)
    wiredObjects({ error, data }) {
        if (data) {
            this.objectOptions = data.map(obj => {
                return { label: obj, value: obj };
            });
        } else if (error) {
            this.showToast('Error', error.body.message, 'error');
        }
    }

    handleObjectChange(event) {
        this.selectedObject = event.detail.value;
        this.error = null;
        //1.Now we have selected an object, so we have the objectApiName
        //pasarselo al componente c-case-generator
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant,
        });
        this.dispatchEvent(event);
    }

}