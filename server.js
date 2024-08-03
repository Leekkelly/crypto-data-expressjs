const express = require('express')
const app = express()
const cheerio = require('cheerio')
const port = 8000

const url = (crypto) => `https://coingecko.com/en/coins/${crypto}/historical_data`
app.use(require('cors')())
app.use(express.json())

//routes
app.get('/', (req, res) => {
    res.status(200).send({message: "Thanks for using the crypto API database"})
})

app.get('/api/crypto/', async(req, res) => {
    const {crypto} = req.query
    console.log(crypto)
    if(!crypto) {
        return res.sendStatus(403)
    }
    try {
        const dataUrl = url(crypto)
        const dataRes = await fetch(dataUrl)
        const data = await dataRes.text()
        const $ = cheerio.load(data)
        // console.log($.html())
        const priceInList = $('td:nth-child(5)').get().map(val => $(val).text())
        console.log(priceInList);
        res.status(200).send({priceInList})
    } catch (error) {
        console.log('error:', error)
        res.sendStatus(500)
    }
})

app.post('/api/postData', (req, res) => {
    const { inputData } = req.body
    console.log(inputData);
    res.status(201).json({ "newMessageFromClient": inputData})
})

app.listen(port, () => console.log(`server is now running: ${port}`))