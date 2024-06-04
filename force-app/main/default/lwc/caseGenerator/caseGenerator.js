import { LightningElement, wire, track, api } from 'lwc';
import { getRecordCreateDefaults, generateRecordInputForCreate } from "lightning/uiRecordApi";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class CaseGenerator extends LightningElement {

    @track fields = [];
    @track recordInput;
    recordId = null;

    connectedCallback() {
        console.log('Hello JS from c-caseGenerator 11111111111')
    }

    _selectedObject;
    @api
    get selectedObject() {
        return this._selectedObject;
    }

    set selectedObject(value) {
        this._selectedObject = value;
    }

    @track createDefaults;
    @track error;

    @wire(getRecordCreateDefaults, { objectApiName: '$_selectedObject' })
    wiredCreateDefaults({ error, data }) {
        if (data) {
            this.createDefaults = data;
            this.error = undefined;
            this.recordInput = generateRecordInputForCreate(data.record);
            //console.log('rInput?,',JSON.stringify(this.recordInput));
            this.fields=Object.keys(this.recordInput.fields)
            //console.log('fieldssssssssssssssssss',JSON.stringify(this.fields))
        } else if (error) {
            this.error = error;
            this.createDefaults = undefined;
        }
    }

    handleSuccess(event) {
        this.showToast('Éxito', `Registro creado con éxito - ID: ${event.detail.id}`, 'success');
        this.recordId = event.detail.id;
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