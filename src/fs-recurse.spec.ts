import { promises as fs } from 'fs'
import { join } from 'path'

describe('Recurse through the file system', () => {
  const readdir = jest.fn().mockImplementation(fs.readdir)

  const toplevelPaths = async function*(dir: string) {
    yield dir
    try {
      for (const name of await readdir(dir)) {
        const path = join(dir, name)
        yield path
      }
    } catch (error) {
      if (error.code == 'ENOTDIR') {
        return
      }
      throw error
    }
  }
  const composed = async function*(dir: string) {
    const paths = []
    for await (const path of toplevelPaths(dir)) {
      paths.push(path)
      yield path
    }
    for (const path of paths) {
      yield* composed(path)
    }
  }
  it('yields only the top most paths', async () => {
    const paths = []
    for await (const path of toplevelPaths('./example-files')) {
      paths.push(path)
    }
    expect(paths).toMatchInlineSnapshot(`
      Array [
        "./example-files",
        "example-files/deep",
        "example-files/file1",
        "example-files/file2",
        "example-files/file3",
      ]
    `)
    expect(readdir).toHaveBeenCalledTimes(1)
  })
  it('can be composed', async () => {
    const paths = []
    for await (const path of composed('./example-files')) {
      paths.push(path)
    }
    expect(paths).toMatchInlineSnapshot(`
      Array [
        "./example-files",
        "example-files/deep",
        "example-files/file1",
        "example-files/file2",
        "example-files/file3",
        "example-files/deep",
        "example-files/deep/deeper",
        "example-files/deep/file1",
        "example-files/deep/file2",
        "example-files/deep/file3",
        "example-files/deep/deeper",
        "example-files/deep/deeper/file1",
        "example-files/deep/deeper/file2",
        "example-files/deep/deeper/file3",
        "example-files/deep/deeper/file1",
        "example-files/deep/deeper/file2",
        "example-files/deep/deeper/file3",
        "example-files/deep/file1",
        "example-files/deep/file2",
        "example-files/deep/file3",
        "example-files/file1",
        "example-files/file2",
        "example-files/file3",
      ]
    `)
    // expect(readdir).toHaveBeenCalledTimes(13)
    expect(readdir.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "./example-files",
        ],
        Array [
          "./example-files",
        ],
        Array [
          "example-files/deep",
        ],
        Array [
          "example-files/deep/deeper",
        ],
        Array [
          "example-files/deep/deeper/file1",
        ],
        Array [
          "example-files/deep/deeper/file2",
        ],
        Array [
          "example-files/deep/deeper/file3",
        ],
        Array [
          "example-files/deep/file1",
        ],
        Array [
          "example-files/deep/file2",
        ],
        Array [
          "example-files/deep/file3",
        ],
        Array [
          "example-files/file1",
        ],
        Array [
          "example-files/file2",
        ],
        Array [
          "example-files/file3",
        ],
      ]
    `)
  })
})
