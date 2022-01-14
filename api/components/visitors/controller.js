const https = require('https')
const TABLA = 'visitors'

module.exports = (injectedStore) => {
    let store = injectedStore
    if (!store) {
        store = require('../../../store/dummy')
    }

    const newVisit = async (req) => {
        if (req.body.dataVisitor) {
            const dataVisitor = req.body.dataVisitor
            let ip = req.headers['x-forwarded-for'] ||
                req.socket.remoteAddress
            if (ip === "::ffff:127.0.0.1") {
                ip = "190.17.37.108"
            }
            let dataIp = {
                host: "",
                continent_name: "",
                country_name: "",
                city: "",
                region_name: "",
                postal_code: "",
                latitude: "",
                longitude: ""
            }
            try {
                dataIp = await useDataIp(ip)
                dataIp = dataIp.data.geo
            } catch (error) {
                console.log(`error`, error)
            }

            console.log(`dataVisitor.device`, dataVisitor.device)
            const data = {
                ip,
                host: dataIp.host,
                continent: dataIp.continent_name,
                country: dataIp.country_name,
                city: dataIp.city,
                region: dataIp.region_name,
                postal_code: dataIp.postal_code,
                latitude: dataIp.latitude,
                longitude: dataIp.longitude,
                browser: dataVisitor.browser.name,
                os: dataVisitor.os.name,
                device: dataVisitor.device.model,
                type: dataVisitor.device.type,
                brand: dataVisitor.device.vendor
            }
            await store.insert(TABLA, data)
            return ""
        } else {
            throw Error("No permitido!")
        }
    }

    const useDataIp = async (ip) => {
        return new Promise(resolve => {
            (getDataIP(ip, resolve))
        })
    }

    const getDataIP = async (ip, resolve) => {
        const options = {
            hostname: 'tools.keycdn.com',
            port: 443,
            path: `/geo.json?host=${ip}`,
            method: 'GET',
            headers: {
                "User-Agent": "keycdn-tools:https://www.nekonet.com.ar",
                "Accept": "application/json"
            }
        };

        let req = https.request(options, (res) => {
            console.log('statusCode:', res.statusCode);
            console.log('headers:', res.headers);
            let data = "";
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                resolve(JSON.parse(data))
            });
        });

        req.on('error', (e) => {
            console.error(e);
        });
        req.end();
    }

    return {
        newVisit
    }
}