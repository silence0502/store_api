"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
let configPath = path.join(path.dirname(fs.realpathSync(__filename)), '../config.json');
let config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
exports.default = config;
