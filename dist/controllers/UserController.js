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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.default = new class UserConttroller {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password } = req.body;
                //Validations
                if (!name || !email || !password) {
                    return res.status(422).json({ msg: "something is null..." });
                }
                const userExists = yield db_1.collections.users.find({ email: email }).toArray();
                if (userExists[0]) {
                    return res.status(422).json({ msg: "this user is already registered" });
                }
                const salt = yield bcrypt_1.default.genSalt(12);
                const passwordHash = yield bcrypt_1.default.hash(password, salt);
                try {
                    db_1.collections.users.insertOne({
                        name,
                        email,
                        password: passwordHash
                    }).then(() => {
                        res.status(201).json({ msg: "user registered" });
                    });
                }
                catch (err) {
                    console.log(err);
                    res.status(500).json({ msg: "Server error, contact the support" });
                }
            }
            catch (err) {
                res.status(500).json({ msg: 'Sorry, there is something wrong...' });
                console.log(err);
            }
        });
    }
};
//# sourceMappingURL=UserController.js.map