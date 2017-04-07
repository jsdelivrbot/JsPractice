// require.config({
//     paths: {
//         "gquery": "https://rawgit.com/bigggge/gQuery/master/src/gQuery"
//     }
// });

// require(["helper/util", 'gquery'], function (util, $) {
//     console.log(util.work())
//     console.log($.parseJSON('{"name":"John"}'))
// })

require("scripts/helper/util", function (util) {
    console.log(util.work())
    // console.log($.parseJSON('{"name":"John"}'))
})


