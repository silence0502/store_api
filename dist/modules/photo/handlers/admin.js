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
var request = require('request');
const axios = require('axios');
const config_1 = require("../../../config/config");
const token_1 = require("../../../token");
let createPhoto = function (photo) {
    return models.photos.create(photo);
};
let getImgBase64 = (imgUrl) => {
    return new Promise((resolve, reject) => {
        request({
            url: imgUrl,
            encoding: "base64",
        }, (err, res, base64) => {
            resolve(base64);
        });
    });
};
let order = (object, op) => {
    function sequence(a, b) {
        if (a.location[op] > b.location[op]) {
            return 1;
        }
        else if (a.location[op] < b.location[op]) {
            return -1;
        }
        else {
            return 0;
        }
    }
    return object.sort(sequence);
};
let group = (object) => {
    let count = 0, m = [];
    while (count < object.length) {
        let first = true;
        let row = [];
        for (let index = 0; index < object.length; index++) {
            const element = object[index];
            if (!element['done']) {
                if (first) {
                    first = false;
                    row.push(element);
                    element['done'] = true;
                }
                else if (Math.abs(element.location.top - row[0].location.top) < config_1.default.ratio.group) {
                    row.push(element);
                    element['done'] = true;
                }
            }
            else {
                count++;
            }
        }
        m.push(order(row, 'left'));
    }
    return m;
};
let circle = (object) => {
    let count = 1;
    for (let i = 0; i < object.length; i++) {
        for (let j = 0; j < object[i].length; j++) {
            let compair = object[i][j].location.width / object[i][j].location.height;
            let acreage = object[i][j].location.width * object[i][j].location.height;
            object[i][j]["count"] = count;
            if (compair >= config_1.default.ratio.compair_min && compair <= config_1.default.ratio.compair_max) {
                object[i][j]["compair"] = true;
            }
            else {
                object[i][j]["compair"] = false;
            }
            if (acreage >= config_1.default.ratio.s_min && acreage <= config_1.default.ratio.s_max) {
                object[i][j]["acreage"] = 1;
            }
            else if (acreage > config_1.default.ratio.s_max) {
                object[i][j]["acreage"] = 2;
            }
            else {
                object[i][j]["acreage"] = 0;
            }
            count++;
        }
    }
    return object;
};
let updateReportId = (id, data) => {
    return models.photos.update(data, {
        where: {
            id: id
        }
    });
};
let crateReport = (arroy, report_id) => {
    let arr = [];
    arroy.map((item, index) => {
        item.map((items, indexs) => {
            let quality_com;
            let quality_acr;
            if (items.compair) {
                quality_com = '圆';
            }
            else {
                quality_com = '非圆';
            }
            if (items.acreage === 1) {
                quality_acr = '合格';
            }
            else if (items.acreage === 2) {
                quality_acr = '偏大';
            }
            else {
                quality_acr = '偏小';
            }
            arr.push({ report_id: report_id, num: items.count, type: 1, height: items.location.height, width: items.location.width, top: items.location.top, left: items.location.left, quality: quality_com });
            arr.push({ report_id: report_id, num: items.count, type: 2, height: items.location.height, width: items.location.width, top: items.location.top, left: items.location.left, quality: quality_acr });
        });
    });
    return models.report.bulkCreate(arr);
};
let getImgInfo = (imgBase64, token) => {
    return new Promise((resolve, reject) => {
        axios({
            url: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/detection/baibing-position',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                access_token: token,
            },
            data: {
                image: imgBase64,
                top_num: 5
            }
        })
            .then(function (response) {
            resolve(response.data);
        })
            .catch(function (error) {
            resolve(error);
        });
    });
};
let getImpurityImgInfo = (imgBase64, token) => {
    return new Promise((resolve, reject) => {
        axios({
            url: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/detection/baibing-zazhi',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                access_token: token,
            },
            data: {
                image: imgBase64,
                top_num: 5
            }
        })
            .then(function (response) {
            resolve(response.data);
        })
            .catch(function (error) {
            resolve(error);
        });
    });
};
let photoInfo = function (id) {
    return models.photos.findById(id);
};
let photoDelte = function (id) {
    return models.photos.destroy({
        where: {
            id: id
        }
    });
};
let reportDelte = function (report_id) {
    return models.report.destroy({
        where: {
            report_id: report_id
        }
    });
};
let reportInfo = function (report_id) {
    return models.report.findAll({
        where: {
            report_id: report_id
        }
    });
};
let list_photo = (request) => {
    let query = request.query, options = {
        where: {},
        order: 'id desc',
        limit: 50,
        offset: 0,
    };
    if (query.store && query.store != '') {
        options.where['store'] = query.store;
    }
    if (query.page_size && query.page_size != '') {
        options.limit = query.page_size;
    }
    if (query.page_num && query.page_num != '') {
        options.offset = query.page_num * options.limit;
    }
    return models.photos.findAndCount(options);
};
module.exports.photo_create = {
    handler: function (request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let obj = yield createPhoto(request.payload);
                let imgBase64 = yield getImgBase64(request.payload.img);
                let token = yield token_1.default.getToken();
                let imgInfo = yield getImgInfo(imgBase64, token);
                let orderArr = order(imgInfo.results, 'top');
                let groupArr = group(orderArr);
                let circleArr = circle(groupArr);
                let data = { report_id: imgInfo.log_id };
                let reportId = yield updateReportId(obj.id, data);
                let result = crateReport(circleArr, imgInfo.log_id);
                return reply(result);
            }
            catch (err) {
                return reply(Boom.badRequest("添加图片失败"));
            }
        });
    }
};
module.exports.photo_add = {
    handler: function (request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let imgBase64 = yield getImgBase64(request.payload.img);
                let token = yield token_1.default.getToken();
                let imgInfo = yield getImgInfo(imgBase64, token);
                let imgImpurityInfo = yield getImpurityImgInfo(imgBase64, token);
                if (imgImpurityInfo.results.length > 0) {
                    return reply(imgImpurityInfo);
                }
                return reply("添加成功");
            }
            catch (err) {
                return reply(Boom.badRequest("添加图片失败"));
            }
        });
    }
};
module.exports.photo_list = {
    handler: function (request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield list_photo(request);
                reply(result);
            }
            catch (err) {
                reply(Boom.badRequest('查询场景列表失败!'));
            }
        });
    }
};
module.exports.photo_info = {
    handler: function (request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id } = request.params;
                let photo_info = yield photoInfo(id);
                if (!photo_info)
                    return reply(Boom.badRequest('获取图片详情失败！'));
                return reply(photo_info);
            }
            catch (err) {
                return reply(Boom.badRequest(err.message));
            }
        });
    }
};
module.exports.report_info = {
    handler: function (request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id } = request.params;
                let photo_info = yield photoInfo(id);
                let report_info = yield reportInfo(photo_info.report_id);
                if (!report_info)
                    return reply(Boom.badRequest('获取图片详情失败！'));
                return reply(report_info);
            }
            catch (err) {
                return reply(Boom.badRequest(err.message));
            }
        });
    }
};
module.exports.photo_delete = {
    handler: function (request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id } = request.params;
                let photo_info = yield photoInfo(id);
                let result = yield photoDelte(id);
                let result_1 = yield reportDelte(photo_info.report_id);
                return reply({ id: id });
            }
            catch (err) {
                return reply(Boom.badRequest(err.message));
            }
        });
    }
};
