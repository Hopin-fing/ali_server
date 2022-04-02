const waitPage = async (page, rightUrl) => {
    let url
    while(!url?.includes(rightUrl)) {
        await page.waitForNavigation({ waitUntil: ['domcontentloaded'] })
        url = page.url()
    }
}
exports.waitPage = waitPage