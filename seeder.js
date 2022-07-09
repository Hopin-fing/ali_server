const puppeteer = require('puppeteer'),
    express = require('express'),
    config = require('config'),
    connectDB = require('./config/db'),
    {editProduct} = require("./src/methods/rewriteCard"),
    {getStock} = require("./src/stock"),
    app = express(),
    PORT_CRON = config.get('mainInfo')['portCron'] || 3015,
    {sendRequestGet} = require("./requests"),
    {searchCard} = require("./src/methods/rewriteCard");

const fs = require('fs').promises;

connectDB()

app.use(express.json({limit: '10mb', extended: true}))
app.use(express.urlencoded({limit: '10mb', extended: true}))
app.use('/api/v1/docs', require('./routes/docs.routes'));
app.use('/api/v1/barcode', require('./routes/barcode.routes'))



const rewritePageProduct = async (cabinetName) => {

    try {
        app.listen(PORT_CRON, () => console.log(`App has been started on port ${PORT_CRON}...`))


        const browser = await puppeteer.launch({
                defaultViewport: {width: 900, height:800},
                headless: false
            }),
            page = await browser.newPage()
        const cookiesString = await fs.readFile('./cookies/cookiesVip.json');
        const cookiesOld = JSON.parse(cookiesString)
        await page.setCookie(...cookiesOld)


        await page.goto('https://seller.aliexpress.ru/products/list',
            {waitUntil: 'load', timeout: 0})


        await searchCard(page, browser, PORT_CRON, cabinetName)

        // const cookies = await page.cookies();
        //
        // await fs.writeFile('./cookies/cookiesVip.json', JSON.stringify(cookies, null, 2),function() {
        //     console.log('complete cookies');
        // });



        // console.log("end")


    } catch (e) {
        console.log("Error message", e.message)
        process.exit(1)
    }

}

if(process.argv[2] === '-rwp') {
    rewritePageProduct("VipLinza")
}