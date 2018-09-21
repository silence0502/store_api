"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Plugo = require("plugo");
exports.register = (plugin, options, next) => {
    Plugo.expose({ name: 'handlers', path: __dirname + '/handlers' }, plugin, function () {
        let handlers = plugin.plugins.user.handlers;
        plugin.route([
            { method: 'POST', path: '/users', config: handlers.Admin.user_create },
            { method: 'GET', path: '/users/touch', config: handlers.Admin.user_info },
            { method: 'POST', path: '/stores', config: handlers.Admin.store_create },
            { method: 'POST', path: '/user_stores', config: handlers.Admin.user_stores_create },
            { method: 'GET', path: '/stores/{user_id}', config: handlers.Admin.stores_list },
            { method: 'POST', path: '/login', config: handlers.Admin.login },
            { method: 'GET', path: '/logout', config: handlers.Admin.logout },
        ]);
        next();
    });
};
exports.register.attributes = {
    name: 'user'
};
