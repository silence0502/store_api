"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
const path = require("path");
const fs = require("fs");
const config_1 = require("./config");
let modelsPath = path.join(path.dirname(fs.realpathSync(__filename)), "../modules");
let uploadsPath = path.join(path.dirname(fs.realpathSync(__filename)), `../../${config_1.default.upload.path}`);
const database = config_1.default.database;
exports.default = {
    server: {
        debug: {
            request: ["error", "received"]
        }
    },
    connections: [
        {
            host: "0.0.0.0",
            port: 8064,
            labels: ["api"],
            state: {
                strictHeader: false
            },
            routes: {
                cors: true,
                files: {
                    relativeTo: uploadsPath
                }
            }
        }
    ],
    registrations: [
        {
            plugin: {
                register: "inert",
                options: {}
            }
        },
        {
            plugin: {
                register: "blipp",
                options: {}
            }
        },
        {
            plugin: {
                register: "good",
                options: {
                    ops: {
                        interval: 1000
                    },
                    reporters: {
                        consoleReporter: [
                            {
                                module: "good-console",
                                args: [{ log: "*" }]
                            }
                        ]
                    }
                }
            }
        },
        {
            plugin: {
                register: "hapi-sequelize",
                options: [
                    {
                        name: database.dbname,
                        models: [`${modelsPath}/**/models/*.js`],
                        sequelize: new Sequelize(database.dbname, database.username, database.password, {
                            host: database.host,
                            port: database.port,
                            dialect: "postgres"
                        }),
                        sync: false,
                        forceSync: false
                    }
                ]
            }
        },
        {
            plugin: {
                register: "hapi-server-session",
                options: {
                    cookie: {
                        isSecure: false,
                        path: "/",
                        isSameSite: false
                    },
                    expiresIn: 24 * 60 * 60 * 1000,
                    key: "A*$S&D#$HS!@#1(8DC6XFD(*#CF23^S)",
                    name: "session"
                }
            }
        },
        {
            plugin: "./modules/user",
            options: {
                select: "api"
            }
        },
        {
            plugin: "./modules/photo",
            options: {
                select: "api"
            }
        },
        {
            plugin: "./modules/upload",
            options: {
                select: "api"
            }
        }
    ]
};
