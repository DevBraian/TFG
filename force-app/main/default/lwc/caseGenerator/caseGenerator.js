import { LightningElement, wire, track } from 'lwc';
import { getRecordCreateDefaults, generateRecordInputForCreate } from "lightning/uiRecordApi";
import getObjects from '@salesforce/apex/ObjectController.getObjects';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class CaseGenerator extends LightningElement {

    @track fields = [];
    @track recordInput;
    recordId = null;

    connectedCallback() {
        console.log('Hello JS from c-caseGenerator')
    }

    
    @track objectOptions = [];
    /**
     * This wire Function, connects with apex class controller to get the sObjects we have in our org.
     * Then it manages the data we recived, building the object Array to use it in a <lightning-combobox>.
     * @param {*} param0 - There is no param.
     */
    @wire(getObjects)
    wiredObjects({ error, data }) {
        if (data) {
            let sortData = [...data]
            sortData.sort()
            this.objectOptions = sortData.map(obj => {
                return { label: obj, value: obj };
            });
        } else if (error) {
            this.showToast('Error', error.body.message, 'error');
        }
    }


    selectedObject;
    /**
     * Handler function when change the object selection in a <lightning-combobox>.
     * @param {*} event 
     */
    handleObjectChange(event) {
        this.selectedObject = event.detail.value;
        this.error = null;
    }


    @track createDefaults;
    @track error;
    /**
     * This wire functions works with module "lightning/uiRecordApi".
     * First we call getRecordCreateDefaults to get basic information about the sObject record in order to create a new one.
     * Then we call generateRecordInputForCreate to get the fields and default input to show it to the user in a <lightning-record-form>.
     * @param {*} param0 - The param is the selected object in <lightning-combobox>. We need the object apiName.
     */
    @wire(getRecordCreateDefaults, { objectApiName: '$selectedObject' })
    wiredCreateDefaults({ error, data }) {
        if (data) {
            this.createDefaults = data;
            this.error = undefined;
            this.recordInput = generateRecordInputForCreate(data.record);
            this.fields = Object.keys(this.recordInput.fields)
        } else if (error) {
            this.error = error;
            this.createDefaults = undefined;
        }
    }

    /**
     * Handler function when we submit the form and the record is created successfully, it shows a Toast with the record ID.
     * @param {*} event 
     */
    handleSuccess(event) {
        this.showToast('Éxito', `Registro creado con éxito - ID: ${event.detail.id}`, 'success');
        this.recordId = event.detail.id;

        const customEvent = new CustomEvent('recordcreated', {detail:this.recordId});
        this.dispatchEvent(customEvent);

        this.selectedObject = null;
    }

    /**
     * Handler function when an error occurs during the <lightning-record-form> render.
     * The common errors are: 
     *  1. Object not supported by the component. 
     *  2. Record is not creatable.
     *  3. Object permission.
     * 
     * ----IMPORTANT----
     * Additionally there is a setTimeout to solve a little bug when the sObject is supported but the record-form shows an error.
     * When it occurs, there is a 500ms delay to reload de component and show correctly the form.
     * @param {*} event 
     * @returns - returns when condition is activated. Leaves the function.
     */
    handleError(event){
        let auxSelectedObject = this.selectedObject;
        this.selectedObject = null

        //This condition is made to solve the common errors and show it.
        if(!event.detail.message.includes('is invalid, did you mean')){
            this.showToast('An error occurred', event.detail.message, 'error')
            return
        }

        //This timeout is made to solve the little bug, and reloads the record-form
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            this.selectedObject = auxSelectedObject
          }, "500");

    }

    //TO-DO COMENTS
    // eslint-disable-next-line no-unused-vars
    handleCancel(event){
        this.selectedObject = null
    }

    /**
     * Fucntion to dispatch the showToast event. It show a Toast with information.
     * @param {*} title 
     * @param {*} message 
     * @param {*} variant 
     */
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant,
        });
        this.dispatchEvent(event);
    }
}