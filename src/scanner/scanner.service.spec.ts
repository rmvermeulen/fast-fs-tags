import { Test, TestingModule } from '@nestjs/testing'
import { ScannerService } from './scanner.service'

describe('ScannerService', () => {
  let service: ScannerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScannerService],
    }).compile()

    service = module.get<ScannerService>(ScannerService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('scans a directory to a given depth (WIP)', done => {
    const obs = service.scan('.')

    obs.subscribe({
      next(info) {
        console.log('next', info)
      },
      error(error) {
        console.log('error', error)
      },
      complete: done,
    })
  })
})
