var express = require('express'),
    app = express(),
    cpu = require('cpu-stats')

app.get('/', (req, res) => {
    cpu(1000, function(error, result) {
        if(error) {
            res.json({
                error: true,
                code: 100,
                detail: "We were not able to find out your CPU Usage, Sorry!!!"
            })
        } else {
            
        }
    })
}) 


app.listen(3000)