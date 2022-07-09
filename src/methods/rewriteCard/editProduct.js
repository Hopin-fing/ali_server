const {fillInput} = require("../../emulateFunc");

const editProduct = async (browser, price, cardId, stockInfo) => {
    const stockForField = "0"

    const updStockAttrStand = (attr) => {
        // console.log("attr", attr)
        const arrAtr = attr.split(";")
        arrAtr.forEach(attr => attr.replace(/,/g, "."))
        let rad = arrAtr[0],
            OP = arrAtr[1],
            CYL = arrAtr[2]?.replace(",", ".") || ""
            ,
            AXIS = arrAtr[3] || ""
        rad = rad === "9" ? "9.0" : rad
        OP = !OP.includes(".") ? `${OP}.0` : OP
        OP = !OP.includes("-") && !["0.0"].includes(OP) && !OP.includes("+")
            ? `+${OP}` : OP
        OP = OP.replace(/(\.0)$/g, ".00").replace(/(\.5)$/g, ".50")
        OP = OP.replace(/\ (.*)$/gm, "")
        CYL = CYL?.replace(/\ (.*)$/gm, "")

        return {rad, OP, CYL, AXIS}
    }

    let pageProduct = (await browser.pages())[2]

    const selDivCheckBox = '#struct-p-200306261 .sequential-checkbox-wrap div.option-wrap',
        selLeftTable = '.locked-table-addon tr.sku-table-row',
        selRightTable = '.stretch .sell-sku-body-table tr.sku-table-row',
        selScrollTable = '.ver-scroll-wrap'
    await pageProduct.waitForSelector('.next-loading .sell-sku-table-wrap > .ver-scroll-wrap');

    await pageProduct.waitForSelector(selDivCheckBox)
    let listOP = await pageProduct.$$(selDivCheckBox),
        arrValueOP = []

    stockInfo.map(item => {
        // console.log("item", item["barcode"])

        const attOP = item["barcode"] !== "846566554409" ?  updStockAttrStand(item["attr"])["OP"] : "+3.75"
        // const attOP = item["barcode"] !== "630175475817" ?  updStockAttrStand(item["attr"])["OP"] : "+1.25"

        arrValueOP.push(parseFloat(attOP))
    })

    function sortEggsInNest(a, b) {
        return a > b ? 1 : b > a ? -1 : 0;
    }



    //@Чистим поле ОП от ранее проставленных "галок"
    for (let [index, itemOP] of listOP.entries()) {
        if(index === 28) {
            await pageProduct.evaluate(() => {
                document.querySelector(`#struct-p-200306261 .sequential-content-wrap .option-wrap:nth-child(1)`).scrollIntoView();
            });
        }
        if(index === 44) {
            await pageProduct.evaluate(() => {
                document.querySelector(`#struct-p-200306261 .sequential-content-wrap .option-wrap:nth-child(30)`).scrollIntoView();
            });
        }



        const checkbox = await itemOP.$('.next-checkbox-wrapper.checked')
        if (checkbox) await checkbox.click()
    }


    arrValueOP = arrValueOP.sort(sortEggsInNest)
    const clearArrValueOP = [...new Set(arrValueOP)]

    // console.log("arrValueOP", arrValueOP)


    //@ Прокручиваем страницу вверх чтобы скрипт не щелкнул по "плавающему" хедеру и не закрыт страницу
    pageProduct.evaluate(_ => {
        window.scrollBy(0, window.innerHeight);
    });
    //@ Заполняем очищенные ранее поля ОП
    for (let i = 0; clearArrValueOP.length > i; i++) {
        if(i === 28) {
            await pageProduct.evaluate(() => {
                document.querySelector(`#struct-p-200306261 .sequential-content-wrap .option-wrap:nth-child(1)`).scrollIntoView();
            });
        }
        if(i === 44) {
            await pageProduct.evaluate(() => {
                document.querySelector(`#struct-p-200306261 .sequential-content-wrap .option-wrap:nth-child(30)`).scrollIntoView();
            });
        }
        const checkbox = await listOP[i].$('.next-checkbox-wrapper')
        await checkbox.click()

        const field = await listOP[i].$('.sell-o-input input')

        let value = clearArrValueOP[i].toString()
        value = value === "0"
            ? "0.00" : !value.includes("-")
                ? `+${value}` : value
        value = !value.includes(".") ? `${value}.00` : value.replace(".5", ".50")
        await fillInput(field, value)

    }


    const scrollTable = async (indexScroll) => {
        await pageProduct.evaluate(async (selector, indexScroll) => {
            const scrollableSection = document.querySelector(selector);
            scrollableSection.scrollTop = indexScroll * (scrollableSection.offsetHeight / 2);
        }, selScrollTable, indexScroll);

    }

    await pageProduct.click("#struct-p-200306261")
    await pageProduct.waitForTimeout(5000)


    let rowsLeftTable = await pageProduct.$$(selLeftTable)
    let rowsRightTable = await pageProduct.$$(selRightTable)

    await pageProduct.evaluate(async () => {
        document.querySelector('#struct-basicPriceSalePrice').scrollIntoView();
    })

    //@ Заполняем список с id-шниками, ценами и остатками
    let counterElementTable = 0,
        startCountRows = rowsRightTable.length,
        index = 0,
        indexScroll = 0,
        counterRewriting = 0,
        valueRadTable,
        valueCYLTable
    // while (counterRewriting > 13 ||rowsRightTable.length !== 1)  {
    while ((startCountRows <= 11  && counterElementTable !== rowsRightTable.length)
    || (startCountRows > 11 && rowsRightTable.length !== 1))  {

        console.log("startCountRows", startCountRows)
        console.log("counterElementTable", counterElementTable)
        console.log("rowsRightTable.length", rowsRightTable.length)

        let counterElementsRight = await rowsRightTable[counterElementTable]?.$$("td"),
            counterElementsLeft = await rowsLeftTable[counterElementTable]?.$$("td")
        rowsRightTable = await pageProduct.$$(selRightTable)


        if (startCountRows > 11 && (rowsRightTable.length < 12
            && (counterElementTable === rowsRightTable.length))
            || counterElementTable >= 9) {
            await scrollTable(indexScroll)
            console.log("scroll")
            indexScroll++
            await pageProduct.waitForTimeout(2000)
            counterElementTable = 0
            rowsLeftTable = await pageProduct.$$(selLeftTable)
            rowsRightTable = await pageProduct.$$(selRightTable)
            counterElementsRight = await rowsRightTable[counterElementTable]?.$$("td")
            counterElementsLeft = await rowsLeftTable[counterElementTable]?.$$("td")
            // counterRewriting = 0

        }
        //@ Проверяем есть ли у линзы параметр CYL
        if (counterElementsLeft.length > 1) {
            valueCYLTable = await pageProduct.$('.col-p-200401264 p') !== null
                ? await rowsLeftTable[counterElementTable].$eval('.col-p-200401264 p',
                    async (el) => el.innerText) : false
            valueRadTable = await rowsLeftTable[counterElementTable]
                .$eval('.col-p-242162253 p', async (el) => el.innerText.replace(",", "."))
        }
        const valueOPTable = await rowsLeftTable[counterElementTable]
                .$eval('.col-p-200306261 p', async (el) => el.innerText),
            fieldArt = await rowsRightTable[counterElementTable]
                .$('.col-skuOuterId input'),
            fieldPrice = await rowsRightTable[counterElementTable]
                .$('.col-skuPrice input'),
            fieldStock = await rowsRightTable[counterElementTable]
                .$('.col-skuStock input')

        let art = stockInfo.find(stockItem => {
            // const attr = stockItem["barcode"] !== "630175475817" ?  updStockAttrStand(stockItem["attr"]) : {rad:"8.7",OP: "+1.25" }
            const attr = stockItem["barcode"] !== "846566554409" ?  updStockAttrStand(stockItem["attr"]) : {rad:"8.6",OP: "+3.75" }
            // console.log("attr", attr)

            if (attr.rad === valueRadTable
                && attr.OP === valueOPTable)
                return valueCYLTable ? attr.CYL === valueCYLTable?.replace(",", ".") : true
        })?.["barcode"].slice(-9) || ""
            //@desc Считаем количество одинаковый перезаписанных артикулов
        //     oldValueArt = await (await fieldArt.getProperty('value')).jsonValue()
        //
        // counterRewriting = oldValueArt === art ?  counterRewriting++ : counterRewriting


        art = art ? `AliE${art}` : `notExist${cardId}${index}`
        await fillInput(fieldPrice, price)
        await fillInput(fieldStock, stockForField)
        await fillInput(fieldArt, art)


        counterElementTable++
        index++

    }


    try {
        await pageProduct.waitForTimeout(4000)
        pageProduct = (await browser.pages())[2]
        await pageProduct.click('.next-btn.next-large.next-btn-primary.ol-next-button.block')
        await pageProduct.waitForSelector('div.class-product-success')
        await pageProduct.close()
    }catch (e) {
        console.log("Error", e)
    }

    console.log("done!!!!")


}
exports.editProduct = editProduct