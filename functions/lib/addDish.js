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
exports.handler = (data, context) => __awaiter(this, void 0, void 0, function* () {
    console.log('restId: ', data.restId);
    fb.db.collection('RestAlfa' + '/' + data.restId + '/Dishes/').doc(data.dish.name)
        .set(data.dish);
    console.log('add dish is working');
    fb.db.collection('RestAlfa' + '/' + data.restId + '/Dishes/' + data.dish.name + data.grocery.name).doc(data.grocery.name)
        .set(data.grocery.name);
    console.log('add dish is working');
});
//# sourceMappingURL=addDish.js.map