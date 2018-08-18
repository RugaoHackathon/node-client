import * as Redis from 'ioredis'
import { redisInfo } from '../config';
const subscribeClient = new Redis({
    port: redisInfo.port,
    host: redisInfo.host
})

export default subscribeClient