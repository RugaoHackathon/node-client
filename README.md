## Redis 数据规范

### 字段规定
一些字段
- from => 来源，比如来自云端的，那么就是ALICLOUD
- type => 类型，也就是这个数据是什么数据。比如 VIDEOINFO, MOTORCTL
- data => 载荷，payload 也就是真正的data

**所有的数据全部采用json格式进行传递**
也就是你需要先转成string，再发这个json

### 技术细节
```js
port: 6379
host: '127.0.0.1'
channel: 'queue'
```
对这个端口进行订阅(subscribe)和发布(publish)

### Example
```js
{
    from: "ALICLOUD",
    type: "MOTORCTL",
    data: {
        x: 1,
        y: 1,
        rotate: 1,
    }
}
```

### Detail
from: 
- ALICLOUD 阿里云
- MOTOR 电机
- VIDEO 摄像头

type:
- MOTORCTL 控制电机
- VIDEOINFO 摄像头返回的信息

## Contribute
希望大家贡献完善