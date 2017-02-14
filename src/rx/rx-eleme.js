/**
 * rx2.js
 *
 * Created by xiepan on 2017/1/20 下午2:51.
 */
import Rx from "rxjs/Rx";

var button = document.querySelector('button')

// button.addEventListener('click', () =>
//     console.log('clicked'))

Rx.Observable.fromEvent(button, 'click')
    .subscribe(() => console.log('Clicked!'));

// 数组 + 时间轴 = Observable
const Observable = Rx.Observable
const input = document.querySelector('input')

const search$ = Observable.fromEvent(input, 'input')
    .map(e => e.target.value)
    .filter(value => value.length >= 1)
    // .throttleTime(200) // 节流事件，指的是该事件最多没几秒触发一次
    .debounceTime(200) //去抖动时间，指的是必须等待的时间
    .distinctUntilChanged()// 当我们观察的数据状态发生改变的时候才会释放数据
    .switchMap(term => Observable.fromPromise(wikiIt(term)))
    .subscribe(
        x => render(x),
        err => console.error(err)
    )

function render(result) {
    document.querySelector('#result').innerHTML = result[1]
        .map(r => `<li>${r}</li>`)
        .join('')
}

function wikiIt(term) {
    console.log('request...')
    var url = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=' + encodeURIComponent(term) + '&origin=*';
    return $.getJSON(url)
}

////////////////////////////////////////////////////////////

const canvas = document.querySelector('canvas')
canvas.style.border = '1px solid #233'
const ctx = canvas.getContext('2d')
ctx.beginPath()

const down$ = Rx.Observable.fromEvent(canvas, 'mousedown')
    .map(() => 'down')
const up$ = Rx.Observable.fromEvent(canvas, 'mouseup')
    .map(() => 'up')
const upAndDown$ = up$.merge(down$)

const move$ = Rx.Observable.fromEvent(canvas, 'mousemove')
    .map(e => ({x: e.offsetX, y: e.offsetY}))
    //http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-bufferCount
    // .bufferCount(2)// 不连续的线
    .bufferCount(2, 1)// 连续的线

// 画出连续的线
const diff$ = move$.zip(move$.skip(1),
    (first, sec) => ([first, sec]))

upAndDown$
    .switchMap(action =>
        action === 'down' ? move$ : Rx.Observable.empty())
    .subscribe(draw)

function draw([first,sec]) {
    ctx.moveTo(first.x, first.y)
    ctx.lineTo(sec.x, sec.y)
    ctx.stroke()
}

