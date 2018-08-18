import device from './alicloud'
import { deviceInfo, redisInfo } from './config'

import publishClient from './redis/publish'
import subscribeClient from './redis/subscribe'

subscribeClient.subscribe(redisInfo.channel, (err, count) => {
    if (err) {
        console.log('[redis err]', err)
    }
})
subscribeClient.on('message', (channel, message) => {
    console.log('[redis receive]', channel, message)
})

setTimeout(() => {
    publishClient.publish(redisInfo.channel, "hhhhh")
}, 1000)

device.subscribe(`/${deviceInfo.productKey}/${deviceInfo.deviceName}/data`);
device.publish(`/${deviceInfo.productKey}/${deviceInfo.deviceName}/data`, 'helloworld')