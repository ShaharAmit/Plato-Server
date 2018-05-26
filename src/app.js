var firebase1 = require('../services/firebase.js');
var Promise = require('es6-promise');
var App = /** @class */ (function () {
    function App() {
        this.fb = new firebase1();
        this.shaharTests();
    }
    App.prototype.shaharTests = function () {
        try {
            // Listen for any change on document and prints it's values
            // can send values to another functions or anything...
            var unsubscribe = this.fb.db.collection('Customers')
                .onSnapshot(function (docs) {
                docs.forEach(function (doc) {
                    console.log("Current data: ", doc.data());
                });
            });
            //to stop listener run -> unsubscribe() **or any variable name that equal the listener;
        }
        catch (err) {
            console.log(err);
        }
    };
    App.prototype.danielLuzTests = function () {
        var ref = this.fb.db.doc;
    };
    App.prototype.loraineTests = function () {
        console.log('test');
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
