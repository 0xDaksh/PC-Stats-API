var express = require('express'),
    app = express(),
    cpu = require('cpu-stats'),
    os = require('os'),
    s = require('shelljs')

var getGPU = () => {
    let cmd = '';
    switch (os.platform().toLowerCase()) {
        case 'win32':
            cmd = 'wmic path win32_VideoController get name'
            break;
        case 'linux':
            cmd = 'sudo lshw -C display'
            break;
        case 'darwin':
            cmd = 'system_profiler | grep -A35 Graphics/Displays'
            break;
    }
    name = s.exec(cmd)
    name = name.split('\r')
    for(let i in name) {
        if(name[i].indexOf('NVIDIA') !== - 1 || name[i].indexOf('AMD') !== -1) {
            name = name[i]
            console.log(name[i])
            name = name.split('\n')
            name = name[1]
        }
    }
    return name
}

app.get('/', (req, res) => {
    cpu(1000, function (error, result) {
        if (error) {
            res.json({
                error: true,
                code: 100,
                detail: "We were not able to find out your CPU Usage, Sorry!!!"
            })
        } else {
            data = []
            for (let i in result) {
                data.push({
                    name: `CPU ${i}`,
                    usage: result[i].cpu
                })
            }
            res.json({
                CPU: {
                    name: os.cpus()[0].model,
                    CPUs: data
                },
                Ram: {
                    free: parseFloat(os.freemem() / 1000000000).toFixed(2),
                    total: parseFloat(os.totalmem() / 1000000000).toFixed(2),
                    unit: 'GB'
                },
                GPU: {
                    name: getGPU()
                }
            })
        }
    })
})


app.listen(3000)