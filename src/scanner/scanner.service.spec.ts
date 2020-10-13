import { Test, TestingModule } from '@nestjs/testing'
import * as R from 'ramda'
import { map, take, toArray } from 'rxjs/operators'
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

  describe('scanning', () => {
    it('scans a directory recursively', async () => {
      const target = 'test/example-files'
      const results: [Info[], Info[]] = await service
        .scanPath(target)
        .pipe(toArray())
        .toPromise()
        .then(R.partition(R.prop('isDirectory')))
        .then(R.map(R.pluck('path')))
      const [dirs, files] = results
      expect(dirs).toEqual([`${target}/deep`, `${target}/deep/deeper`])
      expect(files).toEqual([
        `${target}/file1`,
        `${target}/deep/file2`,
        `${target}/deep/deeper/file3`,
      ])
    })

    it('is lazy', async () => {
      const results = []
      const cb = jest.fn().mockImplementation(value => results.push(value))
      const paths$ = service.scanPath('test/example-files').pipe(map(cb))
      expect(cb).not.toHaveBeenCalled()
      await paths$.pipe(take(3)).toPromise()
      expect(cb).toHaveBeenCalledTimes(3)
      await paths$.pipe(take(3)).toPromise()
      expect(cb).toHaveBeenCalledTimes(6)
      await paths$.pipe(take(3)).toPromise()
      expect(cb).toHaveBeenCalledTimes(9)
      expect(results).toEqual(R.uniq(results))
    })
  })
})
