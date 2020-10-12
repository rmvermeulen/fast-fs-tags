import { Injectable } from '@nestjs/common'
import { resolve } from 'path'
import * as sqlite from 'better-sqlite3'

@Injectable()
export class SqliteService {
  private readonly cache = {}
  open(path: string) {
    const key = path == ':memory:' ? path : resolve(path)
    if (key in this.cache) {
      return this.cache[key]
    }
    const db = sqlite(path)
    this.cache[key] = db
    return db
  }
}
