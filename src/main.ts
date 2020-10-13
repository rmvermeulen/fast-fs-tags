import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ScannerService } from './scanner/scanner.service'
;(async () => {
  const app = await NestFactory.create(AppModule)

  // app logic

  const scanner: ScannerService = app.get(ScannerService)
  const obs = scanner.scanPath('./example-files')
  obs.subscribe({
    next: console.log,
    error: console.error,
    complete: () => console.log('completed!'),
  })
})()
