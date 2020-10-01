import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CacheService } from './cache/cache.service';
import { ScannerService } from './scanner/scanner.service';

import config from './config'

@Module({
  imports: [ConfigModule.forRoot({
    load: [config]
  })],
  providers: [CacheService, ScannerService],
})
export class AppModule { }
