const { fnList, getAll } = require('./getProxy');

(async function() {
    console.log(await fnList.fifthFreePort())
})()