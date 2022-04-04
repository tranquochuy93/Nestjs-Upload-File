import { BullModule } from '@nestjs/bull';
import { env } from './env.config';

export const queueConfig = BullModule.forRoot({
  redis: {
    host: env.REDIS.HOST,
    port: env.REDIS.PORT,
  },
});
