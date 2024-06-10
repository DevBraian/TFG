import { LightningElement} from 'lwc';

export default class MainPage extends LightningElement {

    selectedFlowItem; //this is the name of flow selected in <c-flow-selector>

    recordCreatedId; //ID of record created in <c-case-generator>

    connectedCallback() {
        console.log("HELLO JS from c-mainPage ")
    }

    renderedCallback(){
        console.log('mainPage-renderedCALL',this.selectedFlowItem)
    }

    /**
     * Handle function in order to manage custom event sent by <c-flowSelector>.
     * Here recives flow item selected (we recive 'flowName+[flowStatus]').
     * @param {*} event 
     */
    handleItemSelected(event) {
        this.selectedFlowItem = event.detail;
    }

    handleRecordCreated(event){
        this.recordCreatedId = event.detail;
    }

    handleReset(event){
        console.log('reset button clicked', JSON.stringify(event.target))

        this.recordCreatedId = null;
        this.selectedFlowItem = null;
    }
}