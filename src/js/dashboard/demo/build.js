(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/**
 * main.js
 *
 * Created by ice on 2017/4/6 上午11:13.
 */

!function () {

    // $(".login-modal-overlay").click(function () {
    //     $(this).fadeOut(200);
    // });

    // $(".openb").click(function () {
    // $(".login-modal-overlay").fadeIn(200);
    // });

    // $(".login-modal").click(function (event) {
    //     event.stopPropagation();
    // });

    // Chart
    var mainChart = echarts.init(document.getElementById('main'));
    var enquiryChart = echarts.init(document.getElementById('enquiry'));
    var enrolledChart = echarts.init(document.getElementById('enrolled'));
    var withdrawnChart = echarts.init(document.getElementById('withdrawn'));

    // 基础配置
    var baseOptions = {
        title: {
            text: ''
        },
        tooltip: {
            // trigger: 'axis',
            // axisPointer: {
            //     type: 'cross'
            // }
        },
        grid: {
            left: '35%',
            right: '5%',
            // bottom: '1%',
            containLabel: true
        },
        xAxis: {
            data: []
        },
        yAxis: {
            type: 'value'
        },
        toolbox: {
            feature: {
                saveAsImage: {
                    title: 'save as image'
                },
                magicType: {
                    title: {
                        line: 'line', bar: 'bar'
                    },
                    type: ['line', 'bar']
                }
            }
        }
    };

    mainChart.setOption(baseOptions);
    enquiryChart.setOption(baseOptions);
    enrolledChart.setOption(baseOptions);
    withdrawnChart.setOption(baseOptions);
    mainChart.showLoading();

    // 全选变量
    var selectAll = 'Select All';
    var selectFlag = true;
    var dynamicSelected = {};

    // 请求变量
    var host = 'http://analysis.bestyiwan.com/';
    // const client = getQueryString('client') || 'GEH';
    var client = getQueryString('client');
    // const apiKey = getQueryString('api_key') || 'smYS9q9Hv9o7Ioek95Z7MFmuimoOsneuAMEWGtq3Uq6JYiRqyQBaOPSda3tZ06CaXznie6cdBbOI5tgpuyvxo9zEchp6sfGD3pKKkVl9gf6zkKD6CNq3WFV2IyVhAL8TVFoMsJgvKlTZAnVZz4htejJfkw4V54UVDxoTEgju3ivzpnzdl6jHcVj7ACnBatCPWDZlFXp9raEokOFFKtGZKvLhe9aG22F3MkDUhbfR2DypXhe6ZaT9hjvbL6BeDYf'
    var apiKey = getQueryString('api_key');
    var url = host + 'api/open/enrollment/statistics/?format=json' + '&client=' + client + '&api_key=' + apiKey;

    if (!client || !apiKey) {
        alert('Request Error: Missing client or api key');
        mainChart.hideLoading();
        throw new Error('Request Error: Missing client or api key');
    }
    var date = new Date();
    var currentMonth = date.getMonth() + 1;
    var currentYear = date.getFullYear();
    // 请求API数组
    var reqArr = [];
    for (var j = currentMonth !== 12 ? currentMonth + 1 : 13; j < 13; j++) {
        reqArr.push($.get(url + ('&month=' + j + '&year=' + (currentYear - 1))));
    }
    for (var i = 1; i <= currentMonth; i++) {
        reqArr.push($.get(url + ('&month=' + i + '&year=' + currentYear)));
    }
    console.log('Request Array', reqArr);

    loadChart();

    /**
     * 加载图表
     */
    function loadChart() {
        var _$;

        (_$ = $).when.apply(_$, reqArr).done(function () {

            $('h2.title').css('display', 'block');
            mainChart.hideLoading();

            var filterData = [];

            for (var _len = arguments.length, data = Array(_len), _key = 0; _key < _len; _key++) {
                data[_key] = arguments[_key];
            }

            for (var _i = 0; _i < data.length; _i++) {
                filterData.push(data[_i][0]);
            }

            var totalData = Array.prototype.concat.apply([], filterData);
            var centreData = getCentresInData(totalData);

            generateCentreList(centreData);
            generateData('all', totalData);

            // 学校列表点击事件
            $('#centre-list').click(function (ev) {

                // 点击全选
                if (ev.target.getAttribute('value') === 'all') {
                    $('#centre-list li:not([value="all"])').each(function () {
                        if ($('li[value="all"]').hasClass('checked')) {
                            $(this).removeClass('checked');
                        } else {
                            $(this).addClass('checked');
                        }
                    });
                    // 点击学校
                } else {
                    if (ev.target.tagName === 'LI') {
                        ev.target.classList.toggle('checked');
                    }
                }

                // 处理All按钮状态
                if (centreData.length - 2 === $('.checked:not([value="all"])').length) {
                    $('li[value="all"]').addClass('checked');
                } else {
                    $('li[value="all"]').removeClass('checked');
                }

                // 选择的学校
                var selectedCentres = [];
                $('.checked').each(function () {
                    selectedCentres.push($(this).attr('value'));
                });

                generateData(selectedCentres, totalData);
            });
        }).catch(function (error) {
            console.log(error);
            alert('Request error');
        });
    }

    function generateData(centreNamesArr, totalData) {

        if (typeof centreNamesArr === 'string') {
            centreNamesArr = [centreNamesArr];
        }

        var filterData = void 0;
        if (centreNamesArr.length === 0) {
            filterData = [];
        } else if (centreNamesArr[0] === 'all') {
            filterData = totalData;
        } else {
            filterData = getDataByCentreArray(totalData, centreNamesArr);
        }

        var legendData = getLevelsInData(filterData);

        // 每个年级对应的数据之和 例: ['一年级'，10]
        var legendWithStudentCount = [],
            legendWithEnquiry = [],
            legendWithEnrolled = [],
            legendWithWithDrawn = [];

        // 遍历各个年级，寻找filterData中对应的年级
        for (var _i2 = 0; _i2 < legendData.length; _i2++) {
            var totalStudentCount = 0;
            var totalEnquiry = 0;
            var totalEnrolled = 0;
            var totalWithDrawn = 0;
            for (var _j = 0; _j < filterData.length; _j++) {
                if (filterData[_j]['Level'] === legendData[_i2]) {
                    totalStudentCount += filterData[_j]['Student Count'];
                    totalEnquiry += filterData[_j]['Enquiry'];
                    totalEnrolled += filterData[_j]['Enrolled'];
                    totalWithDrawn += filterData[_j]['Withdrawn'];
                }
            }
            legendWithStudentCount.push([legendData[_i2], totalStudentCount]);
            legendWithEnquiry.push([legendData[_i2], totalEnquiry]);
            legendWithEnrolled.push([legendData[_i2], totalEnrolled]);
            legendWithWithDrawn.push([legendData[_i2], totalWithDrawn]);
        }

        var xAxisData = [];
        var xData = [];
        var studentCountSeriesData = [],
            enquirySeriesData = [],
            enrolledSeriesData = [],
            withdrawnSeriesData = []; //图表4
        // 对年级循环,生成某一年级的数据

        var _loop = function _loop(_i3) {
            var levelName = legendData[_i3];
            // 根据level年级筛选数据
            var dataFilterByLevel = getDataByLevel(filterData, levelName);
            // console.log(levelName, dataFilterByLevel);
            var studentCountArr = [],
                enquiryArr = [],
                enrolledArr = [],
                withdrawnArr = []; //线形图的数据[1,2,3...]

            // 此处的dataFilterByLevel是所有数据
            var temp = []; // 存储分组后的数组,按月份分成12组
            var t = dataFilterByLevel;
            var mod = 12;

            var _loop2 = function _loop2(_i4) {
                temp.push(t.filter(function (item, index, arr) {
                    if ((index - _i4) % mod === 0) return item;
                }));
            };

            for (var _i4 = 0; _i4 < mod; _i4++) {
                _loop2(_i4);
            }
            for (var _i5 = 0; _i5 < temp.length; _i5++) {
                var studentCountTotalPerMonth = 0,
                    enquiryTotalPerMonth = 0,
                    enrolledTotalPerMonth = 0,
                    withdrawnTotalPerMonth = 0;
                for (var _j2 = 0; _j2 < temp[_i5].length; _j2++) {
                    studentCountTotalPerMonth += temp[_i5][_j2]['Student Count'];
                    enquiryTotalPerMonth += temp[_i5][_j2]['Enquiry'];
                    enrolledTotalPerMonth += temp[_i5][_j2]['Enrolled'];
                    withdrawnTotalPerMonth += temp[_i5][_j2]['Withdrawn'];
                }
                studentCountArr.push(studentCountTotalPerMonth);
                enquiryArr.push(enquiryTotalPerMonth);
                enrolledArr.push(enrolledTotalPerMonth);
                withdrawnArr.push(withdrawnTotalPerMonth);
            }

            // 生成X轴
            for (var _j3 = 0; _j3 < dataFilterByLevel.length; _j3++) {
                xData.push(dataFilterByLevel[_j3]['Year'] + '-' + dataFilterByLevel[_j3]['Month']);
                xAxisData = Array.from(new Set(xData));
            }

            // 设置各个年级的线形图,也就是在一张图表中生成一条线
            console.log('studentCountArr', studentCountArr);
            studentCountSeriesData.push(getLineObj(studentCountArr, levelName));
            enquirySeriesData.push(getLineObj(enquiryArr, levelName));
            enrolledSeriesData.push(getLineObj(enrolledArr, levelName));
            withdrawnSeriesData.push(getLineObj(withdrawnArr, levelName));
        };

        for (var _i3 = 0; _i3 < legendData.length; _i3++) {
            _loop(_i3);
        }

        // 设置饼图
        studentCountSeriesData.push(getPieObj(legendWithStudentCount));
        enquirySeriesData.push(getPieObj(legendWithEnquiry));
        enrolledSeriesData.push(getPieObj(legendWithEnrolled));
        withdrawnSeriesData.push(getPieObj(legendWithWithDrawn));

        var selAllObj = {
            name: selectAll,
            type: 'line'
        };
        studentCountSeriesData.push(selAllObj);
        enquirySeriesData.push(selAllObj);
        enrolledSeriesData.push(selAllObj);
        withdrawnSeriesData.push(selAllObj);

        console.log(studentCountSeriesData);

        // 填入数据
        if (filterData.length === 0) {
            mainChart.setOption(getOption(legendData, xAxisData, []));
            enquiryChart.setOption(getOption(legendData, xAxisData, []));
            enrolledChart.setOption(getOption(legendData, xAxisData, []));
            withdrawnChart.setOption(getOption(legendData, xAxisData, []));
        } else {
            mainChart.setOption(getOption(legendData, xAxisData, studentCountSeriesData));
            enquiryChart.setOption(getOption(legendData, xAxisData, enquirySeriesData));
            enrolledChart.setOption(getOption(legendData, xAxisData, enrolledSeriesData));
            withdrawnChart.setOption(getOption(legendData, xAxisData, withdrawnSeriesData));

            handleSelectAll(mainChart, getOption(legendData, xAxisData, studentCountSeriesData));
            handleSelectAll(enquiryChart, getOption(legendData, xAxisData, enquirySeriesData));
            handleSelectAll(enrolledChart, getOption(legendData, xAxisData, enrolledSeriesData));
            handleSelectAll(withdrawnChart, getOption(legendData, xAxisData, withdrawnSeriesData));
        }
    }

    /**
     *
     * @param chart
     * @param options
     */
    function handleSelectAll(chart, options) {
        chart.off('legendselectchanged');
        chart.on('legendselectchanged', function (params) {
            //legend　全选操作
            if (params.name === selectAll) {
                selectFlag = !selectFlag; //toggle
                //设置全选
                for (var index in params.selected) {
                    dynamicSelected[index] = selectFlag;
                }
                //重绘
                chart.setOption(options);
            }
        });
    }

    /**
     *
     * @param data
     * @returns {{type: string, radius: [number,string], center: [string,string], data: Array}}
     */
    function getPieObj(data) {
        var pieData = [];
        for (var _i6 = 0; _i6 < data.length; _i6++) {
            pieData.push({ value: data[_i6][1], name: data[_i6][0] });
        }
        return {
            type: 'pie',
            radius: [0, '20%'],
            center: ['18%', '50%'],
            data: pieData
        };
    }

    /**
     *
     * @param arr
     * @param name
     * @returns {{name: *, type: string, x: string, data: *}}
     */
    function getLineObj(arr, name) {
        return {
            name: name,
            type: 'line',
            x: '35%',
            data: arr
        };
    }

    /**
     *
     * @param legendData
     * @param xAxisData
     * @param seriesData
     * @returns {{legend: {right: string, data, selected: {}}, xAxis: {type: string, boundaryGap: boolean, data: *}, series: *}}
     */
    function getOption(legendData, xAxisData, seriesData) {
        return {
            legend: {
                right: '10%',
                // data: legendData.concat(selectAll),
                data: [selectAll].concat(legendData),
                selected: dynamicSelected
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xAxisData
            },
            series: seriesData
        };
    }

    /**
     *
     * @param data
     * @param centreNameArr
     * @returns {Array}
     */
    function getDataByCentreArray(data, centreNameArr) {
        var result = [];
        for (var _i7 = 0; _i7 < centreNameArr.length; _i7++) {
            for (var _j4 = 0; _j4 < data.length; _j4++) {
                if (data[_j4]['Centre'] === centreNameArr[_i7]) {
                    result.push(data[_j4]);
                }
            }
        }
        return result;
    }

    /**
     *
     * @param data
     * @returns {Array}
     */
    function getLevelsInData(data) {
        var result = [];
        for (var _i8 = 0; _i8 < data.length; _i8++) {
            if (result.indexOf(data[_i8]['Level']) < 0) result.push(data[_i8]['Level']);
        }
        return result;
    }

    /**
     *
     * @param data
     * @returns {Array}
     */
    function getCentresInData(data) {
        var result = [];
        for (var _i9 = 0; _i9 < data.length; _i9++) {
            if (result.indexOf(data[_i9]['Centre']) < 0) result.push(data[_i9]['Centre']);
        }
        return result;
    }

    /**
     *
     * @param arr
     */
    function generateSchoolSelect(arr) {
        var string = "<option value='all'>All</option>";
        for (var _i10 = 0; _i10 < arr.length; _i10++) {
            string += "<option value=\"" + arr[_i10] + "\">" + arr[_i10] + "</option>";
        }

        $("#school-list").html(string);
    }

    /**
     *
     * @param arr
     */
    function generateCentreList(arr) {
        var string = "<li class='checked' value='all'>All</li>";
        for (var _i11 = 0; _i11 < arr.length; _i11++) {
            if (arr[_i11] === 'EduGarden Discovery' || arr[_i11] === 'Joy Talent Childcare Centre Pte Ltd') continue;
            string += "<li class='checked' value=\"" + arr[_i11] + "\">" + arr[_i11] + "</li>";
        }
        $("#centre-list").html(string);
    }

    /**
     *
     * @param filterData
     * @param level
     */
    function getDataByLevel(filterData, level) {
        return filterData.filter(function (val) {
            return val['Level'] === level;
        });
    }

    /**
     *
     * @param name
     * @returns {string}
     */
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r) return unescape(r[2]);
        return null;
    }

    function getCookie(name) {
        var cookieName = encodeURIComponent(name) + '=',
            cookieStart = document.cookie.indexOf(cookieName),
            cookieValue = null;
        if (cookieStart > -1) {
            var cookieEnd = document.cookie.indexOf(';', cookieStart);
            if (cookieEnd == -1) {
                cookieEnd = document.cookie.length;
            }
            cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
        }
        return cookieValue;
    }
}();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7O0FBTUEsQ0FBQyxZQUFZOztBQUVUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsUUFBSSxZQUFZLFFBQVEsSUFBUixDQUFhLFNBQVMsY0FBVCxDQUF3QixNQUF4QixDQUFiLENBQWhCO0FBQ0EsUUFBSSxlQUFlLFFBQVEsSUFBUixDQUFhLFNBQVMsY0FBVCxDQUF3QixTQUF4QixDQUFiLENBQW5CO0FBQ0EsUUFBSSxnQkFBZ0IsUUFBUSxJQUFSLENBQWEsU0FBUyxjQUFULENBQXdCLFVBQXhCLENBQWIsQ0FBcEI7QUFDQSxRQUFJLGlCQUFpQixRQUFRLElBQVIsQ0FBYSxTQUFTLGNBQVQsQ0FBd0IsV0FBeEIsQ0FBYixDQUFyQjs7QUFFQTtBQUNBLFFBQU0sY0FBYztBQUNoQixlQUFPO0FBQ0gsa0JBQU07QUFESCxTQURTO0FBSWhCLGlCQUFTO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFKSyxTQUpPO0FBVWhCLGNBQU07QUFDRixrQkFBTSxLQURKO0FBRUYsbUJBQU8sSUFGTDtBQUdGO0FBQ0EsMEJBQWM7QUFKWixTQVZVO0FBZ0JoQixlQUFPO0FBQ0gsa0JBQU07QUFESCxTQWhCUztBQW1CaEIsZUFBTztBQUNILGtCQUFNO0FBREgsU0FuQlM7QUFzQmhCLGlCQUFTO0FBQ0wscUJBQVM7QUFDTCw2QkFBYTtBQUNULDJCQUFPO0FBREUsaUJBRFI7QUFJTCwyQkFBVztBQUNQLDJCQUFPO0FBQ0gsOEJBQU0sTUFESCxFQUNXLEtBQUs7QUFEaEIscUJBREE7QUFJUCwwQkFBTSxDQUFDLE1BQUQsRUFBUyxLQUFUO0FBSkM7QUFKTjtBQURKO0FBdEJPLEtBQXBCOztBQXFDQSxjQUFVLFNBQVYsQ0FBb0IsV0FBcEI7QUFDQSxpQkFBYSxTQUFiLENBQXVCLFdB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QUFtQixTQUFTLE1BQVQsQ0FBZ0IsU0FBaEIsQ0FBMEIsY0FBYyxXQUFXLE1BQW5ELEVBQTJELFNBQTNELENBQW5CLENBQWQ7QUFFSDtBQUNELGVBQU8sV0FBUDtBQUNIO0FBRUosQ0FuZUEsRUFBRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIG1haW4uanNcbiAqXG4gKiBDcmVhdGVkIGJ5IGljZSBvbiAyMDE3LzQvNiDkuIrljYgxMToxMy5cbiAqL1xuXG4hZnVuY3Rpb24gKCkge1xuXG4gICAgLy8gJChcIi5sb2dpbi1tb2RhbC1vdmVybGF5XCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAvLyAgICAgJCh0aGlzKS5mYWRlT3V0KDIwMCk7XG4gICAgLy8gfSk7XG5cbiAgICAvLyAkKFwiLm9wZW5iXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAvLyAkKFwiLmxvZ2luLW1vZGFsLW92ZXJsYXlcIikuZmFkZUluKDIwMCk7XG4gICAgLy8gfSk7XG5cbiAgICAvLyAkKFwiLmxvZ2luLW1vZGFsXCIpLmNsaWNrKGZ1bmN0aW9uIChldmVudCkge1xuICAgIC8vICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAvLyB9KTtcblxuICAgIC8vIENoYXJ0XG4gICAgbGV0IG1haW5DaGFydCA9IGVjaGFydHMuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbicpKTtcbiAgICBsZXQgZW5xdWlyeUNoYXJ0ID0gZWNoYXJ0cy5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbnF1aXJ5JykpO1xuICAgIGxldCBlbnJvbGxlZENoYXJ0ID0gZWNoYXJ0cy5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbnJvbGxlZCcpKTtcbiAgICBsZXQgd2l0aGRyYXduQ2hhcnQgPSBlY2hhcnRzLmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dpdGhkcmF3bicpKTtcblxuICAgIC8vIOWfuuehgOmFjee9rlxuICAgIGNvbnN0IGJhc2VPcHRpb25zID0ge1xuICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgdGV4dDogJydcbiAgICAgICAgfSxcbiAgICAgICAgdG9vbHRpcDoge1xuICAgICAgICAgICAgLy8gdHJpZ2dlcjogJ2F4aXMnLFxuICAgICAgICAgICAgLy8gYXhpc1BvaW50ZXI6IHtcbiAgICAgICAgICAgIC8vICAgICB0eXBlOiAnY3Jvc3MnXG4gICAgICAgICAgICAvLyB9XG4gICAgICAgIH0sXG4gICAgICAgIGdyaWQ6IHtcbiAgICAgICAgICAgIGxlZnQ6ICczNSUnLFxuICAgICAgICAgICAgcmlnaHQ6ICc1JScsXG4gICAgICAgICAgICAvLyBib3R0b206ICcxJScsXG4gICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgeEF4aXM6IHtcbiAgICAgICAgICAgIGRhdGE6IFtdXG4gICAgICAgIH0sXG4gICAgICAgIHlBeGlzOiB7XG4gICAgICAgICAgICB0eXBlOiAndmFsdWUnXG4gICAgICAgIH0sXG4gICAgICAgIHRvb2xib3g6IHtcbiAgICAgICAgICAgIGZlYXR1cmU6IHtcbiAgICAgICAgICAgICAgICBzYXZlQXNJbWFnZToge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ3NhdmUgYXMgaW1hZ2UnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBtYWdpY1R5cGU6IHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmU6ICdsaW5lJywgYmFyOiAnYmFyJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBbJ2xpbmUnLCAnYmFyJ11cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgbWFpbkNoYXJ0LnNldE9wdGlvbihiYXNlT3B0aW9ucyk7XG4gICAgZW5xdWlyeUNoYXJ0LnNldE9wdGlvbihiYXNlT3B0aW9ucyk7XG4gICAgZW5yb2xsZWRDaGFydC5zZXRPcHRpb24oYmFzZU9wdGlvbnMpO1xuICAgIHdpdGhkcmF3bkNoYXJ0LnNldE9wdGlvbihiYXNlT3B0aW9ucyk7XG4gICAgbWFpbkNoYXJ0LnNob3dMb2FkaW5nKCk7XG5cbiAgICAvLyDlhajpgInlj5jph49cbiAgICBjb25zdCBzZWxlY3RBbGwgPSAnU2VsZWN0IEFsbCc7XG4gICAgbGV0IHNlbGVjdEZsYWcgPSB0cnVlO1xuICAgIGxldCBkeW5hbWljU2VsZWN0ZWQgPSB7fTtcblxuICAgIC8vIOivt+axguWPmOmHj1xuICAgIGNvbnN0IGhvc3QgPSAnaHR0cDovL2FuYWx5c2lzLmJlc3R5aXdhbi5jb20vJztcbiAgICAvLyBjb25zdCBjbGllbnQgPSBnZXRRdWVyeVN0cmluZygnY2xpZW50JykgfHwgJ0dFSCc7XG4gICAgY29uc3QgY2xpZW50ID0gZ2V0UXVlcnlTdHJpbmcoJ2NsaWVudCcpO1xuICAgIC8vIGNvbnN0IGFwaUtleSA9IGdldFF1ZXJ5U3RyaW5nKCdhcGlfa2V5JykgfHwgJ3NtWVM5cTlIdjlvN0lvZWs5NVo3TUZtdWltb09zbmV1QU1FV0d0cTNVcTZKWWlScXlRQmFPUFNkYTN0WjA2Q2FYem5pZTZjZEJiT0k1dGdwdXl2eG85ekVjaHA2c2ZHRDNwS0trVmw5Z2Y2emtLRDZDTnEzV0ZWMkl5VmhBTDhUVkZvTXNKZ3ZLbFRaQW5WWno0aHRlakpma3c0VjU0VVZEeG9URWdqdTNpdnpwbnpkbDZqSGNWajdBQ25CYXRDUFdEWmxGWHA5cmFFb2tPRkZLdEdaS3ZMaGU5YUcyMkYzTWtEVWhiZlIyRHlwWGhlNlphVDloanZiTDZCZURZZidcbiAgICBjb25zdCBhcGlLZXkgPSBnZXRRdWVyeVN0cmluZygnYXBpX2tleScpO1xuICAgIGNvbnN0IHVybCA9IGhvc3QgKyAnYXBpL29wZW4vZW5yb2xsbWVudC9zdGF0aXN0aWNzLz9mb3JtYXQ9anNvbidcbiAgICAgICAgKyAnJmNsaWVudD0nICsgY2xpZW50ICsgJyZhcGlfa2V5PScgKyBhcGlLZXk7XG5cbiAgICBpZiAoIWNsaWVudCB8fCAhYXBpS2V5KSB7XG4gICAgICAgIGFsZXJ0KCdSZXF1ZXN0IEVycm9yOiBNaXNzaW5nIGNsaWVudCBvciBhcGkga2V5JylcbiAgICAgICAgbWFpbkNoYXJ0LmhpZGVMb2FkaW5nKCk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignUmVxdWVzdCBFcnJvcjogTWlzc2luZyBjbGllbnQgb3IgYXBpIGtleScpO1xuICAgIH1cbiAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgbGV0IGN1cnJlbnRNb250aCA9IGRhdGUuZ2V0TW9udGgoKSArIDE7XG4gICAgbGV0IGN1cnJlbnRZZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgIC8vIOivt+axgkFQSeaVsOe7hFxuICAgIGxldCByZXFBcnIgPSBbXTtcbiAgICBmb3IgKGxldCBqID0gKGN1cnJlbnRNb250aCAhPT0gMTIgPyBjdXJyZW50TW9udGggKyAxIDogMTMpOyBqIDwgMTM7IGorKykge1xuICAgICAgICByZXFBcnIucHVzaCgkLmdldCh1cmwgKyBgJm1vbnRoPSR7an0meWVhcj0ke2N1cnJlbnRZZWFyIC0gMX1gKSlcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gY3VycmVudE1vbnRoOyBpKyspIHtcbiAgICAgICAgcmVxQXJyLnB1c2goJC5nZXQodXJsICsgYCZtb250aD0ke2l9JnllYXI9JHtjdXJyZW50WWVhcn1gKSlcbiAgICB9XG4gICAgY29uc29sZS5sb2coJ1JlcXVlc3QgQXJyYXknLCByZXFBcnIpO1xuXG4gICAgbG9hZENoYXJ0KClcblxuXG4gICAgLyoqXG4gICAgICog5Yqg6L295Zu+6KGoXG4gICAgICovXG4gICAgZnVuY3Rpb24gbG9hZENoYXJ0KCkge1xuICAgICAgICAkLndoZW4oLi4ucmVxQXJyKS5kb25lKGZ1bmN0aW9uICguLi5kYXRhKSB7XG5cbiAgICAgICAgICAgICQoJ2gyLnRpdGxlJykuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG4gICAgICAgICAgICBtYWluQ2hhcnQuaGlkZUxvYWRpbmcoKTtcblxuICAgICAgICAgICAgbGV0IGZpbHRlckRhdGEgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGZpbHRlckRhdGEucHVzaChkYXRhW2ldWzBdKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgdG90YWxEYXRhID0gQXJyYXkucHJvdG90eXBlLmNvbmNhdC5hcHBseShbXSwgZmlsdGVyRGF0YSk7XG4gICAgICAgICAgICBsZXQgY2VudHJlRGF0YSA9IGdldENlbnRyZXNJbkRhdGEodG90YWxEYXRhKTtcblxuICAgICAgICAgICAgZ2VuZXJhdGVDZW50cmVMaXN0KGNlbnRyZURhdGEpO1xuICAgICAgICAgICAgZ2VuZXJhdGVEYXRhKCdhbGwnLCB0b3RhbERhdGEpO1xuXG4gICAgICAgICAgICAvLyDlrabmoKHliJfooajngrnlh7vkuovku7ZcbiAgICAgICAgICAgICQoJyNjZW50cmUtbGlzdCcpLmNsaWNrKGZ1bmN0aW9uIChldikge1xuXG4gICAgICAgICAgICAgICAgLy8g54K55Ye75YWo6YCJXG4gICAgICAgICAgICAgICAgaWYgKGV2LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJykgPT09ICdhbGwnKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJyNjZW50cmUtbGlzdCBsaTpub3QoW3ZhbHVlPVwiYWxsXCJdKScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQoJ2xpW3ZhbHVlPVwiYWxsXCJdJykuaGFzQ2xhc3MoJ2NoZWNrZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2NoZWNrZWQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdjaGVja2VkJylcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIOeCueWHu+WtpuagoVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChldi50YXJnZXQudGFnTmFtZSA9PT0gJ0xJJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXYudGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoJ2NoZWNrZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIOWkhOeQhkFsbOaMiemSrueKtuaAgVxuICAgICAgICAgICAgICAgIGlmICgoY2VudHJlRGF0YS5sZW5ndGggLSAyKSA9PT0gJCgnLmNoZWNrZWQ6bm90KFt2YWx1ZT1cImFsbFwiXSknKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnbGlbdmFsdWU9XCJhbGxcIl0nKS5hZGRDbGFzcygnY2hlY2tlZCcpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnbGlbdmFsdWU9XCJhbGxcIl0nKS5yZW1vdmVDbGFzcygnY2hlY2tlZCcpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8g6YCJ5oup55qE5a2m5qChXG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkQ2VudHJlcyA9IFtdO1xuICAgICAgICAgICAgICAgICQoJy5jaGVja2VkJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkQ2VudHJlcy5wdXNoKCgkKHRoaXMpLmF0dHIoJ3ZhbHVlJykpKVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgZ2VuZXJhdGVEYXRhKHNlbGVjdGVkQ2VudHJlcywgdG90YWxEYXRhKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgIGFsZXJ0KCdSZXF1ZXN0IGVycm9yJylcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZURhdGEoY2VudHJlTmFtZXNBcnIsIHRvdGFsRGF0YSkge1xuXG4gICAgICAgIGlmICh0eXBlb2YgY2VudHJlTmFtZXNBcnIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBjZW50cmVOYW1lc0FyciA9IFtjZW50cmVOYW1lc0Fycl1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBmaWx0ZXJEYXRhO1xuICAgICAgICBpZiAoY2VudHJlTmFtZXNBcnIubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBmaWx0ZXJEYXRhID0gW107XG4gICAgICAgIH0gZWxzZSBpZiAoY2VudHJlTmFtZXNBcnJbMF0gPT09ICdhbGwnKSB7XG4gICAgICAgICAgICBmaWx0ZXJEYXRhID0gdG90YWxEYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmlsdGVyRGF0YSA9IGdldERhdGFCeUNlbnRyZUFycmF5KHRvdGFsRGF0YSwgY2VudHJlTmFtZXNBcnIpXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbGVnZW5kRGF0YSA9IGdldExldmVsc0luRGF0YShmaWx0ZXJEYXRhKVxuXG4gICAgICAgIC8vIOavj+S4quW5tOe6p+WvueW6lOeahOaVsOaNruS5i+WSjCDkvos6IFsn5LiA5bm057qnJ++8jDEwXVxuICAgICAgICBsZXQgbGVnZW5kV2l0aFN0dWRlbnRDb3VudCA9IFtdLCBsZWdlbmRXaXRoRW5xdWlyeSA9IFtdLCBsZWdlbmRXaXRoRW5yb2xsZWQgPSBbXSwgbGVnZW5kV2l0aFdpdGhEcmF3biA9IFtdO1xuXG4gICAgICAgIC8vIOmBjeWOhuWQhOS4quW5tOe6p++8jOWvu+aJvmZpbHRlckRhdGHkuK3lr7nlupTnmoTlubTnuqdcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZWdlbmREYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgdG90YWxTdHVkZW50Q291bnQgPSAwO1xuICAgICAgICAgICAgbGV0IHRvdGFsRW5xdWlyeSA9IDA7XG4gICAgICAgICAgICBsZXQgdG90YWxFbnJvbGxlZCA9IDA7XG4gICAgICAgICAgICBsZXQgdG90YWxXaXRoRHJhd24gPSAwO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBmaWx0ZXJEYXRhLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpbHRlckRhdGFbal1bJ0xldmVsJ10gPT09IGxlZ2VuZERhdGFbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdG90YWxTdHVkZW50Q291bnQgKz0gZmlsdGVyRGF0YVtqXVsnU3R1ZGVudCBDb3VudCddO1xuICAgICAgICAgICAgICAgICAgICB0b3RhbEVucXVpcnkgKz0gZmlsdGVyRGF0YVtqXVsnRW5xdWlyeSddO1xuICAgICAgICAgICAgICAgICAgICB0b3RhbEVucm9sbGVkICs9IGZpbHRlckRhdGFbal1bJ0Vucm9sbGVkJ107XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsV2l0aERyYXduICs9IGZpbHRlckRhdGFbal1bJ1dpdGhkcmF3biddO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxlZ2VuZFdpdGhTdHVkZW50Q291bnQucHVzaChbbGVnZW5kRGF0YVtpXSwgdG90YWxTdHVkZW50Q291bnRdKVxuICAgICAgICAgICAgbGVnZW5kV2l0aEVucXVpcnkucHVzaChbbGVnZW5kRGF0YVtpXSwgdG90YWxFbnF1aXJ5XSlcbiAgICAgICAgICAgIGxlZ2VuZFdpdGhFbnJvbGxlZC5wdXNoKFtsZWdlbmREYXRhW2ldLCB0b3RhbEVucm9sbGVkXSlcbiAgICAgICAgICAgIGxlZ2VuZFdpdGhXaXRoRHJhd24ucHVzaChbbGVnZW5kRGF0YVtpXSwgdG90YWxXaXRoRHJhd25dKVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHhBeGlzRGF0YSA9IFtdO1xuICAgICAgICBsZXQgeERhdGEgPSBbXTtcbiAgICAgICAgbGV0IHN0dWRlbnRDb3VudFNlcmllc0RhdGEgPSBbXSwgZW5xdWlyeVNlcmllc0RhdGEgPSBbXSwgZW5yb2xsZWRTZXJpZXNEYXRhID0gW10sIHdpdGhkcmF3blNlcmllc0RhdGEgPSBbXTsvL+WbvuihqDRcbiAgICAgICAgLy8g5a+55bm057qn5b6q546vLOeUn+aIkOafkOS4gOW5tOe6p+eahOaVsOaNrlxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlZ2VuZERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBsZXZlbE5hbWUgPSBsZWdlbmREYXRhW2ldO1xuICAgICAgICAgICAgLy8g5qC55o2ubGV2ZWzlubTnuqfnrZvpgInmlbDmja5cbiAgICAgICAgICAgIGxldCBkYXRhRmlsdGVyQnlMZXZlbCA9IGdldERhdGFCeUxldmVsKGZpbHRlckRhdGEsIGxldmVsTmFtZSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhsZXZlbE5hbWUsIGRhdGFGaWx0ZXJCeUxldmVsKTtcbiAgICAgICAgICAgIGxldCBzdHVkZW50Q291bnRBcnIgPSBbXSwgZW5xdWlyeUFyciA9IFtdLCBlbnJvbGxlZEFyciA9IFtdLCB3aXRoZHJhd25BcnIgPSBbXTsvL+e6v+W9ouWbvueahOaVsOaNrlsxLDIsMy4uLl1cblxuICAgICAgICAgICAgLy8g5q2k5aSE55qEZGF0YUZpbHRlckJ5TGV2ZWzmmK/miYDmnInmlbDmja5cbiAgICAgICAgICAgIGxldCB0ZW1wID0gW107IC8vIOWtmOWCqOWIhue7hOWQjueahOaVsOe7hCzmjInmnIjku73liIbmiJAxMue7hFxuICAgICAgICAgICAgbGV0IHQgPSBkYXRhRmlsdGVyQnlMZXZlbDtcbiAgICAgICAgICAgIGxldCBtb2QgPSAxMjtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbW9kOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0ZW1wLnB1c2godC5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0sIGluZGV4LCBhcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKChpbmRleCAtIGkpICUgbW9kID09PSAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0ZW1wLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0dWRlbnRDb3VudFRvdGFsUGVyTW9udGggPSAwLCBlbnF1aXJ5VG90YWxQZXJNb250aCA9IDAsXG4gICAgICAgICAgICAgICAgICAgIGVucm9sbGVkVG90YWxQZXJNb250aCA9IDAsIHdpdGhkcmF3blRvdGFsUGVyTW9udGggPSAwO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGVtcFtpXS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBzdHVkZW50Q291bnRUb3RhbFBlck1vbnRoICs9IHRlbXBbaV1bal1bJ1N0dWRlbnQgQ291bnQnXTtcbiAgICAgICAgICAgICAgICAgICAgZW5xdWlyeVRvdGFsUGVyTW9udGggKz0gdGVtcFtpXVtqXVsnRW5xdWlyeSddO1xuICAgICAgICAgICAgICAgICAgICBlbnJvbGxlZFRvdGFsUGVyTW9udGggKz0gdGVtcFtpXVtqXVsnRW5yb2xsZWQnXTtcbiAgICAgICAgICAgICAgICAgICAgd2l0aGRyYXduVG90YWxQZXJNb250aCArPSB0ZW1wW2ldW2pdWydXaXRoZHJhd24nXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdHVkZW50Q291bnRBcnIucHVzaChzdHVkZW50Q291bnRUb3RhbFBlck1vbnRoKTtcbiAgICAgICAgICAgICAgICBlbnF1aXJ5QXJyLnB1c2goZW5xdWlyeVRvdGFsUGVyTW9udGgpO1xuICAgICAgICAgICAgICAgIGVucm9sbGVkQXJyLnB1c2goZW5yb2xsZWRUb3RhbFBlck1vbnRoKTtcbiAgICAgICAgICAgICAgICB3aXRoZHJhd25BcnIucHVzaCh3aXRoZHJhd25Ub3RhbFBlck1vbnRoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g55Sf5oiQWOi9tFxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBkYXRhRmlsdGVyQnlMZXZlbC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIHhEYXRhLnB1c2goZGF0YUZpbHRlckJ5TGV2ZWxbal1bJ1llYXInXSArICctJyArIGRhdGFGaWx0ZXJCeUxldmVsW2pdWydNb250aCddKTtcbiAgICAgICAgICAgICAgICB4QXhpc0RhdGEgPSBBcnJheS5mcm9tKG5ldyBTZXQoeERhdGEpKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDorr7nva7lkITkuKrlubTnuqfnmoTnur/lvaLlm74s5Lmf5bCx5piv5Zyo5LiA5byg5Zu+6KGo5Lit55Sf5oiQ5LiA5p2h57q/XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc3R1ZGVudENvdW50QXJyJywgc3R1ZGVudENvdW50QXJyKVxuICAgICAgICAgICAgc3R1ZGVudENvdW50U2VyaWVzRGF0YS5wdXNoKGdldExpbmVPYmooc3R1ZGVudENvdW50QXJyLCBsZXZlbE5hbWUpKTtcbiAgICAgICAgICAgIGVucXVpcnlTZXJpZXNEYXRhLnB1c2goZ2V0TGluZU9iaihlbnF1aXJ5QXJyLCBsZXZlbE5hbWUpKTtcbiAgICAgICAgICAgIGVucm9sbGVkU2VyaWVzRGF0YS5wdXNoKGdldExpbmVPYmooZW5yb2xsZWRBcnIsIGxldmVsTmFtZSkpO1xuICAgICAgICAgICAgd2l0aGRyYXduU2VyaWVzRGF0YS5wdXNoKGdldExpbmVPYmood2l0aGRyYXduQXJyLCBsZXZlbE5hbWUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOiuvue9rumlvOWbvlxuICAgICAgICBzdHVkZW50Q291bnRTZXJpZXNEYXRhLnB1c2goZ2V0UGllT2JqKGxlZ2VuZFdpdGhTdHVkZW50Q291bnQpKTtcbiAgICAgICAgZW5xdWlyeVNlcmllc0RhdGEucHVzaChnZXRQaWVPYmoobGVnZW5kV2l0aEVucXVpcnkpKTtcbiAgICAgICAgZW5yb2xsZWRTZXJpZXNEYXRhLnB1c2goZ2V0UGllT2JqKGxlZ2VuZFdpdGhFbnJvbGxlZCkpO1xuICAgICAgICB3aXRoZHJhd25TZXJpZXNEYXRhLnB1c2goZ2V0UGllT2JqKGxlZ2VuZFdpdGhXaXRoRHJhd24pKTtcblxuICAgICAgICB2YXIgc2VsQWxsT2JqID0ge1xuICAgICAgICAgICAgbmFtZTogc2VsZWN0QWxsLFxuICAgICAgICAgICAgdHlwZTogJ2xpbmUnXG4gICAgICAgIH07XG4gICAgICAgIHN0dWRlbnRDb3VudFNlcmllc0RhdGEucHVzaChzZWxBbGxPYmopO1xuICAgICAgICBlbnF1aXJ5U2VyaWVzRGF0YS5wdXNoKHNlbEFsbE9iaik7XG4gICAgICAgIGVucm9sbGVkU2VyaWVzRGF0YS5wdXNoKHNlbEFsbE9iaik7XG4gICAgICAgIHdpdGhkcmF3blNlcmllc0RhdGEucHVzaChzZWxBbGxPYmopO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKHN0dWRlbnRDb3VudFNlcmllc0RhdGEpXG5cbiAgICAgICAgLy8g5aGr5YWl5pWw5o2uXG4gICAgICAgIGlmIChmaWx0ZXJEYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgbWFpbkNoYXJ0LnNldE9wdGlvbihnZXRPcHRpb24obGVnZW5kRGF0YSwgeEF4aXNEYXRhLCBbXSkpO1xuICAgICAgICAgICAgZW5xdWlyeUNoYXJ0LnNldE9wdGlvbihnZXRPcHRpb24obGVnZW5kRGF0YSwgeEF4aXNEYXRhLCBbXSkpO1xuICAgICAgICAgICAgZW5yb2xsZWRDaGFydC5zZXRPcHRpb24oZ2V0T3B0aW9uKGxlZ2VuZERhdGEsIHhBeGlzRGF0YSwgW10pKTtcbiAgICAgICAgICAgIHdpdGhkcmF3bkNoYXJ0LnNldE9wdGlvbihnZXRPcHRpb24obGVnZW5kRGF0YSwgeEF4aXNEYXRhLCBbXSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWFpbkNoYXJ0LnNldE9wdGlvbihnZXRPcHRpb24obGVnZW5kRGF0YSwgeEF4aXNEYXRhLCBzdHVkZW50Q291bnRTZXJpZXNEYXRhKSk7XG4gICAgICAgICAgICBlbnF1aXJ5Q2hhcnQuc2V0T3B0aW9uKGdldE9wdGlvbihsZWdlbmREYXRhLCB4QXhpc0RhdGEsIGVucXVpcnlTZXJpZXNEYXRhKSk7XG4gICAgICAgICAgICBlbnJvbGxlZENoYXJ0LnNldE9wdGlvbihnZXRPcHRpb24obGVnZW5kRGF0YSwgeEF4aXNEYXRhLCBlbnJvbGxlZFNlcmllc0RhdGEpKTtcbiAgICAgICAgICAgIHdpdGhkcmF3bkNoYXJ0LnNldE9wdGlvbihnZXRPcHRpb24obGVnZW5kRGF0YSwgeEF4aXNEYXRhLCB3aXRoZHJhd25TZXJpZXNEYXRhKSk7XG5cbiAgICAgICAgICAgIGhhbmRsZVNlbGVjdEFsbChtYWluQ2hhcnQsIGdldE9wdGlvbihsZWdlbmREYXRhLCB4QXhpc0RhdGEsIHN0dWRlbnRDb3VudFNlcmllc0RhdGEpKVxuICAgICAgICAgICAgaGFuZGxlU2VsZWN0QWxsKGVucXVpcnlDaGFydCwgZ2V0T3B0aW9uKGxlZ2VuZERhdGEsIHhBeGlzRGF0YSwgZW5xdWlyeVNlcmllc0RhdGEpKVxuICAgICAgICAgICAgaGFuZGxlU2VsZWN0QWxsKGVucm9sbGVkQ2hhcnQsIGdldE9wdGlvbihsZWdlbmREYXRhLCB4QXhpc0RhdGEsIGVucm9sbGVkU2VyaWVzRGF0YSkpXG4gICAgICAgICAgICBoYW5kbGVTZWxlY3RBbGwod2l0aGRyYXduQ2hhcnQsIGdldE9wdGlvbihsZWdlbmREYXRhLCB4QXhpc0RhdGEsIHdpdGhkcmF3blNlcmllc0RhdGEpKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2hhcnRcbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGhhbmRsZVNlbGVjdEFsbChjaGFydCwgb3B0aW9ucykge1xuICAgICAgICBjaGFydC5vZmYoJ2xlZ2VuZHNlbGVjdGNoYW5nZWQnKTtcbiAgICAgICAgY2hhcnQub24oJ2xlZ2VuZHNlbGVjdGNoYW5nZWQnLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICAgICAvL2xlZ2VuZOOAgOWFqOmAieaTjeS9nFxuICAgICAgICAgICAgaWYgKHBhcmFtcy5uYW1lID09PSBzZWxlY3RBbGwpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RGbGFnID0gIXNlbGVjdEZsYWc7IC8vdG9nZ2xlXG4gICAgICAgICAgICAgICAgLy/orr7nva7lhajpgIlcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleCBpbiBwYXJhbXMuc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZHluYW1pY1NlbGVjdGVkW2luZGV4XSA9IHNlbGVjdEZsYWc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8v6YeN57uYXG4gICAgICAgICAgICAgICAgY2hhcnQuc2V0T3B0aW9uKG9wdGlvbnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHJldHVybnMge3t0eXBlOiBzdHJpbmcsIHJhZGl1czogW251bWJlcixzdHJpbmddLCBjZW50ZXI6IFtzdHJpbmcsc3RyaW5nXSwgZGF0YTogQXJyYXl9fVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFBpZU9iaihkYXRhKSB7XG4gICAgICAgIGxldCBwaWVEYXRhID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcGllRGF0YS5wdXNoKHt2YWx1ZTogZGF0YVtpXVsxXSwgbmFtZTogZGF0YVtpXVswXX0pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdwaWUnLFxuICAgICAgICAgICAgcmFkaXVzOiBbMCwgJzIwJSddLFxuICAgICAgICAgICAgY2VudGVyOiBbJzE4JScsICc1MCUnXSxcbiAgICAgICAgICAgIGRhdGE6IHBpZURhdGFcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGFyclxuICAgICAqIEBwYXJhbSBuYW1lXG4gICAgICogQHJldHVybnMge3tuYW1lOiAqLCB0eXBlOiBzdHJpbmcsIHg6IHN0cmluZywgZGF0YTogKn19XG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0TGluZU9iaihhcnIsIG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICB0eXBlOiAnbGluZScsXG4gICAgICAgICAgICB4OiAnMzUlJyxcbiAgICAgICAgICAgIGRhdGE6IGFycixcbiAgICAgICAgICAgIC8vIG1hcmtMaW5lOiB7XG4gICAgICAgICAgICAvLyAgICAgLy8gc2lsZW50OiB0cnVlLFxuICAgICAgICAgICAgLy8gICAgIGRhdGE6IFt7XG4gICAgICAgICAgICAvLyAgICAgICAgIG5hbWU6ICdhdmVyYWdlJyxcbiAgICAgICAgICAgIC8vICAgICAgICAgLy8g5pSv5oyBICdhdmVyYWdlJywgJ21pbicsICdtYXgnXG4gICAgICAgICAgICAvLyAgICAgICAgIHR5cGU6ICdhdmVyYWdlJ1xuICAgICAgICAgICAgLy8gICAgIH1dXG4gICAgICAgICAgICAvLyB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBsZWdlbmREYXRhXG4gICAgICogQHBhcmFtIHhBeGlzRGF0YVxuICAgICAqIEBwYXJhbSBzZXJpZXNEYXRhXG4gICAgICogQHJldHVybnMge3tsZWdlbmQ6IHtyaWdodDogc3RyaW5nLCBkYXRhLCBzZWxlY3RlZDoge319LCB4QXhpczoge3R5cGU6IHN0cmluZywgYm91bmRhcnlHYXA6IGJvb2xlYW4sIGRhdGE6ICp9LCBzZXJpZXM6ICp9fVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldE9wdGlvbihsZWdlbmREYXRhLCB4QXhpc0RhdGEsIHNlcmllc0RhdGEpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxlZ2VuZDoge1xuICAgICAgICAgICAgICAgIHJpZ2h0OiAnMTAlJyxcbiAgICAgICAgICAgICAgICAvLyBkYXRhOiBsZWdlbmREYXRhLmNvbmNhdChzZWxlY3RBbGwpLFxuICAgICAgICAgICAgICAgIGRhdGE6IFtzZWxlY3RBbGxdLmNvbmNhdChsZWdlbmREYXRhKSxcbiAgICAgICAgICAgICAgICBzZWxlY3RlZDogZHluYW1pY1NlbGVjdGVkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeEF4aXM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnY2F0ZWdvcnknLFxuICAgICAgICAgICAgICAgIGJvdW5kYXJ5R2FwOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBkYXRhOiB4QXhpc0RhdGFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXJpZXM6IHNlcmllc0RhdGFcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcGFyYW0gY2VudHJlTmFtZUFyclxuICAgICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXREYXRhQnlDZW50cmVBcnJheShkYXRhLCBjZW50cmVOYW1lQXJyKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjZW50cmVOYW1lQXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGRhdGEubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YVtqXVsnQ2VudHJlJ10gPT09IGNlbnRyZU5hbWVBcnJbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goZGF0YVtqXSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHJldHVybnMge0FycmF5fVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldExldmVsc0luRGF0YShkYXRhKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocmVzdWx0LmluZGV4T2YoZGF0YVtpXVsnTGV2ZWwnXSkgPCAwKVxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGRhdGFbaV1bJ0xldmVsJ10pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHJldHVybnMge0FycmF5fVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldENlbnRyZXNJbkRhdGEoZGF0YSkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5pbmRleE9mKGRhdGFbaV1bJ0NlbnRyZSddKSA8IDApXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goZGF0YVtpXVsnQ2VudHJlJ10pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBhcnJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZVNjaG9vbFNlbGVjdChhcnIpIHtcbiAgICAgICAgbGV0IHN0cmluZyA9IFwiPG9wdGlvbiB2YWx1ZT0nYWxsJz5BbGw8L29wdGlvbj5cIjtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHN0cmluZyArPSBcIjxvcHRpb24gdmFsdWU9XFxcIlwiICsgYXJyW2ldICsgXCJcXFwiPlwiICsgYXJyW2ldICsgXCI8L29wdGlvbj5cIjtcbiAgICAgICAgfVxuXG4gICAgICAgICQoXCIjc2Nob29sLWxpc3RcIikuaHRtbChzdHJpbmcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGFyclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdlbmVyYXRlQ2VudHJlTGlzdChhcnIpIHtcbiAgICAgICAgbGV0IHN0cmluZyA9IFwiPGxpIGNsYXNzPSdjaGVja2VkJyB2YWx1ZT0nYWxsJz5BbGw8L2xpPlwiO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGFycltpXSA9PT0gJ0VkdUdhcmRlbiBEaXNjb3ZlcnknIHx8IGFycltpXSA9PT0gJ0pveSBUYWxlbnQgQ2hpbGRjYXJlIENlbnRyZSBQdGUgTHRkJyljb250aW51ZTtcbiAgICAgICAgICAgIHN0cmluZyArPSBcIjxsaSBjbGFzcz0nY2hlY2tlZCcgdmFsdWU9XFxcIlwiICsgYXJyW2ldICsgXCJcXFwiPlwiICsgYXJyW2ldICsgXCI8L2xpPlwiO1xuICAgICAgICB9XG4gICAgICAgICQoXCIjY2VudHJlLWxpc3RcIikuaHRtbChzdHJpbmcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGZpbHRlckRhdGFcbiAgICAgKiBAcGFyYW0gbGV2ZWxcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXREYXRhQnlMZXZlbChmaWx0ZXJEYXRhLCBsZXZlbCkge1xuICAgICAgICByZXR1cm4gZmlsdGVyRGF0YS5maWx0ZXIoZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbFsnTGV2ZWwnXSA9PT0gbGV2ZWw7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIG5hbWVcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFF1ZXJ5U3RyaW5nKG5hbWUpIHtcbiAgICAgICAgbGV0IHJlZyA9IG5ldyBSZWdFeHAoXCIoXnwmKVwiICsgbmFtZSArIFwiPShbXiZdKikoJnwkKVwiKTtcbiAgICAgICAgbGV0IHIgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnN1YnN0cigxKS5tYXRjaChyZWcpO1xuICAgICAgICBpZiAocilyZXR1cm4gdW5lc2NhcGUoclsyXSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldENvb2tpZShuYW1lKSB7XG4gICAgICAgIHZhciBjb29raWVOYW1lID0gZW5jb2RlVVJJQ29tcG9uZW50KG5hbWUpICsgJz0nLFxuICAgICAgICAgICAgY29va2llU3RhcnQgPSBkb2N1bWVudC5jb29raWUuaW5kZXhPZihjb29raWVOYW1lKSxcbiAgICAgICAgICAgIGNvb2tpZVZhbHVlID0gbnVsbDtcbiAgICAgICAgaWYgKGNvb2tpZVN0YXJ0ID4gLTEpIHtcbiAgICAgICAgICAgIHZhciBjb29raWVFbmQgPSBkb2N1bWVudC5jb29raWUuaW5kZXhPZignOycsIGNvb2tpZVN0YXJ0KTtcbiAgICAgICAgICAgIGlmIChjb29raWVFbmQgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBjb29raWVFbmQgPSBkb2N1bWVudC5jb29raWUubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29va2llVmFsdWUgPSBkZWNvZGVVUklDb21wb25lbnQoZG9jdW1lbnQuY29va2llLnN1YnN0cmluZyhjb29raWVTdGFydCArIGNvb2tpZU5hbWUubGVuZ3RoLCBjb29raWVFbmQpKTtcblxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb29raWVWYWx1ZTtcbiAgICB9XG5cbn1cbigpOyJdfQ==
