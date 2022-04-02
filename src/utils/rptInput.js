const rptInput = async (elementContent, selector, data) => {
    let checkField
    while(!checkField) {
        await selector.type(data, { delay: 100 })
        checkField = await elementContent.evaluate(el => el.value, selector)
    }
}


exports.rptInput = rptInput