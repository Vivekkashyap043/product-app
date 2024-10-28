const express = require('express');
const router = express.Router();

router.get("/test", async(req, res) => {
    const date = new Date().toLocaleString("en-Uk", {timeZone: 'Asia/Kolkata'});
    return res.status(200).json({message: "Everything is ok", requestDate: date});
})
module.exports = router;