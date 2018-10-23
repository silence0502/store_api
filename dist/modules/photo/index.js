"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Plugo = require("plugo");
exports.register = (plugin, options, next) => {
    Plugo.expose({ name: 'handlers', path: __dirname + '/handlers' }, plugin, function () {
        let handlers = plugin.plugins.photo.handlers;
        plugin.route([
            { method: 'POST', path: '/photos', config: handlers.Admin.photo_create },
            { method: 'GET', path: '/photos', config: handlers.Admin.photo_list },
            { method: 'GET', path: '/photos/{id}', config: handlers.Admin.photo_info },
            { method: 'GET', path: '/report/{id}', config: handlers.Admin.report_info },
            { method: 'GET', path: '/report_impurity/{id}', config: handlers.Admin.report_impurity_info },
            { method: 'POST', path: '/images', config: handlers.Admin.photo_add },
            { method: 'DELETE', path: '/photos/{id}', config: handlers.Admin.photo_delete },
        ]);
        next();
    });
};
exports.register.attributes = {
    name: 'photo'
};
