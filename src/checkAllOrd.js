const checkAllOrd = async (page, numOrder) => {

    const urlOrder = `https://seller.aliexpress.ru/orders/orders/${numOrder}?source=GlobalTrade`
    let isSuccess

    await page.goto(urlOrder)

    await page.waitForTimeout(5000);

    await page.waitForSelector('.product-table_productColumn__2FnB3 button')
    const isOrderCrt = await page.$$('.table_root__2hQ8y')

    if (isOrderCrt.length > 1) {
        return
    }

    while (!isSuccess) {
        await page.click('.product-table_productColumn__2FnB3 button')

        await page.waitForSelector('.create-shipment_actions__30LG3 button.m-l-4')
        await page.click('.create-shipment_actions__30LG3 button.m-l-4')

        await page.waitForSelector('.alert_root__1PfNO.snackbar_alert__352lo.alert__variant_toast__kh7v5')
        isSuccess = await page.$('.alert__type_success__2_2m0')

    }


}


exports.checkAllOrd = checkAllOrd