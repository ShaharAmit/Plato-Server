var firebase1 = require('../services/firebase.js');
const Promise = require('es6-promise');

class App {
    fb: any;
    constructor() {
        this.fb = new firebase1();
        this.shaharTests();
    }
    shaharTests() {
        try {
            // Listen for any change on document and prints it's values
            // can send values to another functions or anything...
            let unsubscribe = this.fb.db.collection('Customers')
                .onSnapshot(docs => {
                    docs.forEach(doc => {
                        console.log("Current data: ", doc.data());
                    });
            });
            //to stop listener run -> unsubscribe() **or any variable name that equal the listener;
        } catch(err) {
            console.log(err);
        }
    }

    danielLuzTests () {
        const ref = this.fb.db.doc
    }

    loraineTests () {
        console.log('test')
    }

    danaIgraTests () {
        
    }

    danielYosefTests () {
        
    }

    helloTest() {
        console.log('hey');
    }

}
module.exports = App;
new App();
