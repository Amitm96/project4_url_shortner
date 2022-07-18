const shortid = require('shortid')
const Url = require('../Models/urlModel')

const baseUrl = 'http://localhost:3000'
const urlRegex = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/



const shortenUrl = async function (req, res) {
    try {
        const { longUrl } = req.body // destructure the longUrl from req.body.longUrl

        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, msg: "Body should not be Empty.. " })
        }

        const urlCode = shortid.generate().toLowerCase()

        // const check = await Url.findOne({urlCode})
        // if(check)   urlCode = shortid.generate().toLowerCase()

        if (urlRegex.test(longUrl)) {

            let url = await Url.findOne({longUrl}).select({ _id: 0, __v: 0 })

            if (url) {
                res.status(200).send({ status: true, data: url })
            } else {
                // join the generated short code the the base url
                const shortUrl = baseUrl + '/' + urlCode

                let url = await Url.create({longUrl, shortUrl, urlCode})
                let data = {
                    longUrl : url.longUrl,
                    shortUrl : url.shortUrl,
                    urlCode : url.urlCode
                }

                res.status(201).send({ status: true, data: data })
            }
        }
        else {
            res.status(400).send({ status: false, message: "invalid longUrl" })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: err.message })
    }
}


const getUrlCode = async function (req, res) {
    try {
        // find a document match to the code in req.params.code
        const url = await Url.findOne({
            urlCode: req.params.urlCode
        })
        if (url) {

            return res.status(302).send({ status: true, data: url.longUrl })
        } else {
            // else return a not found 404 status
            return res.status(404).send({ status: false, message: 'No URL Found' })
        }

    }
    // exception handler
    catch (err) {
        console.error(err)
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { shortenUrl, getUrlCode }