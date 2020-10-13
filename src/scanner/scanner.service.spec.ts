import { Test, TestingModule } from '@nestjs/testing'
import { map, partition, pluck, prop } from 'ramda'
import { toArray } from 'rxjs/operators'
import { Info, ScannerService } from './scanner.service'

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

  it('scans a directory recursively', async () => {
    const target = 'test/example-files'
    const results: [Info[], Info[]] = await service
      .scanPath(target)
      .pipe(toArray())
      .toPromise()
      .then(partition(prop('isDirectory')))
      .then(map(pluck('path')))
    const [dirs, files] = results
    expect(dirs).toEqual([`${target}/deep`, `${target}/deep/deeper`])
    expect(files).toEqual([
      `${target}/file1`,
      `${target}/deep/file2`,
      `${target}/deep/deeper/file3`,
    ])
  })
})
