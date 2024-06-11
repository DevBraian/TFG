import { LightningElement} from 'lwc';

export default class MainPage extends LightningElement {

    selectedFlowItem; //this is the name of flow selected in <c-flow-selector>

    recordCreatedId; //ID of record created in <c-case-generator>

    isRecordCreated; //variable to render or not >c-case-generator>

    connectedCallback() {
        console.log("HELLO JS from c-mainPage ")
    }

    /**
     * Handle function in order to manage custom event sent by <c-flowSelector>.
     * Here recives flow item selected (we recive 'flowName+[flowStatus]').
     * @param {*} event 
     */
    handleItemSelected(event) {
        this.selectedFlowItem = event.detail;
        this.isNotRecordCreated = true;
    }

    handleRecordCreated(event){
        this.recordCreatedId = event.detail;
        this.isNotRecordCreated = false;
    }

    // eslint-disable-next-line no-unused-vars
    handleReset(event){
        this.recordCreatedId = null;
        this.selectedFlowItem = null;
        this.isNotRecordCreated = null;
    }

    handleErrorItemSelected(event){
        console.log('customevent error selection item',event.detail)
        this.handleReset(event)
    }
}