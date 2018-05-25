var firebase1 = require('../services/firebase.js');
// const Promise = require('es6-promise');

class App {
    fb: any;
    constructor() {
        this.fb = new firebase1();
        //this.shaharTests();
        this.danaIgraTests();
        // this.test123();
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
        console.log("start dana func");
         let req :{
              query: {
                path: "/RestAlfa/kibutz-222/Orders/1524998020/meals/j55652Oakv7jc3f6Iogh/dishes/Burger"
            }
        }
        const dish = this.fb.db.doc(req.query.path);
        dish.update({
         status: 2,
        }).then(()=>{
            console.log("dish changed");
        }).catch(err=>{
            console.log("err");
        });

        
    }

    danielYosefTests () {
        
    }

    helloTest() {
        console.log('hey');
    }

    test123() {
        console.log('12');
    }
}
module.exports = App;
new App();
