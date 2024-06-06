import { LightningElement, wire, track } from 'lwc';
import { getRecordCreateDefaults, generateRecordInputForCreate } from "lightning/uiRecordApi";
import getObjects from '@salesforce/apex/ObjectController.getObjects';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class CaseGenerator extends LightningElement {

    @track fields = [];
    @track recordInput;
    recordId = null;

    connectedCallback() {
        console.log('Hello JS from c-caseGenerator 222222222222222')
    }

    @track objectOptions = [];
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

    selectedObject;
    handleObjectChange(event) {
        console.log('evnt value',JSON.stringify(event.detail))

        this.selectedObject = event.detail.value;
        this.error = null;
    }


    @track createDefaults;
    @track error;

    @wire(getRecordCreateDefaults, { objectApiName: '$selectedObject' })
    wiredCreateDefaults({ error, data }) {
        if (data) {
            this.createDefaults = data;
            this.error = undefined;
            this.recordInput = generateRecordInputForCreate(data.record);
            //console.log('rInput?,',JSON.stringify(this.recordInput));
            this.fields = Object.keys(this.recordInput.fields)
            //console.log('fieldssssssssssssssssss',JSON.stringify(this.fields))
        } else if (error) {
            this.error = error;
            this.createDefaults = undefined;
        }
    }

    handleSuccess(event) {
        this.showToast('Éxito', `Registro creado con éxito - ID: ${event.detail.id}`, 'success');
        this.recordId = event.detail.id;
        this.selectedObject = null;
    }

    handleError(event){
        console.log('Errrrror onerror', JSON.stringify(event.detail))
        console.log('Errrrror onerror', JSON.stringify(event))

        let auxSelectedObject = this.selectedObject;
        this.selectedObject = null
        //this.selectedObject = aux

        if(!event.detail.message.includes('is invalid, did you mean')){
            console.log('entrandoooooooooooooooo1')
            this.showToast('An error occurred', event.detail.message, 'error')
            return
        }

        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            console.log('retrasado 0,1seg')
            this.selectedObject = auxSelectedObject
          }, "500");

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