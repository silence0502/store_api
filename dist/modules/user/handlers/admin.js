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
const md5 = require("md5");
const Boom = require("boom");
/**
 * 创建用户
 * @param user 用户对象
 */
let createUser = function (user) {
    return models.user.create(user);
};
/**
 * 获取用户信息
 * @param user 用户对象
 */
let infoUser = function (id) {
    return models.user.findById(id);
};
/**
 * 创建门店
 * @param store 门店对象
 */
let createStore = function (store) {
    return models.store.create(store);
};
/**
 * 创建联系
 * @param store 联系对象
 */
let userCreateStore = function (user_store) {
    return models.user_store.create(user_store);
};
/**
 * 登录
 * @param email 用户名
 * @param password 密码
 */
let login = function (email, password) {
    return new Promise(function (resolve, reject) {
        models.user.findOne({ where: { email: email } }).then(function (user) {
            user && user.password === md5(password) ? resolve(user) : resolve(false);
        });
    });
};
/**
 * 门店列表
 * * @param request 查询信息对象
 */
let list_store_arr = (request) => {
    return models.user_store.findAll({
        attributes: ['store_id'],
        where: {
            user_id: request.params.user_id
        }
    });
};
let list_store = (paramArr) => {
    let arr = [];
    for (let i = 0; i < paramArr.length; i++) {
        arr.push(paramArr[i].store_id);
    }
    return models.store.findAll({
        attributes: ['id', 'name'],
        where: {
            id: {
                $in: arr
            }
        }
    });
};
module.exports.user_create = {
    handler: function (request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let _user = request.payload;
                _user.password = md5(_user.password);
                let result = yield createUser(_user);
                return reply(result);
            }
            catch (err) {
                return reply(Boom.badRequest("创建用户失败"));
            }
        });
    }
};
module.exports.user_info = {
    handler: function (request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = request.params.user_id;
                let result = yield infoUser(id);
                return reply(result);
            }
            catch (err) {
                return reply(Boom.badRequest("创建用户失败"));
            }
        });
    }
};
module.exports.stores_list = {
    handler: function (request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let arr = yield list_store_arr(request);
                let result = yield list_store(arr);
                return reply(result);
            }
            catch (err) {
                return reply(Boom.badRequest("获取用户信息失败"));
            }
        });
    }
};
module.exports.store_create = {
    handler: function (request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield createStore(request.payload);
                return reply(result);
            }
            catch (err) {
                return reply(Boom.badRequest("创建门店失败"));
            }
        });
    }
};
module.exports.user_stores_create = {
    handler: function (request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield userCreateStore(request.payload);
                return reply(result);
            }
            catch (err) {
                return reply(Boom.badRequest("创建联系失败"));
            }
        });
    }
};
module.exports.login = {
    handler: function (request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let email = request.payload.email, password = request.payload.password, user = yield login(email, password);
                if (!user) {
                    return reply(Boom.create(400, '用户名或密码错误', { timestamp: Date.now() }));
                }
                else {
                    return reply(user);
                }
            }
            catch (err) {
                request.log('error', err);
                return reply(Boom.badRequest("登录失败"));
            }
        });
    }
};
module.exports.logout = {
    handler: function (request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                request.session = {};
                return reply({}).code(204);
            }
            catch (err) {
                request.log('error', err);
                return reply(Boom.badRequest("退出登录失败"));
            }
        });
    }
};
