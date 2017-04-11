(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/**
 * main.js
 *
 * Created by ice on 2017/4/6 上午11:13.
 */

!function () {
    var _$;

    var mainChart = echarts.init(document.getElementById('main'));
    var enquiryChart = echarts.init(document.getElementById('enquiry'));
    var enrolledChart = echarts.init(document.getElementById('enrolled'));
    var withdrawnChart = echarts.init(document.getElementById('withdrawn'));

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
    var client = getQueryString('client') || 'GEH';
    var apiKey = getQueryString('api_key') || 'smYS9q9Hv9o7Ioek95Z7MFmuimoOsneuAMEWGtq3Uq6JYiRqyQBaOPSda3tZ06CaXznie6cdBbOI5tgpuyvxo9zEchp6sfGD3pKKkVl9gf6zkKD6CNq3WFV2IyVhAL8TVFoMsJgvKlTZAnVZz4htejJfkw4V54UVDxoTEgju3ivzpnzdl6jHcVj7ACnBatCPWDZlFXp9raEokOFFKtGZKvLhe9aG22F3MkDUhbfR2DypXhe6ZaT9hjvbL6BeDYf';
    var url = host + 'api/open/enrollment/statistics/?format=json' + '&client=' + client + '&api_key=' + apiKey;
    var date = new Date();
    var currentMonth = date.getMonth() + 1;
    var currentYear = date.getFullYear();
    var startTime = +date;
    var reqArr = [];
    var reqUrls = [];

    for (var j = currentMonth !== 12 ? currentMonth + 1 : 13; j < 13; j++) {
        reqArr.push($.get(url + ('&month=' + j + '&year=' + (currentYear - 1))));
        reqUrls.push(url + ('&month=' + j + '&year=' + (currentYear - 1)));
    }
    for (var i = 1; i <= currentMonth; i++) {
        reqArr.push($.get(url + ('&month=' + i + '&year=' + currentYear)));
        reqUrls.push(url + ('&month=' + i + '&year=' + currentYear));
    }
    console.log('Request Array', reqArr);

    (_$ = $).when.apply(_$, reqArr).done(function () {
        mainChart.hideLoading();
        var filterData = [];

        for (var _len = arguments.length, data = Array(_len), _key = 0; _key < _len; _key++) {
            data[_key] = arguments[_key];
        }

        for (var _i = 0; _i < data.length; _i++) {
            filterData.push(data[_i][0]);
        }
        var totalData = Array.prototype.concat.apply([], filterData);
        console.log('totalData', totalData);

        console.log('requestTime', +new Date() - startTime);

        var centreData = void 0;
        centreData = getCentresInData(totalData);
        console.log('schoolList', centreData);
        // generateSchoolSelect(centreData);
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
            if (centreData.length === $('.checked:not([value="all"])').length) {
                $('li[value="all"]').addClass('checked');
            } else {
                $('li[value="all"]').removeClass('checked');
            }

            // 选择的学校
            var selectedCentres = [];
            $('.checked').each(function () {
                selectedCentres.push($(this).attr('value'));
            });

            console.log('selectedCentres', selectedCentres);

            generateData(selectedCentres, totalData);
        });
    }).catch(function (error) {
        console.log(error);
        alert('Request error');
    });

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

        console.log('filterData', filterData);
        console.log('filterData length', filterData.length);
        console.log('centreNamesArr length', centreNamesArr.length);

        var legendData = getLevelsInData(filterData);
        console.log('centreName：', centreNamesArr);
        console.log('level：', legendData);

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
            levelName = legendData[_i3];
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
            var levelName;

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
}();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7O0FBTUEsQ0FBQyxZQUFZO0FBQUE7O0FBRVQsUUFBSSxZQUFZLFFBQVEsSUFBUixDQUFhLFNBQVMsY0FBVCxDQUF3QixNQUF4QixDQUFiLENBQWhCO0FBQ0EsUUFBSSxlQUFlLFFBQVEsSUFBUixDQUFhLFNBQVMsY0FBVCxDQUF3QixTQUF4QixDQUFiLENBQW5CO0FBQ0EsUUFBSSxnQkFBZ0IsUUFBUSxJQUFSLENBQWEsU0FBUyxjQUFULENBQXdCLFVBQXhCLENBQWIsQ0FBcEI7QUFDQSxRQUFJLGlCQUFpQixRQUFRLElBQVIsQ0FBYSxTQUFTLGNBQVQsQ0FBd0IsV0FBeEIsQ0FBYixDQUFyQjs7QUFFQSxRQUFNLGNBQWM7QUFDaEIsZUFBTztBQUNILGtCQUFNO0FBREgsU0FEUztBQUloQixpQkFBUztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBSkssU0FKTztBQVVoQixjQUFNO0FBQ0Ysa0JBQU0sS0FESjtBQUVGLG1CQUFPLElBRkw7QUFHRjtBQUNBLDBCQUFjO0FBSlosU0FWVTtBQWdCaEIsZUFBTztBQUNILGtCQUFNO0FBREgsU0FoQlM7QUFtQmhCLGVBQU87QUFDSCxrQkFBTTtBQURILFNBbkJTO0FBc0JoQixpQkFBUztBQUNMLHFCQUFTO0FBQ0wsNkJBQWE7QUFDVCwyQkFBTztBQURFLGlCQURSO0FBSUwsMkJBQVc7QUFDUCwyQkFBTztBQUNILDhCQUFNLE1BREgsRUFDVyxLQUFLO0FBRGhCLHFCQURBO0FBSVAsMEJBQU0sQ0FBQyxNQUFELEVBQVMsS0FBVDtBQUpDO0FBSk47QUFESjtBQXRCTyxLQUFwQjs7QUFxQ0EsY0FBVSxTQUFWLENBQW9CLFdBQXBCO0FBQ0EsaUJBQWEsU0FBYixDQUF1QixXQUF2QjtBQUNBLGtCQUFjLFNBQWQsQ0FBd0IsV0FBeEI7QUFDQSxtQkFBZSxTQUFmLENBQXlC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QUosQ0FBckIsR0FBOEIsS0FBOUIsR0FBc0MsSUFBSSxJQUFKLENBQXRDLEdBQStDLFdBQXpEO0FBQ0g7O0FBRUQsVUFBRSxjQUFGLEVBQWtCLElBQWxCLENBQXVCLE1BQXZCO0FBQ0g7O0FBRUQ7Ozs7QUFJQSxhQUFTLGtCQUFULENBQTRCLEdBQTVCLEVBQWlDO0FBQzdCLFlBQUksU0FBUywwQ0FBYjtBQUNBLGFBQUssSUFBSSxPQUFJLENBQWIsRUFBZ0IsT0FBSSxJQUFJLE1BQXhCLEVBQWdDLE1BQWhDLEVBQXFDO0FBQ2pDLHNCQUFVLGlDQUFpQyxJQUFJLElBQUosQ0FBakMsR0FBMEMsS0FBMUMsR0FBa0QsSUFBSSxJQUFKLENBQWxELEdBQTJELE9BQXJFO0FBQ0g7QUFDRCxVQUFFLGNBQUYsRUFBa0IsSUFBbEIsQ0FBdUIsTUFBdkI7QUFDSDs7QUFFRDs7Ozs7QUFLQSxhQUFTLGNBQVQsQ0FBd0IsVUFBeEIsRUFBb0MsS0FBcEMsRUFBMkM7QUFDdkMsZUFBTyxXQUFXLE1BQVgsQ0FBa0IsVUFBVSxHQUFWLEVBQWU7QUFDcEMsbUJBQU8sSUFBSSxPQUFKLE1BQWlCLEtBQXhCO0FBQ0gsU0FGTSxDQUFQO0FBR0g7O0FBRUQ7Ozs7O0FBS0EsYUFBUyxjQUFULENBQXdCLElBQXhCLEVBQThCO0FBQzFCLFlBQUksTUFBTSxJQUFJLE1BQUosQ0FBVyxVQUFVLElBQVYsR0FBaUIsZUFBNUIsQ0FBVjtBQUNBLFlBQUksSUFBSSxPQUFPLFFBQVAsQ0FBZ0IsTUFBaEIsQ0FBdUIsTUFBdkIsQ0FBOEIsQ0FBOUIsRUFBaUMsS0FBakMsQ0FBdUMsR0FBdkMsQ0FBUjtBQUNBLFlBQUksQ0FBSixFQUFNLE9BQU8sU0FBUyxFQUFFLENBQUYsQ0FBVCxDQUFQO0FBQ04sZUFBTyxJQUFQO0FBQ0g7QUFFSixDQXBjQSxFQUFEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogbWFpbi5qc1xuICpcbiAqIENyZWF0ZWQgYnkgaWNlIG9uIDIwMTcvNC82IOS4iuWNiDExOjEzLlxuICovXG5cbiFmdW5jdGlvbiAoKSB7XG5cbiAgICBsZXQgbWFpbkNoYXJ0ID0gZWNoYXJ0cy5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluJykpO1xuICAgIGxldCBlbnF1aXJ5Q2hhcnQgPSBlY2hhcnRzLmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VucXVpcnknKSk7XG4gICAgbGV0IGVucm9sbGVkQ2hhcnQgPSBlY2hhcnRzLmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vucm9sbGVkJykpO1xuICAgIGxldCB3aXRoZHJhd25DaGFydCA9IGVjaGFydHMuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2l0aGRyYXduJykpO1xuXG4gICAgY29uc3QgYmFzZU9wdGlvbnMgPSB7XG4gICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICB0ZXh0OiAnJ1xuICAgICAgICB9LFxuICAgICAgICB0b29sdGlwOiB7XG4gICAgICAgICAgICAvLyB0cmlnZ2VyOiAnYXhpcycsXG4gICAgICAgICAgICAvLyBheGlzUG9pbnRlcjoge1xuICAgICAgICAgICAgLy8gICAgIHR5cGU6ICdjcm9zcydcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgfSxcbiAgICAgICAgZ3JpZDoge1xuICAgICAgICAgICAgbGVmdDogJzM1JScsXG4gICAgICAgICAgICByaWdodDogJzUlJyxcbiAgICAgICAgICAgIC8vIGJvdHRvbTogJzElJyxcbiAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICB4QXhpczoge1xuICAgICAgICAgICAgZGF0YTogW11cbiAgICAgICAgfSxcbiAgICAgICAgeUF4aXM6IHtcbiAgICAgICAgICAgIHR5cGU6ICd2YWx1ZSdcbiAgICAgICAgfSxcbiAgICAgICAgdG9vbGJveDoge1xuICAgICAgICAgICAgZmVhdHVyZToge1xuICAgICAgICAgICAgICAgIHNhdmVBc0ltYWdlOiB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnc2F2ZSBhcyBpbWFnZSdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG1hZ2ljVHlwZToge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZTogJ2xpbmUnLCBiYXI6ICdiYXInXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFsnbGluZScsICdiYXInXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBtYWluQ2hhcnQuc2V0T3B0aW9uKGJhc2VPcHRpb25zKTtcbiAgICBlbnF1aXJ5Q2hhcnQuc2V0T3B0aW9uKGJhc2VPcHRpb25zKTtcbiAgICBlbnJvbGxlZENoYXJ0LnNldE9wdGlvbihiYXNlT3B0aW9ucyk7XG4gICAgd2l0aGRyYXduQ2hhcnQuc2V0T3B0aW9uKGJhc2VPcHRpb25zKTtcbiAgICBtYWluQ2hhcnQuc2hvd0xvYWRpbmcoKTtcblxuICAgIC8vIOWFqOmAieWPmOmHj1xuICAgIGNvbnN0IHNlbGVjdEFsbCA9ICdTZWxlY3QgQWxsJztcbiAgICBsZXQgc2VsZWN0RmxhZyA9IHRydWU7XG4gICAgbGV0IGR5bmFtaWNTZWxlY3RlZCA9IHt9O1xuICAgIC8vIOivt+axguWPmOmHj1xuICAgIGNvbnN0IGhvc3QgPSAnaHR0cDovL2FuYWx5c2lzLmJlc3R5aXdhbi5jb20vJztcbiAgICBjb25zdCBjbGllbnQgPSBnZXRRdWVyeVN0cmluZygnY2xpZW50JykgfHwgJ0dFSCc7XG4gICAgY29uc3QgYXBpS2V5ID0gZ2V0UXVlcnlTdHJpbmcoJ2FwaV9rZXknKSB8fCAnc21ZUzlxOUh2OW83SW9lazk1WjdNRm11aW1vT3NuZXVBTUVXR3RxM1VxNkpZaVJxeVFCYU9QU2RhM3RaMDZDYVh6bmllNmNkQmJPSTV0Z3B1eXZ4bzl6RWNocDZzZkdEM3BLS2tWbDlnZjZ6a0tENkNOcTNXRlYySXlWaEFMOFRWRm9Nc0pndktsVFpBblZaejRodGVqSmZrdzRWNTRVVkR4b1RFZ2p1M2l2enBuemRsNmpIY1ZqN0FDbkJhdENQV0RabEZYcDlyYUVva09GRkt0R1pLdkxoZTlhRzIyRjNNa0RVaGJmUjJEeXBYaGU2WmFUOWhqdmJMNkJlRFlmJ1xuICAgIGNvbnN0IHVybCA9IGhvc3QgKyAnYXBpL29wZW4vZW5yb2xsbWVudC9zdGF0aXN0aWNzLz9mb3JtYXQ9anNvbidcbiAgICAgICAgKyAnJmNsaWVudD0nICsgY2xpZW50ICsgJyZhcGlfa2V5PScgKyBhcGlLZXk7XG4gICAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIGxldCBjdXJyZW50TW9udGggPSBkYXRlLmdldE1vbnRoKCkgKyAxO1xuICAgIGxldCBjdXJyZW50WWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICBsZXQgc3RhcnRUaW1lID0gK2RhdGU7XG4gICAgbGV0IHJlcUFyciA9IFtdO1xuICAgIGxldCByZXFVcmxzID0gW107XG5cbiAgICBmb3IgKGxldCBqID0gKGN1cnJlbnRNb250aCAhPT0gMTIgPyBjdXJyZW50TW9udGggKyAxIDogMTMpOyBqIDwgMTM7IGorKykge1xuICAgICAgICByZXFBcnIucHVzaCgkLmdldCh1cmwgKyBgJm1vbnRoPSR7an0meWVhcj0ke2N1cnJlbnRZZWFyIC0gMX1gKSlcbiAgICAgICAgcmVxVXJscy5wdXNoKHVybCArIGAmbW9udGg9JHtqfSZ5ZWFyPSR7Y3VycmVudFllYXIgLSAxfWApXG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IGN1cnJlbnRNb250aDsgaSsrKSB7XG4gICAgICAgIHJlcUFyci5wdXNoKCQuZ2V0KHVybCArIGAmbW9udGg9JHtpfSZ5ZWFyPSR7Y3VycmVudFllYXJ9YCkpXG4gICAgICAgIHJlcVVybHMucHVzaCh1cmwgKyBgJm1vbnRoPSR7aX0meWVhcj0ke2N1cnJlbnRZZWFyfWApXG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCdSZXF1ZXN0IEFycmF5JywgcmVxQXJyKTtcblxuICAgICQud2hlbiguLi5yZXFBcnIpLmRvbmUoZnVuY3Rpb24gKC4uLmRhdGEpIHtcbiAgICAgICAgbWFpbkNoYXJ0LmhpZGVMb2FkaW5nKClcbiAgICAgICAgbGV0IGZpbHRlckRhdGEgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBmaWx0ZXJEYXRhLnB1c2goZGF0YVtpXVswXSlcbiAgICAgICAgfVxuICAgICAgICBsZXQgdG90YWxEYXRhID0gQXJyYXkucHJvdG90eXBlLmNvbmNhdC5hcHBseShbXSwgZmlsdGVyRGF0YSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCd0b3RhbERhdGEnLCB0b3RhbERhdGEpXG5cbiAgICAgICAgY29uc29sZS5sb2coJ3JlcXVlc3RUaW1lJywgK25ldyBEYXRlKCkgLSBzdGFydFRpbWUpXG5cbiAgICAgICAgbGV0IGNlbnRyZURhdGE7XG4gICAgICAgIGNlbnRyZURhdGEgPSBnZXRDZW50cmVzSW5EYXRhKHRvdGFsRGF0YSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzY2hvb2xMaXN0JywgY2VudHJlRGF0YSk7XG4gICAgICAgIC8vIGdlbmVyYXRlU2Nob29sU2VsZWN0KGNlbnRyZURhdGEpO1xuICAgICAgICBnZW5lcmF0ZUNlbnRyZUxpc3QoY2VudHJlRGF0YSk7XG4gICAgICAgIGdlbmVyYXRlRGF0YSgnYWxsJywgdG90YWxEYXRhKTtcblxuICAgICAgICAvLyDlrabmoKHliJfooajngrnlh7vkuovku7ZcbiAgICAgICAgJCgnI2NlbnRyZS1saXN0JykuY2xpY2soZnVuY3Rpb24gKGV2KSB7XG5cbiAgICAgICAgICAgIC8vIOeCueWHu+WFqOmAiVxuICAgICAgICAgICAgaWYgKGV2LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJykgPT09ICdhbGwnKSB7XG4gICAgICAgICAgICAgICAgJCgnI2NlbnRyZS1saXN0IGxpOm5vdChbdmFsdWU9XCJhbGxcIl0pJykuZWFjaChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCQoJ2xpW3ZhbHVlPVwiYWxsXCJdJykuaGFzQ2xhc3MoJ2NoZWNrZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnY2hlY2tlZCcpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdjaGVja2VkJylcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8g54K55Ye75a2m5qChXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChldi50YXJnZXQudGFnTmFtZSA9PT0gJ0xJJykge1xuICAgICAgICAgICAgICAgICAgICBldi50YXJnZXQuY2xhc3NMaXN0LnRvZ2dsZSgnY2hlY2tlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5aSE55CGQWxs5oyJ6ZKu54q25oCBXG4gICAgICAgICAgICBpZiAoY2VudHJlRGF0YS5sZW5ndGggPT09ICQoJy5jaGVja2VkOm5vdChbdmFsdWU9XCJhbGxcIl0pJykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgJCgnbGlbdmFsdWU9XCJhbGxcIl0nKS5hZGRDbGFzcygnY2hlY2tlZCcpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJ2xpW3ZhbHVlPVwiYWxsXCJdJykucmVtb3ZlQ2xhc3MoJ2NoZWNrZWQnKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDpgInmi6nnmoTlrabmoKFcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZENlbnRyZXMgPSBbXTtcbiAgICAgICAgICAgICQoJy5jaGVja2VkJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRDZW50cmVzLnB1c2goKCQodGhpcykuYXR0cigndmFsdWUnKSkpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3NlbGVjdGVkQ2VudHJlcycsIHNlbGVjdGVkQ2VudHJlcylcblxuICAgICAgICAgICAgZ2VuZXJhdGVEYXRhKHNlbGVjdGVkQ2VudHJlcywgdG90YWxEYXRhKVxuICAgICAgICB9KVxuXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgYWxlcnQoJ1JlcXVlc3QgZXJyb3InKVxuICAgIH0pO1xuXG5cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZURhdGEoY2VudHJlTmFtZXNBcnIsIHRvdGFsRGF0YSkge1xuXG4gICAgICAgIGlmICh0eXBlb2YgY2VudHJlTmFtZXNBcnIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBjZW50cmVOYW1lc0FyciA9IFtjZW50cmVOYW1lc0Fycl1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBmaWx0ZXJEYXRhO1xuICAgICAgICBpZiAoY2VudHJlTmFtZXNBcnIubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBmaWx0ZXJEYXRhID0gW107XG4gICAgICAgIH0gZWxzZSBpZiAoY2VudHJlTmFtZXNBcnJbMF0gPT09ICdhbGwnKSB7XG4gICAgICAgICAgICBmaWx0ZXJEYXRhID0gdG90YWxEYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmlsdGVyRGF0YSA9IGdldERhdGFCeUNlbnRyZUFycmF5KHRvdGFsRGF0YSwgY2VudHJlTmFtZXNBcnIpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZygnZmlsdGVyRGF0YScsIGZpbHRlckRhdGEpXG4gICAgICAgIGNvbnNvbGUubG9nKCdmaWx0ZXJEYXRhIGxlbmd0aCcsIGZpbHRlckRhdGEubGVuZ3RoKVxuICAgICAgICBjb25zb2xlLmxvZygnY2VudHJlTmFtZXNBcnIgbGVuZ3RoJywgY2VudHJlTmFtZXNBcnIubGVuZ3RoKVxuXG4gICAgICAgIGxldCBsZWdlbmREYXRhID0gZ2V0TGV2ZWxzSW5EYXRhKGZpbHRlckRhdGEpXG4gICAgICAgIGNvbnNvbGUubG9nKCdjZW50cmVOYW1l77yaJywgY2VudHJlTmFtZXNBcnIpXG4gICAgICAgIGNvbnNvbGUubG9nKCdsZXZlbO+8micsIGxlZ2VuZERhdGEpXG5cbiAgICAgICAgLy8g5q+P5Liq5bm057qn5a+55bqU55qE5pWw5o2u5LmL5ZKMIOS+izogWyfkuIDlubTnuqcn77yMMTBdXG4gICAgICAgIGxldCBsZWdlbmRXaXRoU3R1ZGVudENvdW50ID0gW10sIGxlZ2VuZFdpdGhFbnF1aXJ5ID0gW10sIGxlZ2VuZFdpdGhFbnJvbGxlZCA9IFtdLCBsZWdlbmRXaXRoV2l0aERyYXduID0gW107XG5cbiAgICAgICAgLy8g6YGN5Y6G5ZCE5Liq5bm057qn77yM5a+75om+ZmlsdGVyRGF0YeS4reWvueW6lOeahOW5tOe6p1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlZ2VuZERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCB0b3RhbFN0dWRlbnRDb3VudCA9IDA7XG4gICAgICAgICAgICBsZXQgdG90YWxFbnF1aXJ5ID0gMDtcbiAgICAgICAgICAgIGxldCB0b3RhbEVucm9sbGVkID0gMDtcbiAgICAgICAgICAgIGxldCB0b3RhbFdpdGhEcmF3biA9IDA7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGZpbHRlckRhdGEubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsdGVyRGF0YVtqXVsnTGV2ZWwnXSA9PT0gbGVnZW5kRGF0YVtpXSkge1xuICAgICAgICAgICAgICAgICAgICB0b3RhbFN0dWRlbnRDb3VudCArPSBmaWx0ZXJEYXRhW2pdWydTdHVkZW50IENvdW50J107XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsRW5xdWlyeSArPSBmaWx0ZXJEYXRhW2pdWydFbnF1aXJ5J107XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsRW5yb2xsZWQgKz0gZmlsdGVyRGF0YVtqXVsnRW5yb2xsZWQnXTtcbiAgICAgICAgICAgICAgICAgICAgdG90YWxXaXRoRHJhd24gKz0gZmlsdGVyRGF0YVtqXVsnV2l0aGRyYXduJ107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGVnZW5kV2l0aFN0dWRlbnRDb3VudC5wdXNoKFtsZWdlbmREYXRhW2ldLCB0b3RhbFN0dWRlbnRDb3VudF0pXG4gICAgICAgICAgICBsZWdlbmRXaXRoRW5xdWlyeS5wdXNoKFtsZWdlbmREYXRhW2ldLCB0b3RhbEVucXVpcnldKVxuICAgICAgICAgICAgbGVnZW5kV2l0aEVucm9sbGVkLnB1c2goW2xlZ2VuZERhdGFbaV0sIHRvdGFsRW5yb2xsZWRdKVxuICAgICAgICAgICAgbGVnZW5kV2l0aFdpdGhEcmF3bi5wdXNoKFtsZWdlbmREYXRhW2ldLCB0b3RhbFdpdGhEcmF3bl0pXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgeEF4aXNEYXRhID0gW107XG4gICAgICAgIGxldCB4RGF0YSA9IFtdO1xuICAgICAgICBsZXQgc3R1ZGVudENvdW50U2VyaWVzRGF0YSA9IFtdLCBlbnF1aXJ5U2VyaWVzRGF0YSA9IFtdLCBlbnJvbGxlZFNlcmllc0RhdGEgPSBbXSwgd2l0aGRyYXduU2VyaWVzRGF0YSA9IFtdOy8v5Zu+6KGoNFxuICAgICAgICAvLyDlr7nlubTnuqflvqrnjq8s55Sf5oiQ5p+Q5LiA5bm057qn55qE5pWw5o2uXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVnZW5kRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGxldmVsTmFtZSA9IGxlZ2VuZERhdGFbaV07XG4gICAgICAgICAgICAvLyDmoLnmja5sZXZlbOW5tOe6p+etm+mAieaVsOaNrlxuICAgICAgICAgICAgbGV0IGRhdGFGaWx0ZXJCeUxldmVsID0gZ2V0RGF0YUJ5TGV2ZWwoZmlsdGVyRGF0YSwgbGV2ZWxOYW1lKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGxldmVsTmFtZSwgZGF0YUZpbHRlckJ5TGV2ZWwpO1xuICAgICAgICAgICAgbGV0IHN0dWRlbnRDb3VudEFyciA9IFtdLCBlbnF1aXJ5QXJyID0gW10sIGVucm9sbGVkQXJyID0gW10sIHdpdGhkcmF3bkFyciA9IFtdOy8v57q/5b2i5Zu+55qE5pWw5o2uWzEsMiwzLi4uXVxuXG4gICAgICAgICAgICAvLyDmraTlpITnmoRkYXRhRmlsdGVyQnlMZXZlbOaYr+aJgOacieaVsOaNrlxuICAgICAgICAgICAgbGV0IHRlbXAgPSBbXTsgLy8g5a2Y5YKo5YiG57uE5ZCO55qE5pWw57uELOaMieaciOS7veWIhuaIkDEy57uEXG4gICAgICAgICAgICBsZXQgdCA9IGRhdGFGaWx0ZXJCeUxldmVsO1xuICAgICAgICAgICAgbGV0IG1vZCA9IDEyO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtb2Q7IGkrKykge1xuICAgICAgICAgICAgICAgIHRlbXAucHVzaCh0LmZpbHRlcihmdW5jdGlvbiAoaXRlbSwgaW5kZXgsIGFycikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoKGluZGV4IC0gaSkgJSBtb2QgPT09IDApXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRlbXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgc3R1ZGVudENvdW50VG90YWxQZXJNb250aCA9IDAsIGVucXVpcnlUb3RhbFBlck1vbnRoID0gMCxcbiAgICAgICAgICAgICAgICAgICAgZW5yb2xsZWRUb3RhbFBlck1vbnRoID0gMCwgd2l0aGRyYXduVG90YWxQZXJNb250aCA9IDA7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0ZW1wW2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0dWRlbnRDb3VudFRvdGFsUGVyTW9udGggKz0gdGVtcFtpXVtqXVsnU3R1ZGVudCBDb3VudCddO1xuICAgICAgICAgICAgICAgICAgICBlbnF1aXJ5VG90YWxQZXJNb250aCArPSB0ZW1wW2ldW2pdWydFbnF1aXJ5J107XG4gICAgICAgICAgICAgICAgICAgIGVucm9sbGVkVG90YWxQZXJNb250aCArPSB0ZW1wW2ldW2pdWydFbnJvbGxlZCddO1xuICAgICAgICAgICAgICAgICAgICB3aXRoZHJhd25Ub3RhbFBlck1vbnRoICs9IHRlbXBbaV1bal1bJ1dpdGhkcmF3biddXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN0dWRlbnRDb3VudEFyci5wdXNoKHN0dWRlbnRDb3VudFRvdGFsUGVyTW9udGgpO1xuICAgICAgICAgICAgICAgIGVucXVpcnlBcnIucHVzaChlbnF1aXJ5VG90YWxQZXJNb250aCk7XG4gICAgICAgICAgICAgICAgZW5yb2xsZWRBcnIucHVzaChlbnJvbGxlZFRvdGFsUGVyTW9udGgpO1xuICAgICAgICAgICAgICAgIHdpdGhkcmF3bkFyci5wdXNoKHdpdGhkcmF3blRvdGFsUGVyTW9udGgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDnlJ/miJBY6L20XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGRhdGFGaWx0ZXJCeUxldmVsLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgeERhdGEucHVzaChkYXRhRmlsdGVyQnlMZXZlbFtqXVsnWWVhciddICsgJy0nICsgZGF0YUZpbHRlckJ5TGV2ZWxbal1bJ01vbnRoJ10pO1xuICAgICAgICAgICAgICAgIHhBeGlzRGF0YSA9IEFycmF5LmZyb20obmV3IFNldCh4RGF0YSkpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOiuvue9ruWQhOS4quW5tOe6p+eahOe6v+W9ouWbvizkuZ/lsLHmmK/lnKjkuIDlvKDlm77ooajkuK3nlJ/miJDkuIDmnaHnur9cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzdHVkZW50Q291bnRBcnInLCBzdHVkZW50Q291bnRBcnIpXG4gICAgICAgICAgICBzdHVkZW50Q291bnRTZXJpZXNEYXRhLnB1c2goZ2V0TGluZU9iaihzdHVkZW50Q291bnRBcnIsIGxldmVsTmFtZSkpO1xuICAgICAgICAgICAgZW5xdWlyeVNlcmllc0RhdGEucHVzaChnZXRMaW5lT2JqKGVucXVpcnlBcnIsIGxldmVsTmFtZSkpO1xuICAgICAgICAgICAgZW5yb2xsZWRTZXJpZXNEYXRhLnB1c2goZ2V0TGluZU9iaihlbnJvbGxlZEFyciwgbGV2ZWxOYW1lKSk7XG4gICAgICAgICAgICB3aXRoZHJhd25TZXJpZXNEYXRhLnB1c2goZ2V0TGluZU9iaih3aXRoZHJhd25BcnIsIGxldmVsTmFtZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g6K6+572u6aW85Zu+XG4gICAgICAgIHN0dWRlbnRDb3VudFNlcmllc0RhdGEucHVzaChnZXRQaWVPYmoobGVnZW5kV2l0aFN0dWRlbnRDb3VudCkpO1xuICAgICAgICBlbnF1aXJ5U2VyaWVzRGF0YS5wdXNoKGdldFBpZU9iaihsZWdlbmRXaXRoRW5xdWlyeSkpO1xuICAgICAgICBlbnJvbGxlZFNlcmllc0RhdGEucHVzaChnZXRQaWVPYmoobGVnZW5kV2l0aEVucm9sbGVkKSk7XG4gICAgICAgIHdpdGhkcmF3blNlcmllc0RhdGEucHVzaChnZXRQaWVPYmoobGVnZW5kV2l0aFdpdGhEcmF3bikpO1xuXG4gICAgICAgIHZhciBzZWxBbGxPYmogPSB7XG4gICAgICAgICAgICBuYW1lOiBzZWxlY3RBbGwsXG4gICAgICAgICAgICB0eXBlOiAnbGluZSdcbiAgICAgICAgfTtcbiAgICAgICAgc3R1ZGVudENvdW50U2VyaWVzRGF0YS5wdXNoKHNlbEFsbE9iaik7XG4gICAgICAgIGVucXVpcnlTZXJpZXNEYXRhLnB1c2goc2VsQWxsT2JqKTtcbiAgICAgICAgZW5yb2xsZWRTZXJpZXNEYXRhLnB1c2goc2VsQWxsT2JqKTtcbiAgICAgICAgd2l0aGRyYXduU2VyaWVzRGF0YS5wdXNoKHNlbEFsbE9iaik7XG5cbiAgICAgICAgY29uc29sZS5sb2coc3R1ZGVudENvdW50U2VyaWVzRGF0YSlcblxuICAgICAgICAvLyDloavlhaXmlbDmja5cbiAgICAgICAgaWYgKGZpbHRlckRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBtYWluQ2hhcnQuc2V0T3B0aW9uKGdldE9wdGlvbihsZWdlbmREYXRhLCB4QXhpc0RhdGEsIFtdKSk7XG4gICAgICAgICAgICBlbnF1aXJ5Q2hhcnQuc2V0T3B0aW9uKGdldE9wdGlvbihsZWdlbmREYXRhLCB4QXhpc0RhdGEsIFtdKSk7XG4gICAgICAgICAgICBlbnJvbGxlZENoYXJ0LnNldE9wdGlvbihnZXRPcHRpb24obGVnZW5kRGF0YSwgeEF4aXNEYXRhLCBbXSkpO1xuICAgICAgICAgICAgd2l0aGRyYXduQ2hhcnQuc2V0T3B0aW9uKGdldE9wdGlvbihsZWdlbmREYXRhLCB4QXhpc0RhdGEsIFtdKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtYWluQ2hhcnQuc2V0T3B0aW9uKGdldE9wdGlvbihsZWdlbmREYXRhLCB4QXhpc0RhdGEsIHN0dWRlbnRDb3VudFNlcmllc0RhdGEpKTtcbiAgICAgICAgICAgIGVucXVpcnlDaGFydC5zZXRPcHRpb24oZ2V0T3B0aW9uKGxlZ2VuZERhdGEsIHhBeGlzRGF0YSwgZW5xdWlyeVNlcmllc0RhdGEpKTtcbiAgICAgICAgICAgIGVucm9sbGVkQ2hhcnQuc2V0T3B0aW9uKGdldE9wdGlvbihsZWdlbmREYXRhLCB4QXhpc0RhdGEsIGVucm9sbGVkU2VyaWVzRGF0YSkpO1xuICAgICAgICAgICAgd2l0aGRyYXduQ2hhcnQuc2V0T3B0aW9uKGdldE9wdGlvbihsZWdlbmREYXRhLCB4QXhpc0RhdGEsIHdpdGhkcmF3blNlcmllc0RhdGEpKTtcblxuICAgICAgICAgICAgaGFuZGxlU2VsZWN0QWxsKG1haW5DaGFydCwgZ2V0T3B0aW9uKGxlZ2VuZERhdGEsIHhBeGlzRGF0YSwgc3R1ZGVudENvdW50U2VyaWVzRGF0YSkpXG4gICAgICAgICAgICBoYW5kbGVTZWxlY3RBbGwoZW5xdWlyeUNoYXJ0LCBnZXRPcHRpb24obGVnZW5kRGF0YSwgeEF4aXNEYXRhLCBlbnF1aXJ5U2VyaWVzRGF0YSkpXG4gICAgICAgICAgICBoYW5kbGVTZWxlY3RBbGwoZW5yb2xsZWRDaGFydCwgZ2V0T3B0aW9uKGxlZ2VuZERhdGEsIHhBeGlzRGF0YSwgZW5yb2xsZWRTZXJpZXNEYXRhKSlcbiAgICAgICAgICAgIGhhbmRsZVNlbGVjdEFsbCh3aXRoZHJhd25DaGFydCwgZ2V0T3B0aW9uKGxlZ2VuZERhdGEsIHhBeGlzRGF0YSwgd2l0aGRyYXduU2VyaWVzRGF0YSkpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBjaGFydFxuICAgICAqIEBwYXJhbSBvcHRpb25zXG4gICAgICovXG4gICAgZnVuY3Rpb24gaGFuZGxlU2VsZWN0QWxsKGNoYXJ0LCBvcHRpb25zKSB7XG4gICAgICAgIGNoYXJ0Lm9mZignbGVnZW5kc2VsZWN0Y2hhbmdlZCcpO1xuICAgICAgICBjaGFydC5vbignbGVnZW5kc2VsZWN0Y2hhbmdlZCcsIGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgICAgIC8vbGVnZW5k44CA5YWo6YCJ5pON5L2cXG4gICAgICAgICAgICBpZiAocGFyYW1zLm5hbWUgPT09IHNlbGVjdEFsbCkge1xuICAgICAgICAgICAgICAgIHNlbGVjdEZsYWcgPSAhc2VsZWN0RmxhZzsgLy90b2dnbGVcbiAgICAgICAgICAgICAgICAvL+iuvue9ruWFqOmAiVxuICAgICAgICAgICAgICAgIGZvciAobGV0IGluZGV4IGluIHBhcmFtcy5zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICBkeW5hbWljU2VsZWN0ZWRbaW5kZXhdID0gc2VsZWN0RmxhZztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy/ph43nu5hcbiAgICAgICAgICAgICAgICBjaGFydC5zZXRPcHRpb24ob3B0aW9ucyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcmV0dXJucyB7e3R5cGU6IHN0cmluZywgcmFkaXVzOiBbbnVtYmVyLHN0cmluZ10sIGNlbnRlcjogW3N0cmluZyxzdHJpbmddLCBkYXRhOiBBcnJheX19XG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0UGllT2JqKGRhdGEpIHtcbiAgICAgICAgbGV0IHBpZURhdGEgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBwaWVEYXRhLnB1c2goe3ZhbHVlOiBkYXRhW2ldWzFdLCBuYW1lOiBkYXRhW2ldWzBdfSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ3BpZScsXG4gICAgICAgICAgICByYWRpdXM6IFswLCAnMjAlJ10sXG4gICAgICAgICAgICBjZW50ZXI6IFsnMTglJywgJzUwJSddLFxuICAgICAgICAgICAgZGF0YTogcGllRGF0YVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXJyXG4gICAgICogQHBhcmFtIG5hbWVcbiAgICAgKiBAcmV0dXJucyB7e25hbWU6ICosIHR5cGU6IHN0cmluZywgeDogc3RyaW5nLCBkYXRhOiAqfX1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRMaW5lT2JqKGFyciwgbmFtZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgIHR5cGU6ICdsaW5lJyxcbiAgICAgICAgICAgIHg6ICczNSUnLFxuICAgICAgICAgICAgZGF0YTogYXJyLFxuICAgICAgICAgICAgLy8gbWFya0xpbmU6IHtcbiAgICAgICAgICAgIC8vICAgICAvLyBzaWxlbnQ6IHRydWUsXG4gICAgICAgICAgICAvLyAgICAgZGF0YTogW3tcbiAgICAgICAgICAgIC8vICAgICAgICAgbmFtZTogJ2F2ZXJhZ2UnLFxuICAgICAgICAgICAgLy8gICAgICAgICAvLyDmlK/mjIEgJ2F2ZXJhZ2UnLCAnbWluJywgJ21heCdcbiAgICAgICAgICAgIC8vICAgICAgICAgdHlwZTogJ2F2ZXJhZ2UnXG4gICAgICAgICAgICAvLyAgICAgfV1cbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGxlZ2VuZERhdGFcbiAgICAgKiBAcGFyYW0geEF4aXNEYXRhXG4gICAgICogQHBhcmFtIHNlcmllc0RhdGFcbiAgICAgKiBAcmV0dXJucyB7e2xlZ2VuZDoge3JpZ2h0OiBzdHJpbmcsIGRhdGEsIHNlbGVjdGVkOiB7fX0sIHhBeGlzOiB7dHlwZTogc3RyaW5nLCBib3VuZGFyeUdhcDogYm9vbGVhbiwgZGF0YTogKn0sIHNlcmllczogKn19XG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0T3B0aW9uKGxlZ2VuZERhdGEsIHhBeGlzRGF0YSwgc2VyaWVzRGF0YSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGVnZW5kOiB7XG4gICAgICAgICAgICAgICAgcmlnaHQ6ICcxMCUnLFxuICAgICAgICAgICAgICAgIC8vIGRhdGE6IGxlZ2VuZERhdGEuY29uY2F0KHNlbGVjdEFsbCksXG4gICAgICAgICAgICAgICAgZGF0YTogW3NlbGVjdEFsbF0uY29uY2F0KGxlZ2VuZERhdGEpLFxuICAgICAgICAgICAgICAgIHNlbGVjdGVkOiBkeW5hbWljU2VsZWN0ZWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB4QXhpczoge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdjYXRlZ29yeScsXG4gICAgICAgICAgICAgICAgYm91bmRhcnlHYXA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGRhdGE6IHhBeGlzRGF0YVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNlcmllczogc2VyaWVzRGF0YVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqIEBwYXJhbSBjZW50cmVOYW1lQXJyXG4gICAgICogQHJldHVybnMge0FycmF5fVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldERhdGFCeUNlbnRyZUFycmF5KGRhdGEsIGNlbnRyZU5hbWVBcnIpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNlbnRyZU5hbWVBcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZGF0YS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhW2pdWydDZW50cmUnXSA9PT0gY2VudHJlTmFtZUFycltpXSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChkYXRhW2pdKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0TGV2ZWxzSW5EYXRhKGRhdGEpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQuaW5kZXhPZihkYXRhW2ldWydMZXZlbCddKSA8IDApXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goZGF0YVtpXVsnTGV2ZWwnXSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0Q2VudHJlc0luRGF0YShkYXRhKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocmVzdWx0LmluZGV4T2YoZGF0YVtpXVsnQ2VudHJlJ10pIDwgMClcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChkYXRhW2ldWydDZW50cmUnXSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGFyclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdlbmVyYXRlU2Nob29sU2VsZWN0KGFycikge1xuICAgICAgICBsZXQgc3RyaW5nID0gXCI8b3B0aW9uIHZhbHVlPSdhbGwnPkFsbDwvb3B0aW9uPlwiO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgc3RyaW5nICs9IFwiPG9wdGlvbiB2YWx1ZT1cXFwiXCIgKyBhcnJbaV0gKyBcIlxcXCI+XCIgKyBhcnJbaV0gKyBcIjwvb3B0aW9uPlwiO1xuICAgICAgICB9XG5cbiAgICAgICAgJChcIiNzY2hvb2wtbGlzdFwiKS5odG1sKHN0cmluZyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXJyXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVDZW50cmVMaXN0KGFycikge1xuICAgICAgICBsZXQgc3RyaW5nID0gXCI8bGkgY2xhc3M9J2NoZWNrZWQnIHZhbHVlPSdhbGwnPkFsbDwvbGk+XCI7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBzdHJpbmcgKz0gXCI8bGkgY2xhc3M9J2NoZWNrZWQnIHZhbHVlPVxcXCJcIiArIGFycltpXSArIFwiXFxcIj5cIiArIGFycltpXSArIFwiPC9saT5cIjtcbiAgICAgICAgfVxuICAgICAgICAkKFwiI2NlbnRyZS1saXN0XCIpLmh0bWwoc3RyaW5nKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBmaWx0ZXJEYXRhXG4gICAgICogQHBhcmFtIGxldmVsXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0RGF0YUJ5TGV2ZWwoZmlsdGVyRGF0YSwgbGV2ZWwpIHtcbiAgICAgICAgcmV0dXJuIGZpbHRlckRhdGEuZmlsdGVyKGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWxbJ0xldmVsJ10gPT09IGxldmVsO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBuYW1lXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRRdWVyeVN0cmluZyhuYW1lKSB7XG4gICAgICAgIGxldCByZWcgPSBuZXcgUmVnRXhwKFwiKF58JilcIiArIG5hbWUgKyBcIj0oW14mXSopKCZ8JClcIik7XG4gICAgICAgIGxldCByID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHIoMSkubWF0Y2gocmVnKTtcbiAgICAgICAgaWYgKHIpcmV0dXJuIHVuZXNjYXBlKHJbMl0pO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbn0oKTsiXX0=
