import Redis from 'ioredis';

import { REDIS_CONNECTION } from '$env/static/private';

export default new Redis(REDIS_CONNECTION);
