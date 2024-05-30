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
            this.getFlowNameAndStatus(this._selectedFlowItem)
            this.getFlowMetadata(this.flowName, this.flowStatus);
        }
    }

    flowName;
    flowStatus;
    URLtoFlowBuilder

    flowInfo;
    isLoaded = false;

    connectedCallback() {
        console.log('Hello JS from c-flowInfo')
    }


    /**
     * UTIL FUNCTION
     * This foo extracts the flowName and flowStatus from item selected in <c-flow-selector>.
     * @param {*} flowNameAndStatus - String pattern with flowName and flowStatus -> 'flowName[flowStatus]'.
     */
    getFlowNameAndStatus(flowNameAndStatus) {
        let bracketIndex = flowNameAndStatus.indexOf('[');
        this.flowName = flowNameAndStatus.substring(0, bracketIndex).trim();
        this.flowStatus = flowNameAndStatus.substring(bracketIndex + 1, flowNameAndStatus.length - 1).trim();

        console.log(`Flow Name1: ${this.flowName}`);
        console.log(`Status1: ${this.flowStatus}`);
    }


    /**
     * This function makes a query to Salesforce ToolingAPI in order to get the flow metadata.
     * @param {*} flowName - Flow name we get in the previous function.
     * @param {*} flowStatus - Flow status we get in the previous function. The status is necesary because it is possible
     *                         to have flow with many version. Example: v1 Obsolete, v2 Active
     */
    getFlowMetadata(flowName, flowStatus) {
        let queryString = `SELECT Metadata FROM Flow WHERE MasterLabel='${flowName}' AND Status='${flowStatus}'`

        //Apex method call to make a query to ToolingAPI.
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

                this.flowInfo.description = (this.flowInfo.description===null)?'No description':this.flowInfo.description
                this.isLoaded = true;
            })
            .catch(error => {
                console.error('c-flowInfo - Error querying Tooling API2:', error);
            });
    }

    
    /**
     * This function plains the flow metadata object in order to iterate and access nested attributes in the HTML
     */
    get transformedData() {
        if(this.flowInfo){
            return {
                ...this.flowInfo,
                actionCalls: this.flowInfo.actionCalls.map(action => ({
                    ...action,
                    inputParameterName: action.inputParameters.length > 0 ? action.inputParameters[0].name : '',
                    inputParameterElementReference: action.inputParameters.length > 0 ? action.inputParameters[0].value.elementReference : ''
                })),
                decisions: this.flowInfo.decisions.map(decision => ({
                    label: decision.label,
                    name: decision.name,
                    rules: decision.rules.map(rule => ({
                        label: rule.label,
                        name: rule.name,
                        conditions: rule.conditions.map(condition => ({
                            leftValueReference: condition.leftValueReference,
                            operator: condition.operator,
                            rightValue: condition.rightValue.stringValue
                        })),
                        connectorTarget: rule.connector ? rule.connector.targetReference : ''
                    }))
                })),
                subflows: this.flowInfo.subflows.map(subflow => ({
                    label: subflow.label,
                    name: subflow.name,
                    inputAssignments: subflow.inputAssignments.map(input => ({
                        name: input.name,
                        value: input.value.elementReference || input.value.stringValue
                    }))
                })),
                variables: this.flowInfo.variables.map(variable => ({
                    name: variable.name,
                    dataType: variable.dataType,
                    isCollection: variable.isCollection,
                    isInput: variable.isInput,
                    isOutput: variable.isOutput
                })),
                formulas: this.flowInfo.formulas.map(formula => ({
                    name: formula.name,
                    expression: formula.expression,
                    dataType: formula.dataType
                })),
                constants: this.flowInfo.constants.map(constant => ({
                    name: constant.name,
                    value: constant.value,
                    dataType: constant.dataType
                })),
                recordDeletes: this.flowInfo.recordDeletes.map(recordDelete => ({
                    label: recordDelete.label,
                    name: recordDelete.name,
                    object: recordDelete.object
                })),
                recordLookups: this.flowInfo.recordLookups.map(recordLookup => ({
                    label: recordLookup.label,
                    name: recordLookup.name,
                    object: recordLookup.object,
                    filters: recordLookup.filters.map(filter => ({
                        field: filter.field,
                        operator: filter.operator,
                        value: filter.value.stringValue
                    }))
                })),
                recordUpdates: this.flowInfo.recordUpdates.map(recordUpdate => ({
                    label: recordUpdate.label,
                    name: recordUpdate.name,
                    object: recordUpdate.object
                }))
            };
        }  return {};
    }

    
    /**
     * GETTERS SECTION
     * This getters are used in order to render an accordion-section if there is data.
     */

    get hasActionCalls() {
        return this.transformedData.actionCalls && this.transformedData.actionCalls.length > 0;
    }
    
    get hasDecisions() {
        return this.transformedData.decisions && this.transformedData.decisions.length > 0;
    }

    get hasStart() {
        return this.transformedData.start && Object.keys(this.transformedData.start).length > 0;
    }

    get hasSubflows() {
        return this.transformedData.subflows && this.transformedData.subflows.length > 0;
    }

    get hasVariables() {
        return this.transformedData.variables && this.transformedData.variables.length > 0;
    }

    get hasFormulas() {
        return this.transformedData.formulas && this.transformedData.formulas.length > 0;
    }

    get hasConstants() {
        return this.transformedData.constants && this.transformedData.constants.length > 0;
    }

    get hasRecordCreates() {
        return this.transformedData.recordCreates && this.transformedData.recordCreates.length > 0;
    }

    get hasRecordDeletes() {
        return this.transformedData.recordDeletes && this.transformedData.recordDeletes.length > 0;
    }

    get hasRecordLookups() {
        return this.transformedData.recordLookups && this.transformedData.recordLookups.length > 0;
    }

    get hasRecordUpdates() {
        return this.transformedData.recordUpdates && this.transformedData.recordUpdates.length > 0;
    }

}