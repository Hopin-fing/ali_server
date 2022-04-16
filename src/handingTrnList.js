const download = require('download'),
    {sendRequestPost} = require("../requests")

const handingTrnList = async (page, browser, number, url, cabinetName) => {


    const el = await page.waitForXPath(`//tbody//div[text()="${number}"]`),
        arrNumOrders = []
    await el?.click();

    await page.waitForTimeout(10000);

    page.waitForSelector('.table_headerCheckbox__3EfSk input.check-box_input__1rZqL')
    const checkBtn = await page.$('.table_headerCheckbox__3EfSk input.check-box_input__1rZqL'),
        numOrders = await page.$$('.focus-trap_root__lP7Ru .table_tableBody__1xqxz tr'),
        numTrnList = await page.$eval('.focus-trap_root__lP7Ru .heading_root__2z4_c',
            (el) => el.innerText.match(/\d+/g)[0]),
        crtLabel = await page.$('.focus-trap_root__lP7Ru button.transfer-lists-details_printAllSelect__kgvt_'),
        crtDoc = await page.$('.transfer-lists-details_controls__jtQEF button.button__type_primary__ajB28')

    for (const order of numOrders) {
        const numOrder = await order.$eval('td:nth-child(2) div div', (el) => el.innerText)
            .then(item => item.split(" / ")[1])
        arrNumOrders.push(numOrder)
    }

    await checkBtn.click()
    await crtLabel.click()

    await page.waitForTimeout(10000);
    const labelPage = await browser.pages().then(item => item[2]),
        path = `./data/${cabinetName}/`


    await download(labelPage.url(), path, {filename: `${number}_label.pdf`});
    await labelPage.close()

    await crtDoc.click()
    await page.waitForTimeout(10000);
    const docsUrl = await browser.pages()

    await download(docsUrl[2].url(), path, {filename: `${number}_tl.pdf`});

    const bodyReq = {
        transfer_list: numTrnList,
        orders: arrNumOrders
    }


    await sendRequestPost(url + "sendInfo", bodyReq)
    await docsUrl[2].close()
    await page.click(".focus-trap_root__lP7Ru button.standart_close__3YRL0")
    await page.waitForSelector(".standart_modal__1dksP", {hidden: true})

}


exports.handingTrnList = handingTrnList