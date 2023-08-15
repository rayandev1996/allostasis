"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
class Store {
    /** Initialize storage with one of the supported options */
    constructor() {
        this.storeAsync = false;
        this.type = localStorage;
    }
    /** Function to set an item storage */
    setItem(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this.storeAsync) {
                /** Browser storage */
                case false:
                    localStorage.setItem(key, value);
                    return true;
                /** Async storage */
                case true:
                    yield this.type.setItem(key, value);
                    return true;
            }
        });
    }
    /** Function to retrieve an item storage */
    getItem(key) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            switch (this.storeAsync) {
                /** Browser storage */
                case false:
                    res = localStorage.getItem(key);
                    break;
                /** Async storage */
                case true:
                    res = yield this.type.getItem(key);
                    break;
            }
            return res;
        });
    }
    /** Function to remove an item from the local storage */
    removeItem(key) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this.storeAsync) {
                /** Browser storage */
                case false:
                    localStorage.removeItem(key);
                    return true;
                /** Async storage */
                case true:
                    yield this.type.removeItem(key);
                    return true;
            }
        });
    }
}
exports.Store = Store;
