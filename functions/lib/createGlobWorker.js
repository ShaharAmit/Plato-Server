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
exports.handler = (change, context) => __awaiter(this, void 0, void 0, function* () {
    const rest = context.params.rest, restID = context.params.restID, uid = context.params.uid, data = change.data(), ref = fb.db.doc('GlobWorkers/' + uid), batch = fb.db.batch();
    batch.set(ref, {
        name: data.name,
        role: data.role,
        email: data.email
    });
    batch.set(ref.collection('/Rest/').doc(restID), {
        [restID]: true
    });
    batch.commit().then(() => {
        console.log('created user: ', uid);
        return 0;
    }).catch(err => {
        console.error(err);
        return 0;
    });
});
//# sourceMappingURL=createGlobWorker.js.map