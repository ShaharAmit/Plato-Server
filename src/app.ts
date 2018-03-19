var firebase1 = require('../services/firebase.js');
var Promise: PromiseConstructor = require('es6-promise') 

class App {
    fb: any;
    constructor() {
        this.fb = new firebase1();
        this.shaharTests();
    }
    async shaharTests() {
        this.setListener('Customers/304861412', this.helloTest);
    }

    async danielLuzTests () {

    }

    async lorainTests () {
        
    }

    async danaIgraTests () {
        
    }

    async danielYosefTests () {
        
    }

    // Listen for any change on document and prints it's values
    // can send values to another functions or anything...
    setListener(path, func) {
        try {
            this.fb.db.doc(path).onSnapshot(function(doc) {
                console.log("Current data: ", doc.data());
                func();
            });
        } catch(err) {
            console.log(err);
        }
    }

    helloTest() {
        console.log('hey');
    }

}
module.exports = App;
new App();
