import { LightningElement } from 'lwc';

export default class MainPage extends LightningElement {

    selectedFlowItem; //this is the name of flow selected in <c-flow-selector>

    connectedCallback(){
        console.log("HELLO JS from c-mainPage ")
    }

    handleItemSelected(event){
        this.selectedFlowItem = event.detail;
    }

}