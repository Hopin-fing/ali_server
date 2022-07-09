const path = require('path'),
    {sendRequestGet} = require("../../../requests"),
    {getStock} = require("../../stock"),
    productsInfo = require(path.resolve("data/RewriteCard", "data.json")),
    {editProduct} = require("./editProduct"),
    {fillInput} = require("../../emulateFunc");


const fs = require('fs').promises;

const searchCard = async (page, browser, port, cabinetName) => {
    const stock = await getStock()
    const cookiesProductString = await fs.readFile('./cookies/cookiesVipProduct.json');
    const cookiesProductOld = JSON.parse(cookiesProductString);
    await page.setCookie(...cookiesProductOld);
    const allBarcodes = await sendRequestGet(`http://localhost:${port}/api/v1/barcode/${cabinetName}`)
        .then(req => req.data.data)

    const searchProductInOurStock = (idCard) => {
        const aliBarcodes = allBarcodes.find(item => item["idCard"] === idCard)["barcodes"]
        const orgBarcodes = []
        aliBarcodes.map(item => {
            orgBarcodes.push(item["orgBarcode"])
        })
        return stock.filter(item => orgBarcodes.includes(item["barcode"]))
    }

    for (const productInfo of productsInfo) {
        const price = productInfo["price"].toString() + ".00",
            cardId = productInfo["cardId"],
            stockInfo = searchProductInOurStock(cardId)

        console.log("cardId", cardId)

        // const price = "2660" + ".00",
        //     cardId = "1005004306507012",
        //     stockInfo = searchProductInOurStock(cardId)

        await page.waitForSelector('.field__fixedError__2ugX3 input')

        let fieldSearch = await page.$('.field__fixedError__2ugX3 input')


        await fillInput(fieldSearch, cardId)
        await page.waitForSelector('td .cell_opener__1oE0j')
        await page.waitForTimeout(4000)
        await page.click('td .cell_opener__1oE0j')
        await page.waitForSelector('.theme__theme_default__23BZH .action-list_root__Kqu8V li:nth-child(2)')


        let editOldBtn = await page.$('.theme__theme_default__23BZH .action-list_root__Kqu8V li:nth-child(2)')
        await editOldBtn.click()


        await page.waitForTimeout(4000)


        await editProduct(browser, price, cardId, stockInfo)
    }


    console.log("Final!!!!")


}


exports.searchCard = searchCard