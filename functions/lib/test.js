"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase = require("../lib/firebase.js");
const fb = new firebase();
function test(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let z = yield fb.getFile(path);
            return z;
        }
        catch (err) {
            console.log(err);
            return null;
        }
    });
}
exports.handler = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let answer = yield test('Customers/304861412');
        console.log(answer);
        res.send('test ran successfully');
    });
};
//# sourceMappingURL=test.js.map