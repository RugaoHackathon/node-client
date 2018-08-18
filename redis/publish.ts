import * as Redis from 'ioredis'
import { redisInfo } from '../config';
const publishClient = new Redis({
    port: redisInfo.port,
    host: redisInfo.host
})

export default publishClient