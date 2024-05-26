import { LightningElement,api } from 'lwc';

export default class FlowInfo extends LightningElement {

    @api selectedFlowItem; //this is the name of flow selected in <c-flow-selector>

    connectedCallback(){
        console.log('Hello JS from c-flowInfo')
        console.log(this.selectedFlowItem)
    }
}