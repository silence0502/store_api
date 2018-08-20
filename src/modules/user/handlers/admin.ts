import * as md5 from 'md5'
import * as _ from 'lodash'
import * as Boom from 'boom'
import * as Sequelize from 'sequelize'

declare let models: any;

/**
 * 创建用户
 * @param user 用户对象
 */
let createUser = function (user: Object) {
    return models.user.create(user)
}

/**
 * 创建门店
 * @param store 门店对象
 */
let createStore = function (store: Object) {
    return models.store.create(store)
}

/**
 * 创建联系
 * @param store 联系对象
 */
let userCreateStore = function (user_store: Object) {
    return models.user_store.create(user_store)
}

/**
 * 登录
 * @param email 用户名
 * @param password 密码
 */
let login = function (email: string, password: string) {
    return new Promise(function (resolve, reject) {
        models.user.findOne({ where: { email: email } }).then(function (user) {
            user && user.password === md5(password) ? resolve(user) : resolve(false);
        });
    });
}

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
    })
}
let list_store = (paramArr) => {
    let arr = []
    for (let i = 0; i < paramArr.length; i++) {
        arr.push(paramArr[i].store_id)
    }
    return models.store.findAll({
        attributes: ['id', 'name'],
        where: {
            id: {
                $in: arr
            }
        }
    })
}


module.exports.user_create = {
    handler: async function (request, reply) {
        try {
            let _user = request.payload;
            _user.password = md5(_user.password)
            let result = await createUser(_user)
            return reply(result)
        }
        catch (err) {
            return reply(Boom.badRequest("创建用户失败"))
        }
    }
};

module.exports.stores_list = {
    handler: async function (request, reply) {
        try {
            let arr = await list_store_arr(request)
            let result = await list_store(arr)
            return reply(result)
        }
        catch (err) {
            return reply(Boom.badRequest("获取用户信息失败"))
        }
    }
};

module.exports.store_create = {
    handler: async function (request, reply) {
        try {
            let result = await createStore(request.payload)
            return reply(result)
        }
        catch (err) {
            return reply(Boom.badRequest("创建门店失败"))
        }
    }
};

module.exports.user_stores_create = {
    handler: async function (request, reply) {
        try {
            let result = await userCreateStore(request.payload)
            return reply(result)
        }
        catch (err) {
            return reply(Boom.badRequest("创建联系失败"))
        }
    }
};

module.exports.login = {
    handler: async function (request, reply) {
        try {
            let email = request.payload.email,
                password = request.payload.password,
                user: any = await login(email, password);
            if (!user) {
                return reply(Boom.create(400, '用户名或密码错误', { timestamp: Date.now() }))
            } else {
                return reply(user);
            }
        }
        catch (err) {
            request.log('error', err)
            return reply(Boom.badRequest("登录失败"))
        }
    }
};

module.exports.logout = {
    handler: async function (request, reply) {
        try {
            request.session = {};
            return reply({}).code(204);
        }
        catch (err) {
            request.log('error', err)
            return reply(Boom.badRequest("退出登录失败"))
        }
    }
};