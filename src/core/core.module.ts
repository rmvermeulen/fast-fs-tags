import { Global, Module } from '@nestjs/common'
import { DbService } from './db/db.service'
import { ConfigService } from '@nestjs/config'
@Global()
@Module({
  imports: [ConfigService.forRoot()],
  providers: [DbService],
})
export class CoreModule {}
