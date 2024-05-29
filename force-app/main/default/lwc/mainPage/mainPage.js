/* eslint-disable no-dupe-class-members */

import { LightningElement } from 'lwc';

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

}