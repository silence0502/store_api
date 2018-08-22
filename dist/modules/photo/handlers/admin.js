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
const _ = require("lodash");
const Boom = require("boom");
/**
 * 添加图片
 * @param photo 用户对象
 */
let createPhoto = function (photo) {
    return models.photos.create(photo);
};
/**
 * 图片详情
 * @param photo 用户对象
 */
let photoInfo = function (id) {
    return models.photos.findById(id);
};
/**
 * 照片列表
 * @param request
 */
let list_photo = (request) => {
    let query = request.query, options = {
        // attributes: ['id', 'name', 'desc', 'cover', 'category', 'created_at'],
        where: {},
        order: [],
        limit: 50,
        offset: 0,
    };
    // if (query.query_key && query.query_key != '') {
    //     options.where['name'] = {
    //         $like: `%${query.query_key}%`
    //     }
    // }
    if (query.store && query.store != '') {
        options.where['store'] = query.store;
    }
    if (query.sort && query.sort != '') {
        options.order.push(_.split(query.sort, ' '));
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
                let result = yield createPhoto(request.payload);
                return reply(result);
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
