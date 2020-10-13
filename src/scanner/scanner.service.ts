import { Injectable } from '@nestjs/common'
import { stat, readdir, promises } from 'fs'
import { fromEvent, iif, Observable, of, merge, Subject } from 'rxjs'
import { map, mergeMap, expand, publish, refCount } from 'rxjs/operators'
import { join } from 'path'
import { delay } from 'bluebird'

export type Info = {
  path: string
  isDirectory: boolean
}

async function* recursePath(path: string) {
  yield path
  try {
    const names = await promises.readdir(path)
    for (const name of names) {
      yield* recursePath(join(path, name))
    }
  } catch {
    return
  }
}
;(async () => {
  const it = recursePath('test/example-files')

  for (let i = 0; i < 15; ++i) {
    if (i % 3 == 0) {
      await delay(1000)
    }
    const { value } = await it.next()
    if (!value) {
      break
    }
    console.log(i, value)
  }
})()
@Injectable()
export class ScannerService {
  // file extensions to look for
  private readonly extensions: string[] = ['png', 'bmp']
  // scanPath a directory recursively
  public scanPath(path: string): Observable<Info> {
    // return this._scanPath(path).pipe(publish(), refCount())
    return merge(new Subject(), this._scanPath(path))
  }
  private _scanPath = (path: string): Observable<Info> =>
    this._readdirObservable(path).pipe(
      mergeMap(this._getInfo),
      mergeMap((info: Info) =>
        // return info as-is, if it's a directory add entries
        info.isDirectory ? merge(of(info), this.scanPath(info.path)) : of(info),
      ),
    )
  private _readdirObservable = (dir: string): Observable<string> =>
    new Observable(sub => {
      readdir(dir, (error, files) => {
        if (error) {
          return sub.error(error)
        }
        files.map(name => join(dir, name)).forEach(path => sub.next(path))
        sub.complete()
      })
    })

  private _getInfo = (path: string): Observable<Info> =>
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
}
