const {rptInput} = require("./utils");

const auth = async (page, browser, data) => {
    // await page.goto('https://seller.aliexpress.ru/login')
    await page.goto('https://seller.aliexpress.ru/')
    console.log("done")
    // await page.waitForSelector('.iframe-with-loader_root__n0XX3')
    // const elementHandle = await page.waitForSelector('iframe')
    // await page.waitForSelector("iframe")
    //
    // const frame = await elementHandle.contentFrame()
    //
    // await frame.waitForSelector('#fm-login-id')
    // await page.waitForTimeout(60000);
    //
    // console.log("time done")
    //
    // const username = await frame.$('input#fm-login-id'),
    //     password = await frame.$('#fm-login-password'),
    //     btn = await frame.$('#fm-login-submit')
    //
    //
    // await rptInput(frame, username, data["login"])
    //
    // await password.type(data["password"], {delay: 100})
    // await page.waitForTimeout(5000);
    //
    // await btn.click()
    //
    //
    // // const subFrame = await page.waitForTimeout(5000).then(() => {
    // //     console.log("page.frames().length", page.frames().length)
    // //     return page.frames()[page.frames().length - 1]
    // // })
    //
    // const subFrame =  await page.waitForFrame(async frame => {
    //      if(frame.name() === '' && frame._id === "8589934593") return frame
    // });
    //
    //
    // if(subFrame) {
    //     console.log(await subFrame.$eval("iframe", (input) => input.getAttribute("src")))
    //
    //     await page.waitForTimeout(30000);
    // }

    // console.log("subFrame", await subFrame.contentFrame()?.$("#baxia-dialog-content"))

    // const valueTest = await subFrame.$eval('iframe', (input) => input.getAttribute("src"))
    // console.log("valueTest", valueTest)
    // const valueTest = await subFrame.$eval('iframe #baxia-dialog-content', (input) => input.getAttribute("src"))

    // let sliderElement = await subFrame.$('#nc_1_n1t')
    // const slider = await sliderElement?.boundingBox()
    //
    // //Work with captcha
    // if (slider?.x) {
    //     const sliderHandle = await subFrame.$('#nocaptcha #nc_1_n1z')
    //     const handle = await sliderHandle.boundingBox()
    //     await page.mouse.move(handle.x + handle.width / 2,
    //         handle.y + handle.height / 2)
    //     await page.mouse.down()
    //     await page.mouse.move(handle.x + slider.width,
    //         handle.y + slider.height / 2, {steps: 50})
    // }
    // await btn.click()
}

exports.auth = auth