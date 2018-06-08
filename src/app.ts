var firebase1 = require('../services/firebase.js'),
request = require('request');
import {Promise} from 'es6-promise';


class App {
    fb: any;
    constructor() {
        this.fb = new firebase1();
        this.shaharTests();
        // this.danaIgraTests();
        // this.test123();
    }
    shaharTests() {
        try {
            request('https://maps.googleapis.com/maps/api/timezone/json?location=31.983621,34.770766&timestamp=1527713490&key=AIzaSyAieQ7Jq2rYkjMPgOqTLe9FM4Pcblt1M0k', { json: true }, (err, res, body) => {
                if (err) { return console.log(err); }
                console.log(body);
            });
                
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
