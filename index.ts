import device from './alicloud'
import { deviceInfo, redisInfo } from './config'

import publishClient from './redis/publish'
import subscribeClient from './redis/subscribe'
import { Property } from './interfaces/thing.interface';

subscribeClient.subscribe(redisInfo.channel, (err, count) => {
    if (err) {
        console.log('[redis err]', err)
    }
})
subscribeClient.on('message', (channel, message) => {
    try {
        const decoded: Property = JSON.parse(message)
        device.postProps(decoded, err => {
            if (err) {
                return console.log('[Alicloud] post error:', err);
            }
            console.log('[Alicloud] post successfully!', decoded);
        });
    } catch (error) {
        console.log('[local]', error)
    }
})

setTimeout(() => {
    publishClient.publish(redisInfo.channel, JSON.stringify({
        degreeX: 80.11,
        degreeZ: -20.11,
        faceImg: "dsaf",
        position: [100, 100, 200, 200],
    } as Property))
}, 1000)

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

device.serve('motormove', params => {
    console.log(params)
})