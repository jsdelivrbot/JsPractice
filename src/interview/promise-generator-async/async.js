/**
 * async.js
 *
 * Created by ice on 2017/4/11 下午3:39.
 */

async function run() {
    const articles = await getArticleList();
    const article = await getArticle(articles[0].id);
    return await getAuthor(article.authorId)
}

run().then((author) => alert(author.email))
    .catch((error) => console.error(error))

function getAuthor(id) {
    return new Promise((resolve, reject) => {
        $.ajax("http://beta.json-generator.com/api/json/get/E105pDLh", {author: id})
            .done((result) => resolve(result))
    })
}

function getArticle(id) {
    return new Promise((resolve, reject) => {
        $.ajax("http://beta.json-generator.com/api/json/get/EkI02vUn", {id: id})
            .done((result) => resolve(result))
            .fail((jqXHR, textStatus, errorThrown) => reject(textStatus))
    })
}

function getArticleList() {
    return new Promise((resolve, reject) => {
        $.ajax("http://beta.json-generator.com/api/json/get/Ey8JqwIh")
            .done((result) => resolve(result));
    })
}