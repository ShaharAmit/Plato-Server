var firebase1 = require('../services/firebase.js');
// const Promise = require('es6-promise');
var App = /** @class */ (function () {
    function App() {
        this.fb = new firebase1();
        //this.shaharTests();
        // this.danaIgraTests();
        this.test123();
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
        console.log("start dana func");
        var req;
        var dish = this.fb.db.doc(req.query.path);
        dish.update({
            status: 2
        }).then(function () {
            console.log("dish changed");
        })["catch"](function (err) {
            console.log("err");
        });
    };
    App.prototype.danielYosefTests = function () {
    };
    App.prototype.helloTest = function () {
        console.log('hey');
    };
    App.prototype.test123 = function () {
        this.fb.db.collection(`/RestAlfa/kibutz-222/Orders/1524998020/meals/j55652Oakv7jc3f6Iogh/dishes/Burger/groceries`).get().then(docs => {
            const materials = {};
            docs.forEach(doc => {
                const data = doc.data();
                Object.keys(data.rawMaterial).forEach(material => {
                    if(materials[material]) {
                        materials[material] += data.rawMaterial[material];
                    }
                    else {
                        materials[material] = data.rawMaterial[material];
                    }
                });
            });
           
            const WarehouseStockCollection = this.fb.db.collection(`/RestAlfa/kibutz-222/WarehouseStock`);
            Object.keys(materials).forEach(material => {
                console.log()
                WarehouseStockCollection.doc(material).get().then(x => {
                    const data = x.data();
                    data.value.amount -= materials[material];
                    WarehouseStockCollection.doc(material).set(data).then(x => {
                        debugger;
                    }).catch(x => {
                        debugger;
                    });
                    console.log(data);
                })
            });
           
        });
    };
    return App;
}());
module.exports = App;
new App();
