import * as _ from 'lodash'
import * as Boom from 'boom'

declare let models: any;

/**
 * 添加图片
 * @param photo 用户对象
 */
let createPhoto = function (photo: Object) {
    return models.photos.create(photo)
}

/**
 * 图片详情
 * @param photo 用户对象
 */
let photoInfo = function (id: string) {
    return models.photos.findById(id)
}

/**
 * 图片删除
 * @param photo 用户对象
 */
let photoDelte = function (id: string) {
    return models.photos.destroy({
        where: {
            id: id
        }
    })
}

/**
 * 照片列表
 * @param request 
 */
let list_photo = (request) => {
    let query = request.query,
        options = {
            // attributes: ['id', 'name', 'desc', 'cover', 'category', 'created_at'],
            where: {},
            order: 'id desc',
            limit: 50,
            offset: 0,
        }
    // if (query.query_key && query.query_key != '') {
    //     options.where['name'] = {
    //         $like: `%${query.query_key}%`
    //     }
    // }
    if (query.store && query.store != '') {
        options.where['store'] = query.store
    }
    // if (query.sort && query.sort != '') {
    //     options.order.push(_.split(query.sort, ' '));
    // }
    if (query.page_size && query.page_size != '') {
        options.limit = query.page_size;
    }
    if (query.page_num && query.page_num != '') {
        options.offset = query.page_num * options.limit;
    }

    return models.photos.findAndCount(options)
}

module.exports.photo_create = {
    handler: async function (request, reply) {
        try {
            let result = await createPhoto(request.payload)
            return reply(result)
        }
        catch (err) {
            return reply(Boom.badRequest("添加图片失败"))
        }
    }
};

module.exports.photo_list = {
    handler: async function (request, reply) {
        try {
            let result = await list_photo(request)
            reply(result)
        }
        catch (err) {
            reply(Boom.badRequest('查询场景列表失败!'))
        }
    }
}

module.exports.photo_info = {
    handler: async function (request, reply) {
        try {
            let { id } = request.params
            let photo_info = await photoInfo(id)
            if (!photo_info) return reply(Boom.badRequest('获取图片详情失败！'))
            return reply(photo_info)
        }
        catch (err) {
            return reply(Boom.badRequest(err.message))
        }
    }
}

module.exports.photo_delete = {
    handler: async function (request, reply) {
        try {
            let { id } = request.params
            let result = await photoDelte(id)
            return reply({ id: id })
        }
        catch (err) {
            return reply(Boom.badRequest(err.message))
        }
    }
}