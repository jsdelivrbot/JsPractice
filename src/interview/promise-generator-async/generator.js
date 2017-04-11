/**
 * generator.js
 *
 * Created by ice on 2017/4/11 下午3:20.
 */

// 這就是generator的精髓所在了：用很像同步的語法，但其實是非同步

function* run() {
    var articles = yield getArticleList();
    var article = yield getArticle(articles[0].id);
    var author = yield getAuthor(article.authorId)
    alert(author.email)
}

// var gen = run()
// gen.next().value.then(function (articles) {
//     gen.next(articles).value.then(function (article) {
//         gen.next(article).value.then(function (author) {
//             gen.next(author);
//         })
//     })
// })

runGenerator(run())

function runGenerator(gen) {

    function go(result) {
        if (result.done) return;
        result.value.then(function (result) {
            go(gen.next(result))
        })
    }

    go(gen.next())
}


function getAuthor(id) {
    return new Promise(function (resolve, reject) {
        $.ajax("http://beta.json-generator.com/api/json/get/E105pDLh", {
            author: id
        }).done(function (result) {
            resolve(result)
        })
    })
}

function getArticle(id) {
    return new Promise(function (resolve, reject) {
        $.ajax("http://beta.json-generator.com/api/json/get/EkI02vUn", {
            id: id
        }).done(function (result) {
            resolve(result);
        })
    })
}


function getArticleList() {
    return new Promise(function (resolve, reject) {
        $.ajax(
            "http://beta.json-generator.com/api/json/get/Ey8JqwIh")
            .done(function (result) {
                resolve(result);
            });
    })
}