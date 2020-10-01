import { Controller, Get } from '@nestjs/common'
import { ClientService } from './app.service'

@Controller()
export class ClientController {
  constructor(private readonly appService: ClientService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }
}
