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
const Boom = require("boom");
const _ = require("lodash");
const config_1 = require("../../../config/config");
const uploader = require('../utils/uploader');
module.exports.upload = {
    payload: {
        output: 'stream',
        parse: true,
        maxBytes: 1048576000,
        allow: 'multipart/form-data'
    },
    handler: function (request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = request.payload;
                const file = data['file'];
                let options = data['options'];
                if (options) {
                    options = JSON.parse(options);
                }
                if (!file) {
                    return reply(Boom.badRequest('没有文件被上传'));
                }
                const fileOptions = {
                    dest: `${config_1.default.upload.path}/`
                };
                const fileDetails = yield uploader(file, _.merge(fileOptions, options));
                reply(fileDetails);
            }
            catch (err) {
                request.log('error', err);
                reply(Boom.badRequest(err.message));
            }
        });
    }
};
