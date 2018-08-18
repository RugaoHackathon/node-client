import aliyunIot = require('aliyun-iot-device-sdk');
import { deviceInfo } from './config'

const device = aliyunIot.device(deviceInfo);

device.on('connect', () => {
    console.log('connect successfully!');
});

device.publish('/a1nboZrv7ah/RasPi3/data', 'hello world!');

device.subscribe('/a1nboZrv7ah/RasPi3/data');

device.on('message', (topic, payload) => {
    console.log(topic, payload.toString());
});