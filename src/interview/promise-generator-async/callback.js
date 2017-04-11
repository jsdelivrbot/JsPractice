/**
 * callback.js
 *
 * Created by ice on 2017/4/11 下午3:00.
 */

// Callback
getArticleList(function (articles) {
    getArticle(articles[0].id, function (article) {
        getAuthor(article.authorId, function (author) {
            alert(author.email);
        })
    })
})

/**
 * @return {"email":"aszx87410@gmail.com","name":"huli","id":5}
 * @param id
 * @param callback
 */
function getAuthor(id, callback) {
    $.ajax("http://beta.json-generator.com/api/json/get/E105pDLh", {
        author: id
    }).done(function (result) {
        callback(result);
    })
}

/**
 *
 * @return {"timestamp":"2015-08-26","content":"content","authorId":5}
 * @param id
 * @param callback
 */
function getArticle(id, callback) {
    $.ajax("http://beta.json-generator.com/api/json/get/EkI02vUn", {
        id: id
    }).done(function (result) {
        callback(result);
    })
}

/**
 *
 * @return [{"id":1,"title":"文章1"},{"id":2,"title":"文章2"},{"id":3,"title":"文章3"}]
 * @param callback
 */
function getArticleList(callback) {
    $.ajax(
        "http://beta.json-generator.com/api/json/get/Ey8JqwIh")
        .done(function (result) {
            callback(result);
        });
}