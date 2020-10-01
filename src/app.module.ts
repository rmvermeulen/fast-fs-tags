import { Module } from '@nestjs/common'
import { CoreModule } from './core/core.module'
import { ClientModule } from './client/client.module'

@Module({
  imports: [CoreModule, ClientModule],
})
export class AppModule {}
