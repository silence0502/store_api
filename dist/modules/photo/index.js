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
            { method: 'GET', path: '/photos/imgUrl', config: handlers.Admin.getImg },
        ]);
        next();
    });
};
exports.register.attributes = {
    name: 'photo'
};
