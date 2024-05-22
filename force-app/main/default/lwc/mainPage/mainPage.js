import { LightningElement } from 'lwc';
import queryToolingAPI from '@salesforce/apex/ToolingAPIUtility.queryToolingAPI';

export default class MainPage extends LightningElement {
    connectedCallback(){
        console.log("HELLO MainPage from JS :)")

        // Llamar al método de Apex y manejar la promesa
        queryToolingAPI({ query: 'SELECT MasterLabel FROM Flow' })
            .then(result => {
                console.log('Query result: a:', result);
            })
            .catch(error => {
                console.error('Error querying Tooling API2:', error);
            });
    }

    click(){
        console.log("clicked LWC button")
    }
}