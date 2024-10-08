"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const dotenv = __importStar(require("dotenv"));
const UserController_1 = __importDefault(require("./controllers/UserController"));
const AuthController_1 = __importDefault(require("./controllers/AuthController"));
const cors_1 = __importDefault(require("cors"));
dotenv.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = process.env.PORT;
const options = {
    methods: "GET,OPTIONS,POST,PUT,DELETE",
    origin: "*",
    credentials: true,
    allowedHeaders: "Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
};
app.use((0, cors_1.default)(options));
(0, db_1.connectToDatabase)().then(() => {
    //==========================User============================
    app.post('/register/psychologist', UserController_1.default.register);
    //=============================AUTH================================
    app.post('/auth/login', AuthController_1.default.login);
    //==============================SERVER=============================
    app.get('/', (req, res) => {
        res.status(200).json({
            msg: 'everything is on...'
        });
    });
    app.listen(port, () => {
        return console.log(`Server is listening on ${port}`);
    });
}).catch((e) => {
    console.log('Database connection failed...');
});
//# sourceMappingURL=index.js.map