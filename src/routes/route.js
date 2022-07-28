const express = require('express');
const router = express.Router();
const urlController = require("../Controllers/urlController");

router.get("/" , async function(req , res){
    res.status(200).render('index.html')
})
router.post("/url/shorten",urlController.shortenUrl)
router.get("/:urlCode",urlController.getUrlCode)

module.exports = router;