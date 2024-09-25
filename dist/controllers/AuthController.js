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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongodb_1 = require("mongodb");
const auth = {
    secret: String(process.env.SECRET),
    expires: '1h',
};
exports.default = new class AuthController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const userInfo = yield db_1.collections.users.find({ email: email }).toArray();
                if (!userInfo[0]) {
                    return res.status(422).json({ msg: "user not found" });
                }
                if (userInfo[0]) {
                    const match = yield bcrypt_1.default.compare(password, userInfo[0].password);
                    if (match) {
                        const token = yield jsonwebtoken_1.default.sign({
                            _id: userInfo[0]._id,
                            name: userInfo[0].name,
                            email: userInfo[0].email
                        }, auth.secret, {
                            expiresIn: auth.expires,
                        });
                        res.status(200).json({ token: token, id: userInfo[0]._id });
                    }
                    else {
                        res.status(401).json({ msg: "Invalid Credentials" });
                    }
                }
                else {
                    res.json({ msg: "Invalid Credentials" });
                }
            }
            catch (e) {
                res.status(500).json({
                    msg: 'something is wrong...'
                });
                console.log(e);
            }
        });
    }
    checkToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const id = req.params.idUser;
                const objectId = new mongodb_1.ObjectId(id);
                let user;
                const userInfo = yield db_1.collections.users.find({ _id: objectId }).toArray();
                user = userInfo[0];
                try {
                    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
                    const authorization = req.headers;
                    if (!token) {
                        console.log(authorization);
                        return res.status(401).json({ msg: 'No token provided.' });
                    }
                    let decoded;
                    if (typeof (jsonwebtoken_1.default.verify(token, auth.secret)) == String.prototype) {
                        decoded = JSON.parse(jsonwebtoken_1.default.verify(token, auth.secret).toString());
                    }
                    else {
                        decoded = jsonwebtoken_1.default.verify(token, auth.secret);
                    }
                    next();
                }
                catch (e) {
                    console.log(e);
                    res.status(401).json({ msg: "invalid token" });
                }
            }
            catch (e) {
                console.log(e);
                res.status(500).json({
                    msg: "something is wrong..."
                });
            }
        });
    }
};
//# sourceMappingURL=AuthController.js.map