import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CacheService } from './cache/cache.service'
import { ScannerService } from './scanner/scanner.service'
import { SqliteService } from './sqlite/sqlite.service'
import { AppLogger } from './app-logger/app-logger.service'
import { promises as fs } from 'fs'
import config from './config'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
  ],
  providers: [
    { provide: 'node:fs', useValue: fs },
    CacheService,
    ScannerService,
    SqliteService,
    AppLogger,
  ],
})
export class AppModule {}
