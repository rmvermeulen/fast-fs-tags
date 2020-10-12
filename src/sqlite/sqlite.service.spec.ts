import { Test, TestingModule } from '@nestjs/testing'
import { SqliteService } from './sqlite.service'

describe('SqliteService', () => {
  let service: SqliteService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SqliteService],
    }).compile()

    service = module.get<SqliteService>(SqliteService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('re-uses existing sqlite3 instances', () => {
    expect(service.open(':memory:')).toBe(service.open(':memory:'))
    expect(service.open('./dev.db')).toBe(service.open('./dev.db'))
    expect(service.open(':memory:')).not.toBe(service.open('./dev.db'))
  })
})
