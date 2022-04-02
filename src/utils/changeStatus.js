const changeStatus = async (page, listSelector, words) => {
    console.log("changeStatus start")
    page.waitForSelector(listSelector)
    page.click(listSelector)


    await page.waitForTimeout(2000);
    const option = await page.waitForXPath(`//div[@class='option_option__RqcfB'][text()="${words}"]`)
    await option?.click();

    await page.waitForTimeout(5000);
}


exports.changeStatus = changeStatus