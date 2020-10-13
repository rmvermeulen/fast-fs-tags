import { Inject, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { AppLogger } from '../app-logger/app-logger.service'

type Info = {
  path: string
  directory: boolean
}

@Injectable()
export class ScannerService {
  @Inject('node:fs')
  private readonly fs: typeof import('fs')

  constructor(private readonly logger: AppLogger) {
    this.logger.setContext('ScannerService')
  }

  // scan a directory recursively
  scan(path: string, depth = -1): Observable<Info> {
    this.logger.debug(`Scanning "${path}"`, 'ScannerService')
    return new Observable(subscriber => {
      subscriber.complete()
    })
  }

  private async getPathInfo(path: string): Promise<Info> {
    this.logger.debug(``)
    return {
      path,
      // todo: read
      directory: false,
    }
  }
}
