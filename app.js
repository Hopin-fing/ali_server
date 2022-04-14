const puppeteer = require('puppeteer'),
    express = require('express'),
    config = require('config'),
    cron = require('node-cron'),
    connectDB = require('./config/db'),
    {auth, searchOrders, makeDocs} = require("./src"),
    app = express(),
    PORT_CRON = config.get('mainInfo')['portCron'] || 3015

connectDB()

app.use(express.json({limit: '10mb', extended: true}))
app.use(express.urlencoded({limit: '10mb', extended: true}))
app.use('/api/v1/docs', require('./routes/docs.routes'));


(async function start() {


    const url = `http://localhost:${PORT_CRON}/api/v1/docs/`


    try {
        app.listen(PORT_CRON, () => console.log(`App has been started on port ${PORT_CRON}...`))

        cron.schedule('*/30 * * * *', async () => {
            for (const cabinetName of Object.keys(config["cabinets"])) {
                const browser = await puppeteer.launch({
                        product: 'firefox'
                        // headless: false
                        // devtools: true
                    }),
                    page = await browser.newPage()
                await page.setDefaultNavigationTimeout(60000)
                await auth(page, browser, config["cabinets"][cabinetName])
                await searchOrders(page, url)
                await makeDocs(page, browser, url, cabinetName)
                await browser.close()
                console.log("end")

            }
        })
    } catch (e) {
        console.log("Error message", e.message)
        process.exit(1)
    }

})()