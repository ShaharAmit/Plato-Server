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
exports.handler = function (change, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const receiverID = context.params.receiverID;
        const data = change.data();
        fb.messaging.sendToTopic(receiverID, { notification: {
                title: data.title,
                body: data.body,
                click_action: data.url,
                icon: data.icon
            } }).then(function () {
            console.log('succes');
            return 0;
        }).catch(err => {
            console.error(err);
        });
    });
};
//# sourceMappingURL=sendMessage.js.map