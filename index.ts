import device from './alicloud'
import { deviceInfo, redisInfo } from './config'

import publishClient from './redis/publish'
import subscribeClient from './redis/subscribe'
import { Property, MotormoveReq, RedisSub } from './interfaces/thing.interface';

subscribeClient.subscribe(redisInfo.channel, (err, count) => {
    if (err) {
        console.log('[redis err]', err)
    }
})

// publishClient.get("cachedModel")
// publishClient.set("cachedModel", JSON.stringify)

publishClient.on("connect", async () => {
    console.log("[public] connected")
    try {
        publishClient.set("degreeX", 0)
        publishClient.set("degreeZ", 0)
        let cachedModel = await publishClient.get("cachedModel")
        JSON.parse(cachedModel)
        if (cachedModel) {
            console.log("[cached]", cachedModel)
        } else {
            cachedModel = JSON.stringify({
                degreeX: 0,
                degreeZ: 0,
                position: [0],
                sleep: 0,
                operating: 0,
            } as Property)
            publishClient.set("cachedModel", cachedModel)
        }
    } catch (error) {
        const cachedModel = JSON.stringify({
            degreeX: 0,
            degreeZ: 0,
            position: [0],
            sleep: 0,
            operating: 0,
        } as Property)
        publishClient.set("cachedModel", cachedModel)
        console.log('[error1]', error)
    }
})

subscribeClient.on('message', async(channel, message) => {
    try {
        let cachedModel = JSON.parse(await publishClient.get("cachedModel"))
        const decoded: RedisSub = JSON.parse(message)
        if (decoded.from === "VIDEO") {
            if (decoded.type === "VIDEOINFO") {
                let position = [] as any[]
                if (decoded.data.bbs[0]) {
                    position = decoded.data.bbs[0]
                    position[1] = parseFloat(position[1])
                } else {
                    position = [0]
                }
                // console.log(position)
                cachedModel.position = position
                publishClient.set("cachedModel", JSON.stringify(cachedModel))
                // console.log(cachedModel)
                return
            }
        }

        if (decoded.type === "MOTORCTL") {
            const { degreeX, degreeZ } = decoded.data
            const lastdegreeX = parseFloat(await publishClient.get("degreeX")) || 0
            const lastdegreeZ = parseFloat(await publishClient.get("degreeZ")) || 0
            publishClient.set("degreeX", lastdegreeX + degreeX)
            publishClient.set("degreeZ", lastdegreeZ + degreeZ)
            // console.log(await publishClient.get("degreeX"))
            // console.log(await publishClient.get("degreeZ"))
        }
    } catch (error) {
        console.log('[error0]', error)
    }
})

setInterval(async () => {
    try {
        console.log(await publishClient.get("cachedModel"))
        const dataSent = JSON.parse(await publishClient.get("cachedModel")) 
        dataSent.degreeX = parseFloat(await publishClient.get("degreeX")) || 0
        dataSent.degreeZ = parseFloat(await publishClient.get("degreeZ")) || 0
        console.log(dataSent)
        device.postProps(dataSent, err => {
            if (err) {
                return console.log('[Alicloud] post error:', err);
            }
            console.log('[Alicloud] post successfully!');
        });
    } catch (error) {
        console.log('[error2]', error)
    }

}, 2000)

// publishClient.publish(redisInfo.channel, JSON.stringify({
//     degreeX: 80.11,
//     degreeZ: -20.11,
//     position: [100, 100, 200, 200],
//     sleep: 0,
//     operating: 1,
// } as Property))
// device.subscribe(`/${deviceInfo.productKey}/${deviceInfo.deviceName}/data`);
// device.publish(`/${deviceInfo.productKey}/${deviceInfo.deviceName}/data`, 'helloworld')

// set property from Alicloud
device.serve('property/set', params => {
    console.log('receieve params:', params);
    // 原样上报
    console.log('post props:', params);
    device.postProps(params, err => {
        if (err) {
            return console.log('post error:', err);
        }
        console.log('post successfully!');
    });
});

device.serve('motormove', (params: MotormoveReq) => {
    const { degreeX, degreeZ } = params
    publishClient.publish(redisInfo.channel, JSON.stringify({
        from: "ALICLOUD",
        type: "MOTORCTL",
        data: {
            degreeX,
            degreeZ
        }
    }))
    console.log(degreeX, degreeZ)
})