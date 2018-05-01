var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var firebase1 = require('../services/firebase.js');
class App {
    constructor() {
        this.fb = new firebase1();
        this.shaharTests();
    }
    shaharTests() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const func = this.helloTest;
                // Listen for any change on document and prints it's values
                // can send values to another functions or anything...
                let unsubscribe = yield this.fb.db.doc('Customers/XYSD2ZCHf4P6RQY56vlga5h6CyE2')
                    .onSnapshot(function (doc) {
                    console.log("Current data: ", doc.data());
                    //run helloTest()
                    func();
                }, function (err) {
                    console.log(err);
                });
                //to stop listener run -> unsubscribe() **or any variable name that equal the listener;
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    danielLuzTests() {
        const ref = this.fb.db.doc;
    }
    loraineTests() {
    }
    danaIgraTests() {
    }
    danielYosefTests() {
    }
    helloTest() {
        console.log('hey');
    }
}
module.exports = App;
new App();
//# sourceMappingURL=app.js.map