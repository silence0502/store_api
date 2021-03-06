import * as Plugo from 'plugo'

exports.register = (plugin, options, next) => {
    Plugo.expose({ name: 'handlers', path: __dirname + '/handlers' }, plugin, function () {
        let handlers = plugin.plugins.photo.handlers;
        plugin.route([
            /**
            * 添加图片信息(photo)
            */
            { method: 'POST', path: '/photos', config: handlers.Admin.photo_create },

            /**
            * 图片列表(photo)
            */
            { method: 'GET', path: '/photos', config: handlers.Admin.photo_list },

            /**
            * 图片详情(photo)
            */
            { method: 'GET', path: '/photos/{id}', config: handlers.Admin.photo_info },
        ]);
        next()
    });
};

exports.register.attributes = {
    name: 'photo'
};
