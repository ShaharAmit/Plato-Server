var firebase1 = require('../services/firebase.js');
var Promise = require('es6-promise');
var App = /** @class */ (function () {
    function App() {
        this.fb = new firebase1();
        this.shaharTests();
    }
    App.prototype.shaharTests = function () {
        try {
            var func_1 = this.helloTest;
            // Listen for any change on document and prints it's values
            // can send values to another functions or anything...
            var unsubscribe = this.fb.db.doc('Customers/XYSD2ZCHf4P6RQY56vlga5h6CyE2')
                .onSnapshot(function (doc) {
                console.log("Current data: ", doc.data());
                //run helloTest()
                func_1();
            }, function (err) {
                console.log(err);
            });
            //to stop listener run -> unsubscribe() **or any variable name that equal the listener;
        }
        catch (err) {
            console.log(err);
        }
    };
    App.prototype.danielLuzTests = function () {
    };
    App.prototype.loraineTests = function () {
    };
    App.prototype.danaIgraTests = function () {
    };
    App.prototype.danielYosefTests = function () {
    };
    App.prototype.helloTest = function () {
        console.log('hey');
    };
    return App;
}());
module.exports = App;
new App();
