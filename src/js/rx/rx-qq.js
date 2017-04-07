/**
 * rx-qq.js
 *
 * Created by xiepan on 2017/1/20 下午5:09.
 */
import Rx from "rxjs/Rx";

var text = document.querySelector('#text'),
    timer = null,
    currentSearch = ''

text.addEventListener('keyup', e => {
    clearTimeout(timer)
    timer = setTimeout(() => {
        currentSearch = 'book'
        console.log('searching...')
        var searchText = e.target.value
        $.ajax({
            url: `search.qq.com/${searchText}`,
            success: data => {
                if (data.search === currentSearch) {
                    render(data)
                } else {
                    //...
                }
            }
        })
    }, 250)
})

var inputStream = Rx.Observable.fromEvent(text, 'keyup')
    .debounceTime(250)
    .pluck('target', 'value')//属性映射 event.target.value
    .switchMap(url => Http.get(url))
    .subscribe(data => render())

var Observable = Rx.Observable.create(observer => {
    observer.next(2)
    observer.complete()
    return () => console.log('disposed')
})

var Observer = Rx.Observer.create(
    x => console.log('Next:', x),
    err => console.log('Error:', err),
    () => console.log('Completed')
)

var subscription = Observable.subscribe(Observer)

var streamA = Rx.Observable.of(2)
streamA.subscribe(v => console.log(v))

// Operators
Rx.Observable.of(2)
    .map(v => v * 2)
    .subscribe(v => console.log(v))