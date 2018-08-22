"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Glue = require("glue");
const manifest_1 = require("./config/manifest");
const config_1 = require("./config/config");
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
    server.start(() => {
        console.log("✅  Server is listening on " + server.info.uri.toLowerCase());
    });
});
