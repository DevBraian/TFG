import { LightningElement} from 'lwc';

export default class MainPage extends LightningElement {

    selectedFlowItem; //this is the name of flow selected in <c-flow-selector>

    connectedCallback() {
        console.log("HELLO JS from c-mainPage ")
    }

    /**
     * Handle function in order to manage custom event sent by <c-flowSelector>.
     * Here recives flow item selected (we recive flowName+[flowStatus])
     * @param {*} event 
     */
    handleItemSelected(event) {
        this.selectedFlowItem = event.detail;
    }
}