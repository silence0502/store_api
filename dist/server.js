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
const Glue = require("glue");
const manifest_1 = require("./config/manifest");
const config_1 = require("./config/config");
const token_1 = require("./token");
const database = config_1.default.database;
Glue.compose(manifest_1.default, { relativeTo: __dirname }, (err, server) => {
    if (err) {
        console.log("server.register err:", err);
    }
    global.models =
        server.plugins["hapi-sequelize"][database.dbname].models;
    global.cache = server.cache({
        segment: "demo_cache",
        expiresIn: 24 * 60 * 60 * 1000
    });
    server.start(() => __awaiter(this, void 0, void 0, function* () {
        console.log("✅  Server is listening on " + server.info.uri.toLowerCase());
        let token = yield token_1.default.getToken();
    }));
});
