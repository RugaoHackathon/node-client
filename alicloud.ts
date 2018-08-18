import aliyunIot = require('aliyun-iot-device-sdk');
import { deviceInfo } from './config'

const device = aliyunIot.device(deviceInfo);

device.on('connect', () => {
    console.log('connect successfully!');
});

device.on('message', (topic, payload) => {
    console.log(topic, payload.toString());
});

device.on('error', (err) => {
    console.log('error', err);
});
export default device