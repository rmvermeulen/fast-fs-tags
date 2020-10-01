import { Module } from '@nestjs/common'
import { MainController } from './main/main.controller';

@Module({
    providers: [],
    controllers: [MainController],
})
export class ClientModule { }
