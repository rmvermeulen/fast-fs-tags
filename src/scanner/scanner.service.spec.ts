import { Test, TestingModule } from '@nestjs/testing'
import { ScannerService } from './scanner.service'
import { toArray } from 'rxjs/operators'
import { AppLogger } from '../app-logger/app-logger.service'

describe('ScannerService', () => {
  let service: ScannerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScannerService,
        AppLogger,
        { provide: 'node:fs', useValue: {} },
      ],
    }).compile()

    service = await module.resolve<ScannerService>(ScannerService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('scans a directory to a given depth (WIP)', async () => {
    const obs = service.scan('example-files')
    const results = await obs.pipe(toArray()).toPromise()
    expect(results).toMatchInlineSnapshot(`Array []`)
  })
})
