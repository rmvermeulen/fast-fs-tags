import { Test, TestingModule } from '@nestjs/testing'
import { AppLogger } from './app-logger.service'

describe('AppLoggerService', () => {
  let loggerA: AppLogger
  let loggerB: AppLogger

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppLogger],
    }).compile()

    loggerA = await module.resolve<AppLogger>(AppLogger)
    loggerB = await module.resolve<AppLogger>(AppLogger)
  })

  it('should be defined', () => {
    expect(loggerA).toBeDefined()
    expect(loggerA).toHaveProperty('setContext')
    expect(loggerB).toBeDefined()
    expect(loggerB).toHaveProperty('setContext')
  })

  it('can be configured per instance', async () => {
    expect(loggerA).toHaveProperty('context', undefined)
    loggerA.setContext('testing')
    expect(loggerA).toHaveProperty('context', 'testing')

    expect(loggerB).toHaveProperty('context', undefined)
    loggerB.setContext('testing')
    expect(loggerB).toHaveProperty('context', 'testing')
  })
})
