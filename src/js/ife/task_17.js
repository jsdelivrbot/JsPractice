/**
 * task_17.js
 *
 * Created by xiepan on 2016/9/18 14:58.
 */

/* 数据格式演示
 var aqiSourceData = {
 "北京": {
 "2016-01-01": 10,
 "2016-01-02": 10,
 "2016-01-03": 10,
 "2016-01-04": 10
 }
 };
 */

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = ''
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};

var colors = ['#16324a', '#24385e', '#393f65', '#4e4a67', '#5a4563', '#b38e95',
    '#edae9e', '#c1b9c2', '#bec3cb', '#9ea7bb', '#99b4ce', '#d7f0f8'];

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: -1,
    nowGraTime: "day"
}

function getWidth(width, len) {
    var posObj = {};
    posObj.width = Math.floor(width / (len * 2));
    posObj.left.Math.floor(width / len);
    posObj.offsetLeft = (width - posObj.left * (len - 1) - posObj.width) / 2;
    return posObj;
}

function getHintLfeft(posObj, i) {
    if (posObj.left * i + posObj.offsetLeft + posObj.width / 2 - 60 <= 0) {
        return 5;
    } else if (posObj.left * i + posObj.offsetLeft + posObj.width / 2 + 60 >= 1200) {
        return (posObj.left * i + posObj.offsetLeft + posObj.width / 2 - 110);
    } else {
        return (posObj.left * i + posObj.offsetLeft + posObj.width / 2 - 60);
    }
}

function getTitle() {
    switch (pageState.nowGraTime) {
        case 'day':
            return '每日';
        case 'week':
            return '周平均';
        case 'month':
            return '月平均';
    }
}

function addEventHandler(ele, event, handler) {
    if (ele.addEventListener) {
        ele.addEventListener(event, handler, false);
    } else if (ele.attachEvent) {
        ele.attachEvent('on' + event, handler);
    } else {
        ele['on' + event] = handler;
    }
}

/**
 * 渲染图表
 */
function renderChart() {
    var innerHTML = "",
        i = 0,
        wrapper = document.getElementById('aqi-chart-wrap'),
        width = wrapper.clientWidth,
        selectedData = chartData[pageState.nowGraTime][pageState.nowSelectCity],
        len = Object.keys(selectedData).length,
        posObj = getWidth(width, len);

    innerHTML += "<div class='title'>" + pageState.nowSelectCity
        + "市01-03月" + getTitle() + "空气质量报告</div>"
    for (var key in selectedData) {
        innerHTML += "<div class='aqi-bar " + pageState.nowGraTime
            + "' style='height:" + selectedData[key] + "px; width: "
            + posObj.width + "px; left:" + (posObj.left * i + posObj.offsetLeft)
            + "px; background-color:" + colors[Math.floor(Math.random() * 11)]
            + "'></div>"
        innerHTML += "<div class='aqi-hint' style='bottom: "
            + (selectedData[key] + 10) + "px; left:" + getHintLfeft(posObj, i++)
            + "px'>" + key + "<br/> [AQI]: " + selectedData[key] + "</div>"
    }
    wrapper.innerHTML = innerHTML;

}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
    // 确定是否选项发生了变化

    // 设置对应数据

    // 调用图表渲染函数
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
    // 确定是否选项发生了变化

    // 设置对应数据

    // 调用图表渲染函数
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    var radio = document.getElementsByName()
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项

    // 给select设置事件，当选项发生变化时调用函数citySelectChange

}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm()
    initCitySelector();
    initAqiChartData();
}

init();
