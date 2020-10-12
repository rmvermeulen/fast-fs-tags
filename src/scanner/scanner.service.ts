import { Injectable } from '@nestjs/common'
import { readdir } from 'fs'
import { EventEmitter } from 'events'
import { fromEvent, Observable } from 'rxjs'
import { scan } from 'rxjs/operators'

type Info = {
  path: string
  directory: boolean
}

const getInfo = async (path: string): Promise<Info> => ({
  path,
  // todo: read
  directory: false,
})

@Injectable()
export class ScannerService {
  // file extensions to look for
  private readonly extensions: string[] = ['png', 'bmp']
  // scan a directory recursively
  scan(path: string, depth = -1): Observable<Info> {
    return new Observable(subscriber => {
      // todo: use readdir paths
      for (const path of ['a', 'b']) {
        getInfo(path)
          .then(subscriber.next)
          .catch(subscriber.error)
      }
      subscriber.complete()
    })
  }
}
