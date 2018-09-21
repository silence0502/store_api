var https = require('https');
var qs = require('querystring');

import config from "./config/config";

var Token = {
    token: '',
    updateTime: Date.now(),
    param: qs.stringify({
        'grant_type': 'client_credentials',
        'client_id': config.client.api_key,
        'client_secret': config.client.secret_key
    }),
    getTokenUrl: function () {
        return new Promise((resolve, reject) => {
            https.get(
                {
                    hostname: "aip.baidubce.com",
                    path:
                        "/oauth/2.0/token?" + this.param,
                    agent: false
                },
                function (res) {
                    let rawData = "";
                    res.on("data", chunk => {
                        rawData += chunk;
                    });
                    res.on("end", () => {
                        try {
                            resolve(JSON.parse(rawData));
                        } catch (e) {
                            reject(e);
                        }
                    });
                }
            );
        });
    },
    getToken: async function () {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.needUpdate()) {
                    let tk = await this.getTokenUrl();
                    this.token = tk.access_token
                    this.updateTime = Date.now()
                }
                resolve(this.token);
            } catch (error) {
                reject(error);
            }
        });
    },
    needUpdate: function () {
        let currentTime = Date.now()
        let minusTime = currentTime - this.updateTime
        return this.token === '' || minusTime > 20 * 60 * 60 * 24 * 1000
    }
}

export default Token