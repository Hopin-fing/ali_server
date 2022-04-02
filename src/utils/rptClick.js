const rptClick = async (page,element) => {
    const elementHandler = page.$(".table_headerCheckbox__3EfSk.check-box_root__2Vp20")
    // while(!elementHandler.then((el) => el.getProperty("check-box__checked__29-2Q"))) {
    //     await element.click()
    //     console.log("elementHasClass")
    // }

        await element.click()
        console.log("elementHasClass")
}
exports.rptClick = rptClick