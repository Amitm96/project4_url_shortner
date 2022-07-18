const validUrl = require('valid-url')
const shortid = require('shortid')
const { isValid } = require('shortid')

const isValidUrl = urlString=> {
    try { 
        return Boolean(new URL(urlString)); 
    }
    catch(e){ 
        return false; 
    }
}
const shortenUrl = async function(req,res){
const {
    longUrl
} = req.body // destructure the longUrl from req.body.longUrl
const{baseUrl}=req.params
// check base url if valid using the validUrl.isUri method
if (!isValidUrl(baseUrl)) {
    return res.status(401).json('Invalid base URL')
}

// if valid, we create the url code
const urlCode = shortid.generate()

// check long url if valid using the validUrl.isUri method
if (validUrl.isUri(longUrl)) {
    try {
        /* The findOne() provides a match to only the subset of the documents 
        in the collection that match the query. In this case, before creating the short URL,
        we check if the long URL was in the DB ,else we create it.
        */
        let url = await Url.findOne({
            longUrl
        })

        // url exist and return the respose
        if (url) {
            res.json(url)
        } else {
            // join the generated short code the the base url
            const shortUrl = baseUrl + '/' + urlCode

            // invoking the Url model and saving to the DB
            url = new Url({
                longUrl,
                shortUrl,
                urlCode,
                date: new Date()
            })
            await url.save()
            res.json(url)
        }
    }
    // exception handler
    catch (err) {
        console.log(err)
        res.status(500).json('Server Error')
    }
} else {
    res.status(401).json('Invalid longUrl')
}}

module.exports={shortenUrl}