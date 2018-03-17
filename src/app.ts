var firebase1 = require('../services/firebase.js');
var Promise = require('es6-promise') 

class App {
    fb: any;
    constructor() {
        this.fb = new firebase1();
        this.test();
    }
    async test() {
        console.log('start debug');
        let z:any = await this.fb.getFile('items/shahar/shaharCol/shaharDoc');
        console.log(z);
    }
}
module.exports = App;
new App();
