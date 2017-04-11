/**
 * promise.js
 *
 * Created by ice on 2017/4/11 下午3:02.
 */

// 防止 callback hell

getArticleList()
    .then(function (articles) {
        return getArticle(articles[0].id)
    })
    .then(function (article) {
        return getAuthor(article.authorId)
    })
    .then(function (author) {
        alert(author.email)
    });


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