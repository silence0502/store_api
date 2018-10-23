import * as _ from 'lodash'
import * as Boom from 'boom'
var request = require('request')
const axios = require('axios')

import config from "../../../config/config";
import Token from "../../../token";

declare let models: any;

/**
 * 添加图片
 * @param photo 用户对象
 */
let createPhoto = function (photo: Object) {
    return models.photos.create(photo)
}

/**
 * 拿图片的base64码
 * @param photo 
 */
let getImgBase64 = (imgUrl) => {
    return new Promise((resolve, reject) => {
        request({
            url: imgUrl,
            encoding: "base64",
        }, (err, res, base64) => {
            resolve(base64)
        })
    })
}

/**
 * 排序
 * @param photo 
 */
let order = (object, op) => {
    function sequence(a, b) {
        if (a.location[op] > b.location[op]) {
            return 1;
        } else if (a.location[op] < b.location[op]) {
            return -1
        } else {
            return 0;
        }
    }
    return object.sort(sequence)
}

/**
 * 分组
 * @param photo 
 */
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
                else if (Math.abs(element.location.top - row[0].location.top) < config.ratio.group) {
                    row.push(element);
                    element['done'] = true;
                }
            } else {
                count++
            }
        }
        m.push(order(row, 'left'));
    }
    return m;
}

/**
 * 看规格
 * @param photo 
 */
let circle = (object) => {
    let count = 1
    for (let i = 0; i < object.length; i++) {
        for (let j = 0; j < object[i].length; j++) {
            let compair = object[i][j].location.width / object[i][j].location.height;
            let acreage = object[i][j].location.width * object[i][j].location.height;
            object[i][j]["count"] = count;
            if (compair >= config.ratio.compair_min && compair <= config.ratio.compair_max) {
                object[i][j]["compair"] = true;
            } else {
                object[i][j]["compair"] = false;
            }
            if (acreage >= config.ratio.s_min && acreage <= config.ratio.s_max) {
                object[i][j]["acreage"] = 1;
            } else if (acreage > config.ratio.s_max) {
                object[i][j]["acreage"] = 2;
            } else {
                object[i][j]["acreage"] = 0;
            }
            count++
        }
    }
    return object;
}

/**
 * 把report_id加入表
 * * @param 
 */
let updateReportId = (id, data) => {
    return models.photos.update(data, {
        where: {
            id: id
        }
    })
}

/**
 * 向report表加数据
 * * @param 
 */
let crateReport = (arroy, report_id) => {
    let arr: any = []
    arroy.map((item, index) => {
        item.map((items, indexs) => {
            let quality_com: any
            let quality_acr: any
            if (items.compair) {
                quality_com = '圆'
            } else {
                quality_com = '非圆'
            }
            if (items.acreage === 1) {
                quality_acr = '合格'
            } else if (items.acreage === 2) {
                quality_acr = '偏大'
            } else {
                quality_acr = '偏小'
            }
            arr.push({ report_id: report_id, num: items.count, type: 1, height: items.location.height, width: items.location.width, top: items.location.top, left: items.location.left, quality: quality_com })
            arr.push({ report_id: report_id, num: items.count, type: 2, height: items.location.height, width: items.location.width, top: items.location.top, left: items.location.left, quality: quality_acr })
        })
    })
    return models.report.bulkCreate(arr)
}

/**
 * 请求百度接口
 * @param photo 
 */
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
                resolve(response.data)
            })
            .catch(function (error) {
                resolve(error)
            })
    })
}

/**
 * 请求百度接口
 * @param photo 
 */
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
                resolve(response.data)
            })
            .catch(function (error) {
                resolve(error)
            })
    })
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
 * 分析删除
 * @param photo 用户对象
 */
let reportDelte = function (report_id: string) {
    return models.report.destroy({
        where: {
            report_id: report_id
        }
    })
}

/**
 * 根据reportId查询每个饼详情
 * @param photo 
 */
let reportInfo = function (report_id: string) {
    return models.report.findAll({
        where: {
            report_id: report_id
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
            let obj = await createPhoto(request.payload)
            let imgBase64 = await getImgBase64(request.payload.img)
            let token = await Token.getToken()
            let imgInfo: any = await getImgInfo(imgBase64, token)
            let orderArr = order(imgInfo.results, 'top')
            let groupArr = group(orderArr)
            let circleArr = circle(groupArr)
            let data = { report_id: imgInfo.log_id }
            let reportId = await updateReportId(obj.id, data)
            let result = crateReport(circleArr, imgInfo.log_id)
            return reply(result)
        }
        catch (err) {
            return reply(Boom.badRequest("添加图片失败"))
        }
    }
};

module.exports.photo_add = {
    handler: async function (request, reply) {
        try {
            let imgBase64 = await getImgBase64(request.payload.img)
            let token = await Token.getToken()
            let imgInfo: any = await getImgInfo(imgBase64, token)
            let imgImpurityInfo: any = await getImpurityImgInfo(imgBase64, token)
            if (imgImpurityInfo.results.length > 0) {
                return reply(imgImpurityInfo)
            }
            // let orderArr = order(imgInfo.results, 'top')
            // let groupArr = group(orderArr)
            // let circleArr = circle(groupArr)
            // let data = { report_id: imgInfo.log_id }
            // let reportId = await updateReportId(request.payload.id, data)
            // let result = crateReport(circleArr, imgInfo.log_id)
            return reply("添加成功")
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

module.exports.report_info = {
    handler: async function (request, reply) {
        try {
            let { id } = request.params
            let photo_info = await photoInfo(id)
            let report_info = await reportInfo(photo_info.report_id)
            if (!report_info) return reply(Boom.badRequest('获取图片详情失败！'))
            return reply(report_info)
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
            let photo_info = await photoInfo(id)
            let result = await photoDelte(id)
            let result_1 = await reportDelte(photo_info.report_id)
            return reply({ id: id })
        }
        catch (err) {
            return reply(Boom.badRequest(err.message))
        }
    }
}