import aliyunIot = require('aliyun-iot-device-sdk');

const device = aliyunIot.device({
    productKey: 'a1nboZrv7ah',
    deviceName: 'RasPi3',
    deviceSecret: 'cO9ZceSpqIO1APb2sDVpLbjqlrEeS9d6'
});

device.on('connect', () => {
    console.log('connect successfully!');
});

device.publish('/a1nboZrv7ah/RasPi3/data', 'hello world!');

device.subscribe('/a1nboZrv7ah/RasPi3/data');

device.on('message', (topic, payload) => {
    console.log(topic, payload.toString());
});