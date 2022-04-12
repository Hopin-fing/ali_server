const {waitPage} = require("./utils"),
    {checkAllOrd} = require("./checkAllOrd"),
    {handingTrnList} = require("./handingTrnList"),
    {sendRequestPost} = require("../requests"),
    {changeStatus} = require("./utils")

const makeDocs = async (page, browser, url, cabinetName) => {

    // page: https://seller.aliexpress.ru/orders/shipping

    await page.goto('https://seller.aliexpress.ru/orders/shipping')

    await page.waitForTimeout(10000);

    await changeStatus(page,
        '.builder_root__XKssE:not(.shipment-list_dateRange__1BDzQ) .popover_root__qiyPo',
        "Ожидает добавления в лист передачи"
    )
    await page.waitForTimeout(2000);


    let isExistDoc = await page.$('.table_tableBody__1xqxz tr')
    if (isExistDoc) {
        // Create order list if new order exist

        page.click(".pagination_limit__zV_Ib:nth-child(3)")

        await page.waitForTimeout(3000);

        page.waitForSelector('input.check-box_input__1rZqL#columnCheckBox')
        page.click('input.check-box_input__1rZqL#columnCheckBox')
        await page.waitForTimeout(1000);

        page.waitForSelector('.shipment-list_shipping__3uB4i button.button__type_primary__ajB28')
        page.click('.shipment-list_shipping__3uB4i button.button__type_primary__ajB28')
        await page.waitForTimeout(1000);

        page.waitForSelector('.standart_box__38Ycp .creation-step_actions__dyjt8 button.button__type_primary__ajB28')
        page.click('.standart_box__38Ycp .creation-step_actions__dyjt8 button.button__type_primary__ajB28')
        await page.waitForTimeout(20000);

    }


    // page: https://seller.aliexpress.ru/orders/transferLists

    await page.goto('https://seller.aliexpress.ru/orders/transferLists')
    await page.waitForTimeout(10000);

    isExistDoc = await page.$('.table_tableBody__1xqxz tr')
    if (!isExistDoc) return
    await changeStatus(page,
        '.builder_root__XKssE:not(.transfer-lists_dateRange__2yGHa) .popover_root__qiyPo',
        "Создан"
    )

    const table = await page.$$('tbody.table_tableBody__1xqxz tr'),
        arrNumList = []


    //Check number transfer lists in DB
    for (const order of table) {
        const numList = await order.$eval('.text_root__hcDXc', (el) => el.innerText)
        arrNumList.push(numList)
    }

    const numOrders = await sendRequestPost(url + "checkList", {"data": arrNumList})
        .then(item => item.data["data"])



    if(numOrders.length === 0) return

    //Start  prepared and download result
    for (const order of numOrders) {
        await handingTrnList(page, browser, order, url, cabinetName)
    }





}


exports.makeDocs = makeDocs