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
function hello() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(hello);
        return true;
    });
}
exports.handler = function (data, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const test = yield hello();
        return 0;
    });
};
//# sourceMappingURL=docChangeExapmle.js.map