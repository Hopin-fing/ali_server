const {waitPage} = require("./utils"),
    {checkAllOrd} = require("./checkAllOrd"),
    moment = require("moment"),
    {sendRequestPost} = require("../requests")


const searchOrders = async (page, url) => {
    const currentDate = moment().format("YYYY-MM-DD"),
        lastMonth = moment().add(-30, "day").format("YYYY-MM-DD"),
        ordersUrl = `https://seller.aliexpress.ru/orders/orders?dateStart=${lastMonth}
        T21%3A00%3A00.000Z&dateEnd=${currentDate}T20%3A59%3A59.999Z&status=WaitSendGoods&orderId=
        &productName=&buyerName=&trackingNumber=
        &lastLoadedOrderCreationDate=&sortingOrder=DESC&shippingDayFrom=&shippingDayTo=&pageSize=50`

    await waitPage(page, "https://seller.aliexpress.ru")
    await page.goto(ordersUrl)
    await page.waitForTimeout(4000);

    //Change number orders on page

    let pageFrame = await page.$$('tbody.table_tableBody__1xqxz tr'),
        arrNumOrders = []


    if (pageFrame.length === 0) return

    await page.click('.pagination_limits__GoqUp button:last-child')


    pageFrame = await page.$$('tbody.table_tableBody__1xqxz tr')

    for (const order of pageFrame) {
        const numOrder = await order.$eval('a', (el) => el.innerText);
        arrNumOrders.push(numOrder)
    }


    const finalOrders = await sendRequestPost(url + "checkOrder", {data: arrNumOrders})
        .then(item => item.data["data"])


    if (finalOrders.length === 0) return

    for (const numOrder of finalOrders) {
        await checkAllOrd(page, numOrder)
        await page.waitForSelector('.table_tableBody__1xqxz tr')
    }


}


exports.searchOrders = searchOrders