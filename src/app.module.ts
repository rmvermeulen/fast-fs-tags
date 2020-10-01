import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CacheService } from './cache/cache.service';

import config from './config'

@Module({
  imports: [ConfigModule.forRoot({
    load: [config]
  })],
  providers: [CacheService],
})
export class AppModule { }
