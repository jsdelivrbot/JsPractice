/**
 * a.js
 *
 * Created by ice on 2017/4/24 上午10:40.
 */


var myWorker = new Worker("my_task.js");

myWorker.addEventListener("message", function (oEvent) {
    console.log("Called back by the worker!\n");
}, false);

myWorker.postMessage(""); // start the worker.