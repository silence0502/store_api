'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require('uuid');
const fs = require('fs');
var mkdirp = require('mkdirp');
const Jimp = require("jimp");
const _ = require("lodash");
let mkdir = function (path) {
    return new Promise((resolve, reject) => {
        mkdirp(path, function (err) {
            if (err) {
                reject(new Error('创建文件夹失败.'));
            }
            resolve(true);
        });
    });
};
const uploader = function (file, options) {
    if (!file) {
        throw new Error('No file to upload');
    }
    return _fileHandler(file, options);
};
const _fileHandler = function (file, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const originalname = _.toLower(file.hapi.filename);
        const filename = `${uuid.v1()}.${_extension(originalname)}`;
        if (fileFilter(originalname)) {
            throw new Error('不支持的文件类型.');
        }
        else {
            let _fileType = fileType(originalname);
            let d = new Date();
            let datastr = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
            yield mkdir(`${options.dest}${_fileType}/${datastr}`);
            const path = `${options.dest}${_fileType}/${datastr}/${filename}`;
            const rpath = `${_fileType}/${datastr}/${filename}`;
            const filestream = fs.createWriteStream(path);
            return new Promise((resolve, reject) => {
                file.on('error', function (err) {
                    reject(err);
                });
                file.pipe(filestream);
                file.on('end', function (err) {
                    if (err)
                        reject(err);
                    if (_fileType == 'pic') {
                        if (options.w) {
                            Jimp.read(path, function (err, image) {
                                if (err)
                                    reject(err);
                                image.cover(options.w, options.h).write(path);
                                resolve({ path: rpath, name: filename });
                            });
                        }
                        else {
                            resolve({ path: rpath, name: filename });
                        }
                    }
                    else {
                        resolve({ path: rpath, name: filename });
                    }
                });
            });
        }
    });
};
const fileFilter = function (fileName) {
    if (fileName.match(/\.(jpg|png|apk|zip|mp3|mp4|doc|docx|xls|xlsx|pdf|txt|md)$/)) {
        return false;
    }
    return true;
};
const fileType = function (fileName) {
    if (fileName.match(/\.(jpg|jpeg|png|gif|)$/)) {
        return 'pic';
    }
    if (fileName.match(/\.(mp3)$/)) {
        return 'audio';
    }
    if (fileName.match(/\.(mp4)$/)) {
        return 'video';
    }
    if (fileName.match(/\.(apk|zip)$/)) {
        return 'app';
    }
    if (fileName.match(/\.(doc|docx|xls|xlsx|pdf|txt|md)$/)) {
        return 'doc';
    }
    return false;
};
const _extension = function (fileName) {
    const arr = fileName.split('.');
    const item = arr.length - 1;
    return arr[item];
};
module.exports = uploader;
