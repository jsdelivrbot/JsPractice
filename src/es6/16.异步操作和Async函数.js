/**
 * 16.异步操作和Async函数.js
 *
 * Created by xiepan on 2016/11/4 上午9:54.
 */


var fs = require('fs');

var readFile = function (fileName) {
    return new Promise(function (resolve, reject) {
        fs.readFile(fileName, function (error, data) {
            if (error) reject(error);
            resolve(data);
        });
    });
};

var asyncReadFile = async function () {
    var f1 = await readFile('./a.txt');
    var f2 = await readFile('./b.txt');
    console.log(f1.toString());
    console.log(f2.toString());
};

// asyncReadFile()

var fetch = require('/usr/local/lib/node_modules/node-fetch');

async function logInOrder(urls) {
    // 并发读取远程URL
    const textPromises = urls.map(async url => {
        const response = await fetch(url);
        return response.text();
    });

    // 按次序输出
    for (const textPromise of textPromises) {
        // console.log('-----------------------------------')
        console.log(await textPromise);
    }
}

// logInOrder(['http://analysis.bestyiwan.com/api/open/enrollment/statistics/?format=json&api_key=smYS9q9Hv9o7Ioek95Z7MFmuimoOsneuAMEWGtq3Uq6JYiRqyQBaOPSda3tZ06CaXznie6cdBbOI5tgpuyvxo9zEchp6sfGD3pKKkVl9gf6zkKD6CNq3WFV2IyVhAL8TVFoMsJgvKlTZAnVZz4htejJfkw4V54UVDxoTEgju3ivzpnzdl6jHcVj7ACnBatCPWDZlFXp9raEokOFFKtGZKvLhe9aG22F3MkDUhbfR2DypXhe6ZaT9hjvbL6BeDYf&client=GEH&month=10&year=2016',
//     'http://analysis.bestyiwan.com/api/open/enrollment/statistics/?format=json&api_key=smYS9q9Hv9o7Ioek95Z7MFmuimoOsneuAMEWGtq3Uq6JYiRqyQBaOPSda3tZ06CaXznie6cdBbOI5tgpuyvxo9zEchp6sfGD3pKKkVl9gf6zkKD6CNq3WFV2IyVhAL8TVFoMsJgvKlTZAnVZz4htejJfkw4V54UVDxoTEgju3ivzpnzdl6jHcVj7ACnBatCPWDZlFXp9raEokOFFKtGZKvLhe9aG22F3MkDUhbfR2DypXhe6ZaT9hjvbL6BeDYf&client=GEH&month=11&year=2016',
//     'http://analysis.bestyiwan.com/api/open/enrollment/statistics/?format=json&api_key=smYS9q9Hv9o7Ioek95Z7MFmuimoOsneuAMEWGtq3Uq6JYiRqyQBaOPSda3tZ06CaXznie6cdBbOI5tgpuyvxo9zEchp6sfGD3pKKkVl9gf6zkKD6CNq3WFV2IyVhAL8TVFoMsJgvKlTZAnVZz4htejJfkw4V54UVDxoTEgju3ivzpnzdl6jHcVj7ACnBatCPWDZlFXp9raEokOFFKtGZKvLhe9aG22F3MkDUhbfR2DypXhe6ZaT9hjvbL6BeDYf&client=GEH&month=12&year=2016'])


fetch('http://localhost:8002/service')
    .then(function (response) {
        if (response.ok) {
            console.log(response.json())
        } else {
            // 404 401
            console.log('Network response was not ok.');
        }
    })
    .catch(function (error) {
        // fetch error :api 没响应
        console.log('There has been a problem with your fetch operation: ' + error.message);
    });