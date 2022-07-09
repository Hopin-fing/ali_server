const fillInput = async (selector, value) => {
    await selector.click({clickCount: 3})
    await selector.type(value)
}

exports.fillInput = fillInput