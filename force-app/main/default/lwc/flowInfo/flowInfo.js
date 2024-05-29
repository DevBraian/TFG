/* eslint-disable no-unused-vars */


import { LightningElement, api } from 'lwc';

import queryToolingAPI from '@salesforce/apex/ToolingAPIUtility.queryToolingAPI';

export default class FlowInfo extends LightningElement {

    _selectedFlowItem; //this is the 'Flowname'+'[Status]' of item flow selected in <c-flow-selector> 

    @api
    get selectedFlowItem() {
        return this._selectedFlowItem;
    }

    set selectedFlowItem(value) {
        this._selectedFlowItem = value;

        if (this._selectedFlowItem) {
            console.log('llamando a getflownameandstatus')
            this.getFlowNameAndStatus(this._selectedFlowItem)

            console.log('llamando a getflowmetadata')
            this.getFlowMetadata(this.flowName, this.flowStatus);

        }

    }

    flowName;
    flowStatus;
    URLtoFlowBuilder
    flowMetadata; // posiblemente a eliminar dsps de construir flowInfo{}

    flowInfo;
    isLoaded = false;

    flowInformation = {}

    connectedCallback() {
        console.log('Hello JS from c-flowInfo')
    }


    getFlowNameAndStatus(flowNameAndStatus) {
        // Encuentra la posición del primer corchete de apertura
        const bracketIndex = flowNameAndStatus.indexOf('[');

        // Obtén el nombre del flujo y el estado
        this.flowName = flowNameAndStatus.substring(0, bracketIndex).trim();
        this.flowStatus = flowNameAndStatus.substring(bracketIndex + 1, flowNameAndStatus.length - 1).trim();

        // Imprime los resultados
        console.log(`Flow Name1: ${this.flowName}`);
        console.log(`Status1: ${this.flowStatus}`);
    }

    getFlowMetadata(flowName, flowStatus) {

        let queryString = `SELECT Metadata FROM Flow WHERE MasterLabel='${flowName}' AND Status='${flowStatus}'`

        queryToolingAPI({ query: queryString })
            .then(result => {
                console.log('c-flowInfo - Query result:', result);
                let auxResult = JSON.parse(result);// result JSON -> { 'records':[ {atributtes:{}, metadata:{*info*} } ] }

                this.flowInfo = auxResult.records[0].Metadata

                //This section builds URL to Flow Builder and FlowID
                let attributes = auxResult.records[0].attributes
                let parts = attributes.url.split('/')
                let auxID = parts[parts.length - 1]
                this.URLtoFlowBuilder = `${window.location.origin}/builder_platform_interaction/flowBuilder.app?flowId=${auxID}`
                ////////////////////////////////////////////////////

                this.isLoaded = true;


                //this.buildFlowInfoObject(auxResult.records[0]) //----!!!!!!----ELIMINAR

            })
            .catch(error => {
                console.error('c-flowInfo - Error querying Tooling API2:', error);
            });
    }

    get transformedData() {
        if(this.flowInfo){
            return {
                ...this.flowInfo,
                actionCalls: this.flowInfo.actionCalls.map(action => ({
                    ...action,
                    inputParameterName: action.inputParameters.length > 0 ? action.inputParameters[0].name : '',
                    inputParameterElementReference: action.inputParameters.length > 0 ? action.inputParameters[0].value.elementReference : ''
                }))
            };
        }  return {};
        
    }


    // TO-DO: Eliminar esta funcion
    buildFlowInfoObject(rawJSON) {

        let attributes = rawJSON.attributes;
        let metadata = rawJSON.Metadata;

        //This section builds URL to Flow Builder and FlowID
        let parts = attributes.url.split('/')
        let auxID = parts[parts.length - 1]
        this.flowInformation.flowId = auxID
        this.flowInformation.URLtoFlowBuilder = `${window.location.origin}/builder_platform_interaction/flowBuilder.app?flowId=${auxID}`
        ////////////////////////////////////////////////////

        this.flowInformation.apiVersion = metadata.apiVersion;
        this.flowInformation.label = metadata.label;
        this.flowInformation.description = (metadata.description === null) ? 'No description' : metadata.description
        this.flowInformation.status = metadata.status;
        this.flowInformation.processType = metadata.processType;

        this.flowInformation.start = metadata.start;
        this.flowInformation.decisions = metadata.decisions //!(!metadata.decisions.length) //T o F si hay decisiones
        this.flowInformation.actionCalls = metadata.actionCalls;

        this.flowInformation.recordsCreates = metadata.recordsCreates;
        this.flowInformation.recordsDeletes = metadata.recordsDeletes;
        this.flowInformation.recordsLookups = metadata.recordsLookups;
        this.flowInformation.recordsUpdates = metadata.recordsUpdates;

        this.flowInformation.subflows = metadata.subflows;

        this.flowInformation.variables = metadata.variables;
        this.flowInformation.formulas = metadata.formulas;
        this.flowInformation.constants = metadata.constants;



        console.log(JSON.stringify(this.flowInformation))
    }
}