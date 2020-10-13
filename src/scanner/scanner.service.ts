import { Injectable } from '@nestjs/common'
import { stat, readdir } from 'fs'
import { fromEvent, iif, Observable, of, merge } from 'rxjs'
import { map, mergeMap, expand } from 'rxjs/operators'
import { join } from 'path'

export type Info = {
  path: string
  isDirectory: boolean
}

const readdirObservable = (dir: string): Observable<string> =>
  new Observable(sub => {
    readdir(dir, (error, files) => {
      if (error) {
        return sub.error(error)
      }
      files.map(name => join(dir, name)).forEach(path => sub.next(path))
      sub.complete()
    })
  })

const getInfo = (path: string): Observable<Info> =>
  new Observable(sub => {
    stat(path, (error, stats) => {
      if (error) {
        return sub.error(error)
      }
      sub.next({
        path,
        isDirectory: stats.isDirectory(),
      })
      sub.complete()
    })
  })

const scanPath = (path: string): Observable<Info> =>
  readdirObservable(path).pipe(
    mergeMap(getInfo),
    mergeMap((info: Info) =>
      // return info as-is, if it's a directory add entries
      info.isDirectory ? merge(of(info), scanPath(info.path)) : of(info),
    ),
  )

@Injectable()
export class ScannerService {
  // file extensions to look for
  private readonly extensions: string[] = ['png', 'bmp']
  // scanPath a directory recursively
  scanPath(path: string): Observable<Info> {
    return scanPath(path)
  }
}
