var firebase1 = require('../services/firebase.js');
var Promise = require('es6-promise') 

class App {
    fb: any;
    constructor() {
        this.fb = new firebase1();
        this.shaharTests();
    }
    shaharTests() {
        try {
            const func = this.helloTest;
            // Listen for any change on document and prints it's values
            // can send values to another functions or anything...
            let unsubscribe = this.fb.db.doc('Customers/XYSD2ZCHf4P6RQY56vlga5h6CyE2')
                .onSnapshot(function(doc) {
                console.log("Current data: ", doc.data());
                //run helloTest()
                func();
            },function(err){
                console.log(err)
            });
            //to stop listener run -> unsubscribe() **or any variable name that equal the listener;
        } catch(err) {
            console.log(err);
        }
    }

    danielLuzTests () {

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
