import * as Excel from 'exceljs'

export class XlsxDocument {
  static async parse(buffer: Buffer): Promise<XlsxDocument> {
    const workbook = new Excel.Workbook()
    await workbook.xlsx.load(buffer)
    return new XlsxDocument(workbook)
  }

  protected constructor(protected readonly workbook: Excel.Workbook) {}

  public rows(page: string): Iterable<string[]> {
    const worksheet = this.workbook.getWorksheet(page)
    if (!worksheet) {
      throw new Error(`${page} page doesn't exist in document`)
    }
    const rowCount = worksheet.rowCount

    return {
      [Symbol.iterator]() {
        return {
          i: 2,
          next() {
            if (this.i <= rowCount) {
              const row = worksheet.getRow(this.i).values
              this.i++
              return { value: row as string[], done: false }
            }
            return { value: undefined, done: true }
          }
        }
      }
    }
  }
}
