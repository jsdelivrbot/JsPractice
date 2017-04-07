/**
 * main.js
 *
 * Created by xiepan on 2016/9/20 11:50.
 */

var _table_ = document.createElement('table'),//表格
    _tr_ = document.createElement('tr'),//行
    _th_ = document.createElement('th'),//头
    _td_ = document.createElement('td');//单元

// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('main'));

var data;

$(document).ready(function () {
    $('#container').hide();

    var v2 = $.ajax({
        url: 'http://v2.taidii.com/api/cncenterlist/',
        headers: {
            'Authorization': '3b8c568f-732d-11e6-8249-9801a7aad89d',
        },
        method: 'GET',
        // success: function (data) {
        //
        //     var schoolArr = data.results || [];
        //
        //     getDashboardBySchoolID(schoolArr[0]['id']);
        //     generateSchoolSelect(schoolArr);
        //
        //     $("#school-list").change(function () {
        //         currentSchoolName = $(this).text();
        //         getDashboardBySchoolID($(this).val());
        //     });
        // }
    });

    var cn = $.ajax({
        url: 'http://www.taidii.cn/api/cncenterlist/',
        headers: {
            'Authorization': '3b8c568f-732d-11e6-8249-9801a7aad89d',
        },
        method: 'GET',
        // success: function (data) {
        //
        //     var schoolArr = data.results || [];
        //
        //     getDashboardBySchoolID(schoolArr[0]['id']);
        //     generateSchoolSelect(schoolArr);
        //
        //     $("#school-list").change(function () {
        //         currentSchoolName = $(this).text();
        //         getDashboardBySchoolID($(this).val());
        //     });
        // }
    });

    $.when(v2, cn).done(function (v2, cn) {

        var schoolV2Arr = v2[0].results || [];
        var schoolCnArr = cn[0].results || [];

        for (var schoolV2 = 0; schoolV2 < schoolV2Arr.length; schoolV2++) {
            schoolV2Arr[schoolV2]['url'] = 'http://v2.taidii.com/api/cndashboard/?id=';
        }

        for (var schoolCn = 0; schoolCn < schoolCnArr.length; schoolCn++) {
            schoolCnArr[schoolCn]['url'] = 'http://www.taidii.cn/api/cndashboard/?id=';
        }


        getDashboardBySchoolID(schoolV2Arr[0]['url'] + schoolV2Arr[0]['id']);
        generateSchoolSelect(schoolV2Arr.concat(schoolCnArr));

        $("#school-list").change(function () {
            var option = $(this);
            getDashboardBySchoolID(option.val());
        });

    })


});

function generateSchoolSelect(arr) {
    var schoolName = [];
    var schoolId = [];
    var string;
    for (var i = 0; i < arr.length; i++) {
        schoolName.push(arr[i]['name']);
        schoolId.push(arr[i]['id']);
        var url = arr[i]
        string += "<option value=\"" + arr[i]['url'] + arr[i]['id'] + "\" >" + arr[i]['name'] + "</option>";
    }

    $("#school-list").html(string);

}

function getDashboardBySchoolID(url) {
    $('.loader').show();

    $.ajax({
        // url: 'http://www.taidii.cn/api/cndashboard/?id=' + id,
        url: url,
        headers: {
            'Authorization': '3b8c568f-732d-11e6-8249-9801a7aad89d',
        },
        method: 'GET',
        success: function (data) {
            var result = data.results || [];
            result.reverse();
            $('body').css({'background': 'white'})
            $('.loader').hide();
            $('#container').show();
            handleData(result);
        }
    });
}


function handleData(arr) {
    data = arr;
    // 所有类别
    var categorySet = [];
    for (var i = 0; i < arr.length; i++) {
        for (var key in arr[i]) {
            if (arr[i].hasOwnProperty(key) && categorySet.indexOf(key) === -1 && key !== "id") {
                categorySet.push(key);
            }
        }
    }
    //数据的二维数组[[1.1,1.2],[17,18],[...],...]
    var d2Array = [];
    for (var i = 0; i < categorySet.length; i++) {
        var array = [];
        for (var j = 0; j < arr.length; j++) {
            var value = arr[j][categorySet[i]];
            array.push(value || (value == 0 ? '0' : ''));
        }
        d2Array.push(array);
    }

    //需要展示的数据
    var d2ArrayShow = [];
    for (var i = 0; i < categorySet.length; i++) {
        if (categorySet[i] !== 'date') {
            d2ArrayShow.push({
                name: categorySet[i],
                type: 'line',
                data: d2Array[i]
            });
        }
    }

    //需要展示的类别项目
    var categorySetShow = [];
    for (var i = 0; i < categorySet.length; i++) {
        if (categorySet[i] !== 'date') {
            categorySetShow.push(categorySet[i]);
        }
    }

    // 指定图表的配置项和数据
    var option = {
            baseOption: { // 这里是基本的『原子option』。
                title: {
                    text: ''
                },
                tooltip: {},
                grid: {
                    bottom: '18%',
                    left: '10%'
                },
                // 图例
                legend: {
                    data: categorySetShow,
                    // selectedMode: 'single',
                    formatter: function (name) {
                        var returnName;
                        if (name === "photocount") {
                            returnName = "照片数量";
                        } else if (name === "attendancecount") {
                            returnName = "考勤数量";
                        } else if (name === "studentcount") {
                            returnName = "学生人数";
                        }
                        return returnName;
                    }
                }
                ,
                xAxis: {
                    data: d2Array[d2Array.length - 1],
                    axisLabel: {
                        interval: 0,
                        formatter: function (value, index) {
                            return value;
                        }
                    }
                },
                yAxis: {}
                ,
                series: d2ArrayShow,

                animationEasing: 'elasticOut',
                animationDelayUpdate: function (idx) {
                    return idx * 10;
                },
                toolbox: {
                    show: true,
                    feature: {
                        myDataView: {
                            show: true,
                            title: '数据视图',
                            icon: 'M17.5,17.3H33 M17.5,17.3H33 M45.4,29.5h-28 M11.5,2v56H51V14.8L38.4,2H11.5z M38.4,2.2v12.7H51 M45.4,41.7h-28',
                            onclick: function () {
                                var modal = $('#data-view');
                                var modalbody = $('#modal-body')

                                modal.css({'display': 'block'});

                                modalbody.empty();
                                modalbody.append(buildHtmlTable(data))
                                $(".close").click(function () {
                                    modal.css({'display': 'none'});
                                });

                                modal.click(function (event) {
                                    // modal.css({'display': 'none'});
                                });
                            }
                        },
                        magicType: {
                            type: ['line', 'bar']
                        },
                        saveAsImage: {}
                    }
                }
            }
        }
        ;

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}


// Builds the HTML Table out of json data from restful service.
function buildHtmlTable(arr) {
    var table = _table_.cloneNode(false);
    var columns = addAllColumnHeaders(arr, table);
    for (var i = 0, maxi = arr.length; i < maxi; ++i) {
        var tr = _tr_.cloneNode(false);
        for (var j = 0, maxj = columns.length; j < maxj; ++j) {
            var td = _td_.cloneNode(false);
            var cellValue = arr[i][columns[j]];
            td.appendChild(document.createTextNode(cellValue || (cellValue == 0 ? '0' : '')));
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    return table;
}

// Adds a header row to the table and returns the set of columns.
// Need to do union of keys from all records as some records may not contain
// all records
function addAllColumnHeaders(arr, table) {
    var columnSet = [],
        tr = _tr_.cloneNode(false);
    for (var i = 0, l = arr.length; i < l; i++) {
        for (var key in arr[i]) {

            if (arr[i].hasOwnProperty(key) && columnSet.indexOf(key) === -1 && key !== "id") {
                columnSet.push(key);
                var th = _th_.cloneNode(false);
                if (key === "photocount") {
                    key = "照片数量";
                } else if (key === "name") {
                    key = "学校名称";
                } else if (key === "attendancecount") {
                    key = "考勤数量";
                } else if (key === "date") {
                    key = "日期";
                } else if (key === "studentcount") {
                    key = "学生人数";
                }
                th.appendChild(document.createTextNode(key));
                tr.appendChild(th);
            }
        }
    }
    table.appendChild(tr);

    return columnSet;
}