// RUN: yarn start --project testProject
/* eslint-disable */
describe('Download files by `cy.request()`->`cy.writeFile()`', () => {
  const urls = [
    'https://file-examples.com/wp-content/uploads/2017/02/zip_2MB.zip',
    'https://file-examples.com/wp-content/uploads/2017/10/file_example_PNG_500kB.png',
    'https://file-examples.com/wp-content/uploads/2017/02/file-sample_100kB.doc',
    'https://file-examples.com/wp-content/uploads/2017/02/file-sample_100kB.docx',
    'https://file-examples.com/wp-content/uploads/2017/02/file_example_XLS_50.xls',
    'https://file-examples.com/wp-content/uploads/2017/02/file_example_XLSX_1000.xlsx',
    'https://file-examples.com/wp-content/uploads/2017/10/file-example_PDF_500_kB.pdf',
  ]
  const encoding = 'binary'

  for (const url of urls) {
    const ext = url.substr(url.lastIndexOf('.') + 1)

    it(`Download ${ext.toUpperCase()} file`, () => {
      cy.request({
        url,
        encoding,
      }).then((response) => {
        const filePath =
          `${Cypress.config('screenshotsFolder')}/${ext}-downloaded.${ext}`
        const expectedFileSize = response.headers['content-length']

        console.log({ ext, size: expectedFileSize, filePath })
        cy.writeFile(filePath, response.body, { encoding: 'binary' })
        cy.exec(`ls -al ${filePath} | awk '{print $5}'`).then(
          ({ stdout: actualFileSize }) => {
            expect(actualFileSize).to.equal(expectedFileSize)
          },
        )
      })
    })
  }
})
