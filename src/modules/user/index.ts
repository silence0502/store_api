import * as Plugo from 'plugo'

exports.register = (plugin, options, next) => {
    Plugo.expose({ name: 'handlers', path: __dirname + '/handlers' }, plugin, function () {
        let handlers = plugin.plugins.user.handlers;
        plugin.route([
            /**
            * 添加用户(users)
            */
            { method: 'POST', path: '/users', config: handlers.Admin.user_create },

            /**
            * 获取用户信息(users)
            */
            { method: 'GET', path: '/users/touch', config: handlers.Admin.user_info },

            /**
            * 添加门店(stores)
            */
            { method: 'POST', path: '/stores', config: handlers.Admin.store_create },

            /**
            * 添加关联(user_stores)
            */
            { method: 'POST', path: '/user_stores', config: handlers.Admin.user_stores_create },

            /**
            * 获取门店列表(stores-list)
            */
            { method: 'GET', path: '/stores/{user_id}', config: handlers.Admin.stores_list },

            /**
            * 用户登录
            */
            { method: 'POST', path: '/login', config: handlers.Admin.login },

            /**
            * 用户登出
            */
            { method: 'GET', path: '/logout', config: handlers.Admin.logout },

        ]);
        next()
    });
};

exports.register.attributes = {
    name: 'user'
};
