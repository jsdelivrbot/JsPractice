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

    // let host = 'http://192.168.1.116:8080/';
    // let host = 'http://bestyiwan.s1.natapp.cc/';
    // let host = 'http://123.56.122.183:8081/';
    var host = 'http://analysis.bestyiwan.com/';
    var client = getQueryString('client') || 'GEH';
    var url = host + 'api/open/enrollment/statistics/?format=json&api_key=smYS9q9Hv9o7Ioek95Z7MFmuimoOsneuAMEWGtq3Uq6JYiRqyQBaOPSda3tZ06CaXznie6cdBbOI5tgpuyvxo9zEchp6sfGD3pKKkVl9gf6zkKD6CNq3WFV2IyVhAL8TVFoMsJgvKlTZAnVZz4htejJfkw4V54UVDxoTEgju3ivzpnzdl6jHcVj7ACnBatCPWDZlFXp9raEokOFFKtGZKvLhe9aG22F3MkDUhbfR2DypXhe6ZaT9hjvbL6BeDYf' + '&client=' + client;

    var date = new Date();
    var currentMonth = date.getMonth() + 1;
    var currentYear = date.getFullYear();

    var selectAll = 'Select All';
    var selectFlag = true;
    var dynamicSelected = {};
    var reqArr = [];

    for (var j = currentMonth !== 12 ? currentMonth + 1 : 13; j < 13; j++) {
        reqArr.push($.get(url + ('&month=' + j + '&year=' + (currentYear - 1))));
        // console.log(url + `&month=${j}&year=${currentYear - 1}`)
    }
    for (var i = 1; i <= currentMonth; i++) {
        reqArr.push($.get(url + ('&month=' + i + '&year=' + currentYear)));
        // console.log(url + `&month=${i}&year=${currentYear}`)
    }
    console.log('Request Array', reqArr);

    mainChart.showLoading();
    var startTime = +new Date();

    (_$ = $).when.apply(_$, reqArr).done(function () {

        mainChart.hideLoading();
        // enquiryChart.hideLoading()
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

        // generateSchoolSelect
        var centreData = void 0;
        centreData = getCentresInData(totalData);
        console.log('schoolList', centreData);
        // generateSchoolSelect(centreData);
        generateCentreList(centreData);
        generateData('all', totalData);

        // $("#school-list").change(function () {
        //     let option = $(this);
        //     console.log('click', option.val(), totalData)
        //     generateData(option.val(), totalData)
        // });

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7O0FBTUEsQ0FBQyxZQUFZO0FBQUE7O0FBRVQsUUFBSSxZQUFZLFFBQVEsSUFBUixDQUFhLFNBQVMsY0FBVCxDQUF3QixNQUF4QixDQUFiLENBQWhCO0FBQ0EsUUFBSSxlQUFlLFFBQVEsSUFBUixDQUFhLFNBQVMsY0FBVCxDQUF3QixTQUF4QixDQUFiLENBQW5CO0FBQ0EsUUFBSSxnQkFBZ0IsUUFBUSxJQUFSLENBQWEsU0FBUyxjQUFULENBQXdCLFVBQXhCLENBQWIsQ0FBcEI7QUFDQSxRQUFJLGlCQUFpQixRQUFRLElBQVIsQ0FBYSxTQUFTLGNBQVQsQ0FBd0IsV0FBeEIsQ0FBYixDQUFyQjs7QUFFQSxRQUFNLGNBQWM7QUFDaEIsZUFBTztBQUNILGtCQUFNO0FBREgsU0FEUztBQUloQixpQkFBUztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBSkssU0FKTztBQVVoQixjQUFNO0FBQ0Ysa0JBQU0sS0FESjtBQUVGLG1CQUFPLElBRkw7QUFHRjtBQUNBLDBCQUFjO0FBSlosU0FWVTtBQWdCaEIsZUFBTztBQUNILGtCQUFNO0FBREgsU0FoQlM7QUFtQmhCLGVBQU87QUFDSCxrQkFBTTtBQURILFNBbkJTO0FBc0JoQixpQkFBUztBQUNMLHFCQUFTO0FBQ0wsNkJBQWE7QUFDVCwyQkFBTztBQURFLGlCQURSO0FBSUwsMkJBQVc7QUFDUCwyQkFBTztBQUNILDhCQUFNLE1BREgsRUFDVyxLQUFLO0FBRGhCLHFCQURBO0FBSVAsMEJBQU0sQ0FBQyxNQUFELEVBQVMsS0FBVDtBQUpDO0FBSk47QUFESjtBQXRCTyxLQUFwQjs7QUFxQ0EsY0FBVSxTQUFWLENBQW9CLFdBQXBCO0FBQ0EsaUJBQWEsU0FBYixDQUF1QixXQUF2QjtBQUNBLGtCQUFjLFNBQWQsQ0FBd0IsV0FBeEI7QUFDQSxtQkFBZSxTQUFmLENBQXlC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LGtCQUFULENBQTRCLEdBQTVCLEVBQWlDO0FBQzdCLFlBQUksU0FBUywwQ0FBYjtBQUNBLGFBQUssSUFBSSxPQUFJLENBQWIsRUFBZ0IsT0FBSSxJQUFJLE1BQXhCLEVBQWdDLE1BQWhDLEVBQXFDO0FBQ2pDLHNCQUFVLGlDQUFpQyxJQUFJLElBQUosQ0FBakMsR0FBMEMsS0FBMUMsR0FBa0QsSUFBSSxJQUFKLENBQWxELEdBQTJELE9BQXJFO0FBQ0g7QUFDRCxVQUFFLGNBQUYsRUFBa0IsSUFBbEIsQ0FBdUIsTUFBdkI7QUFDSDs7QUFFRDs7Ozs7QUFLQSxhQUFTLGNBQVQsQ0FBd0IsVUFBeEIsRUFBb0MsS0FBcEMsRUFBMkM7QUFDdkMsZUFBTyxXQUFXLE1BQVgsQ0FBa0IsVUFBVSxHQUFWLEVBQWU7QUFDcEMsbUJBQU8sSUFBSSxPQUFKLE1BQWlCLEtBQXhCO0FBQ0gsU0FGTSxDQUFQO0FBR0g7O0FBRUQ7Ozs7O0FBS0EsYUFBUyxjQUFULENBQXdCLElBQXhCLEVBQThCO0FBQzFCLFlBQUksTUFBTSxJQUFJLE1BQUosQ0FBVyxVQUFVLElBQVYsR0FBaUIsZUFBNUIsQ0FBVjtBQUNBLFlBQUksSUFBSSxPQUFPLFFBQVAsQ0FBZ0IsTUFBaEIsQ0FBdUIsTUFBdkIsQ0FBOEIsQ0FBOUIsRUFBaUMsS0FBakMsQ0FBdUMsR0FBdkMsQ0FBUjtBQUNBLFlBQUksQ0FBSixFQUFNLE9BQU8sU0FBUyxFQUFFLENBQUYsQ0FBVCxDQUFQO0FBQ04sZUFBTyxJQUFQO0FBQ0g7QUFFSixDQWpkQSxFQUFEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogbWFpbi5qc1xuICpcbiAqIENyZWF0ZWQgYnkgaWNlIG9uIDIwMTcvNC82IOS4iuWNiDExOjEzLlxuICovXG5cbiFmdW5jdGlvbiAoKSB7XG5cbiAgICBsZXQgbWFpbkNoYXJ0ID0gZWNoYXJ0cy5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluJykpO1xuICAgIGxldCBlbnF1aXJ5Q2hhcnQgPSBlY2hhcnRzLmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VucXVpcnknKSk7XG4gICAgbGV0IGVucm9sbGVkQ2hhcnQgPSBlY2hhcnRzLmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vucm9sbGVkJykpO1xuICAgIGxldCB3aXRoZHJhd25DaGFydCA9IGVjaGFydHMuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2l0aGRyYXduJykpO1xuXG4gICAgY29uc3QgYmFzZU9wdGlvbnMgPSB7XG4gICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICB0ZXh0OiAnJ1xuICAgICAgICB9LFxuICAgICAgICB0b29sdGlwOiB7XG4gICAgICAgICAgICAvLyB0cmlnZ2VyOiAnYXhpcycsXG4gICAgICAgICAgICAvLyBheGlzUG9pbnRlcjoge1xuICAgICAgICAgICAgLy8gICAgIHR5cGU6ICdjcm9zcydcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgfSxcbiAgICAgICAgZ3JpZDoge1xuICAgICAgICAgICAgbGVmdDogJzM1JScsXG4gICAgICAgICAgICByaWdodDogJzUlJyxcbiAgICAgICAgICAgIC8vIGJvdHRvbTogJzElJyxcbiAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICB4QXhpczoge1xuICAgICAgICAgICAgZGF0YTogW11cbiAgICAgICAgfSxcbiAgICAgICAgeUF4aXM6IHtcbiAgICAgICAgICAgIHR5cGU6ICd2YWx1ZSdcbiAgICAgICAgfSxcbiAgICAgICAgdG9vbGJveDoge1xuICAgICAgICAgICAgZmVhdHVyZToge1xuICAgICAgICAgICAgICAgIHNhdmVBc0ltYWdlOiB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnc2F2ZSBhcyBpbWFnZSdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG1hZ2ljVHlwZToge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZTogJ2xpbmUnLCBiYXI6ICdiYXInXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFsnbGluZScsICdiYXInXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBtYWluQ2hhcnQuc2V0T3B0aW9uKGJhc2VPcHRpb25zKTtcbiAgICBlbnF1aXJ5Q2hhcnQuc2V0T3B0aW9uKGJhc2VPcHRpb25zKTtcbiAgICBlbnJvbGxlZENoYXJ0LnNldE9wdGlvbihiYXNlT3B0aW9ucyk7XG4gICAgd2l0aGRyYXduQ2hhcnQuc2V0T3B0aW9uKGJhc2VPcHRpb25zKTtcblxuLy8gbGV0IGhvc3QgPSAnaHR0cDovLzE5Mi4xNjguMS4xMTY6ODA4MC8nO1xuLy8gbGV0IGhvc3QgPSAnaHR0cDovL2Jlc3R5aXdhbi5zMS5uYXRhcHAuY2MvJztcbi8vIGxldCBob3N0ID0gJ2h0dHA6Ly8xMjMuNTYuMTIyLjE4Mzo4MDgxLyc7XG4gICAgY29uc3QgaG9zdCA9ICdodHRwOi8vYW5hbHlzaXMuYmVzdHlpd2FuLmNvbS8nO1xuICAgIGNvbnN0IGNsaWVudCA9IGdldFF1ZXJ5U3RyaW5nKCdjbGllbnQnKSB8fCAnR0VIJztcbiAgICBjb25zdCB1cmwgPSBob3N0ICsgJ2FwaS9vcGVuL2Vucm9sbG1lbnQvc3RhdGlzdGljcy8/Zm9ybWF0PWpzb24mYXBpX2tleT1zbVlTOXE5SHY5bzdJb2VrOTVaN01GbXVpbW9Pc25ldUFNRVdHdHEzVXE2SllpUnF5UUJhT1BTZGEzdFowNkNhWHpuaWU2Y2RCYk9JNXRncHV5dnhvOXpFY2hwNnNmR0QzcEtLa1ZsOWdmNnprS0Q2Q05xM1dGVjJJeVZoQUw4VFZGb01zSmd2S2xUWkFuVlp6NGh0ZWpKZmt3NFY1NFVWRHhvVEVnanUzaXZ6cG56ZGw2akhjVmo3QUNuQmF0Q1BXRFpsRlhwOXJhRW9rT0ZGS3RHWkt2TGhlOWFHMjJGM01rRFVoYmZSMkR5cFhoZTZaYVQ5aGp2Ykw2QmVEWWYnXG4gICAgICAgICsgJyZjbGllbnQ9JyArIGNsaWVudDtcblxuICAgIGxldCBkYXRlID0gbmV3IERhdGUoKTtcbiAgICBsZXQgY3VycmVudE1vbnRoID0gZGF0ZS5nZXRNb250aCgpICsgMTtcbiAgICBsZXQgY3VycmVudFllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XG5cbiAgICBjb25zdCBzZWxlY3RBbGwgPSAnU2VsZWN0IEFsbCc7XG4gICAgbGV0IHNlbGVjdEZsYWcgPSB0cnVlO1xuICAgIGxldCBkeW5hbWljU2VsZWN0ZWQgPSB7fTtcbiAgICBsZXQgcmVxQXJyID0gW107XG5cbiAgICBmb3IgKGxldCBqID0gKGN1cnJlbnRNb250aCAhPT0gMTIgPyBjdXJyZW50TW9udGggKyAxIDogMTMpOyBqIDwgMTM7IGorKykge1xuICAgICAgICByZXFBcnIucHVzaCgkLmdldCh1cmwgKyBgJm1vbnRoPSR7an0meWVhcj0ke2N1cnJlbnRZZWFyIC0gMX1gKSlcbiAgICAgICAgLy8gY29uc29sZS5sb2codXJsICsgYCZtb250aD0ke2p9JnllYXI9JHtjdXJyZW50WWVhciAtIDF9YClcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gY3VycmVudE1vbnRoOyBpKyspIHtcbiAgICAgICAgcmVxQXJyLnB1c2goJC5nZXQodXJsICsgYCZtb250aD0ke2l9JnllYXI9JHtjdXJyZW50WWVhcn1gKSlcbiAgICAgICAgLy8gY29uc29sZS5sb2codXJsICsgYCZtb250aD0ke2l9JnllYXI9JHtjdXJyZW50WWVhcn1gKVxuICAgIH1cbiAgICBjb25zb2xlLmxvZygnUmVxdWVzdCBBcnJheScsIHJlcUFycik7XG5cbiAgICBtYWluQ2hhcnQuc2hvd0xvYWRpbmcoKTtcbiAgICBsZXQgc3RhcnRUaW1lID0gK25ldyBEYXRlKCk7XG5cbiAgICAkLndoZW4oLi4ucmVxQXJyKS5kb25lKGZ1bmN0aW9uICguLi5kYXRhKSB7XG5cbiAgICAgICAgbWFpbkNoYXJ0LmhpZGVMb2FkaW5nKClcbiAgICAgICAgLy8gZW5xdWlyeUNoYXJ0LmhpZGVMb2FkaW5nKClcbiAgICAgICAgbGV0IGZpbHRlckRhdGEgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBmaWx0ZXJEYXRhLnB1c2goZGF0YVtpXVswXSlcbiAgICAgICAgfVxuICAgICAgICBsZXQgdG90YWxEYXRhID0gQXJyYXkucHJvdG90eXBlLmNvbmNhdC5hcHBseShbXSwgZmlsdGVyRGF0YSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCd0b3RhbERhdGEnLCB0b3RhbERhdGEpXG5cbiAgICAgICAgY29uc29sZS5sb2coJ3JlcXVlc3RUaW1lJywgK25ldyBEYXRlKCkgLSBzdGFydFRpbWUpXG5cbiAgICAgICAgLy8gZ2VuZXJhdGVTY2hvb2xTZWxlY3RcbiAgICAgICAgbGV0IGNlbnRyZURhdGE7XG4gICAgICAgIGNlbnRyZURhdGEgPSBnZXRDZW50cmVzSW5EYXRhKHRvdGFsRGF0YSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzY2hvb2xMaXN0JywgY2VudHJlRGF0YSk7XG4gICAgICAgIC8vIGdlbmVyYXRlU2Nob29sU2VsZWN0KGNlbnRyZURhdGEpO1xuICAgICAgICBnZW5lcmF0ZUNlbnRyZUxpc3QoY2VudHJlRGF0YSk7XG4gICAgICAgIGdlbmVyYXRlRGF0YSgnYWxsJywgdG90YWxEYXRhKTtcblxuICAgICAgICAvLyAkKFwiI3NjaG9vbC1saXN0XCIpLmNoYW5nZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vICAgICBsZXQgb3B0aW9uID0gJCh0aGlzKTtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCdjbGljaycsIG9wdGlvbi52YWwoKSwgdG90YWxEYXRhKVxuICAgICAgICAvLyAgICAgZ2VuZXJhdGVEYXRhKG9wdGlvbi52YWwoKSwgdG90YWxEYXRhKVxuICAgICAgICAvLyB9KTtcblxuICAgICAgICAvLyDlrabmoKHliJfooajngrnlh7vkuovku7ZcbiAgICAgICAgJCgnI2NlbnRyZS1saXN0JykuY2xpY2soZnVuY3Rpb24gKGV2KSB7XG5cbiAgICAgICAgICAgIC8vIOeCueWHu+WFqOmAiVxuICAgICAgICAgICAgaWYgKGV2LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJykgPT09ICdhbGwnKSB7XG4gICAgICAgICAgICAgICAgJCgnI2NlbnRyZS1saXN0IGxpOm5vdChbdmFsdWU9XCJhbGxcIl0pJykuZWFjaChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCQoJ2xpW3ZhbHVlPVwiYWxsXCJdJykuaGFzQ2xhc3MoJ2NoZWNrZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnY2hlY2tlZCcpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdjaGVja2VkJylcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8g54K55Ye75a2m5qChXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChldi50YXJnZXQudGFnTmFtZSA9PT0gJ0xJJykge1xuICAgICAgICAgICAgICAgICAgICBldi50YXJnZXQuY2xhc3NMaXN0LnRvZ2dsZSgnY2hlY2tlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5aSE55CGQWxs5oyJ6ZKu54q25oCBXG4gICAgICAgICAgICBpZiAoY2VudHJlRGF0YS5sZW5ndGggPT09ICQoJy5jaGVja2VkOm5vdChbdmFsdWU9XCJhbGxcIl0pJykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgJCgnbGlbdmFsdWU9XCJhbGxcIl0nKS5hZGRDbGFzcygnY2hlY2tlZCcpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJ2xpW3ZhbHVlPVwiYWxsXCJdJykucmVtb3ZlQ2xhc3MoJ2NoZWNrZWQnKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDpgInmi6nnmoTlrabmoKFcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZENlbnRyZXMgPSBbXTtcbiAgICAgICAgICAgICQoJy5jaGVja2VkJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRDZW50cmVzLnB1c2goKCQodGhpcykuYXR0cigndmFsdWUnKSkpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3NlbGVjdGVkQ2VudHJlcycsIHNlbGVjdGVkQ2VudHJlcylcblxuICAgICAgICAgICAgZ2VuZXJhdGVEYXRhKHNlbGVjdGVkQ2VudHJlcywgdG90YWxEYXRhKVxuXG4gICAgICAgIH0pXG5cblxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIGFsZXJ0KCdSZXF1ZXN0IGVycm9yJylcbiAgICB9KTtcblxuXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVEYXRhKGNlbnRyZU5hbWVzQXJyLCB0b3RhbERhdGEpIHtcblxuICAgICAgICBpZiAodHlwZW9mIGNlbnRyZU5hbWVzQXJyID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgY2VudHJlTmFtZXNBcnIgPSBbY2VudHJlTmFtZXNBcnJdXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZmlsdGVyRGF0YTtcbiAgICAgICAgaWYgKGNlbnRyZU5hbWVzQXJyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgZmlsdGVyRGF0YSA9IFtdO1xuICAgICAgICB9IGVsc2UgaWYgKGNlbnRyZU5hbWVzQXJyWzBdID09PSAnYWxsJykge1xuICAgICAgICAgICAgZmlsdGVyRGF0YSA9IHRvdGFsRGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZpbHRlckRhdGEgPSBnZXREYXRhQnlDZW50cmVBcnJheSh0b3RhbERhdGEsIGNlbnRyZU5hbWVzQXJyKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coJ2ZpbHRlckRhdGEnLCBmaWx0ZXJEYXRhKVxuICAgICAgICBjb25zb2xlLmxvZygnZmlsdGVyRGF0YSBsZW5ndGgnLCBmaWx0ZXJEYXRhLmxlbmd0aClcbiAgICAgICAgY29uc29sZS5sb2coJ2NlbnRyZU5hbWVzQXJyIGxlbmd0aCcsIGNlbnRyZU5hbWVzQXJyLmxlbmd0aClcblxuICAgICAgICBsZXQgbGVnZW5kRGF0YSA9IGdldExldmVsc0luRGF0YShmaWx0ZXJEYXRhKVxuICAgICAgICBjb25zb2xlLmxvZygnY2VudHJlTmFtZe+8micsIGNlbnRyZU5hbWVzQXJyKVxuICAgICAgICBjb25zb2xlLmxvZygnbGV2ZWzvvJonLCBsZWdlbmREYXRhKVxuXG4gICAgICAgIC8vIOavj+S4quW5tOe6p+WvueW6lOeahOaVsOaNruS5i+WSjCDkvos6IFsn5LiA5bm057qnJ++8jDEwXVxuICAgICAgICBsZXQgbGVnZW5kV2l0aFN0dWRlbnRDb3VudCA9IFtdLCBsZWdlbmRXaXRoRW5xdWlyeSA9IFtdLCBsZWdlbmRXaXRoRW5yb2xsZWQgPSBbXSwgbGVnZW5kV2l0aFdpdGhEcmF3biA9IFtdO1xuXG4gICAgICAgIC8vIOmBjeWOhuWQhOS4quW5tOe6p++8jOWvu+aJvmZpbHRlckRhdGHkuK3lr7nlupTnmoTlubTnuqdcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZWdlbmREYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgdG90YWxTdHVkZW50Q291bnQgPSAwO1xuICAgICAgICAgICAgbGV0IHRvdGFsRW5xdWlyeSA9IDA7XG4gICAgICAgICAgICBsZXQgdG90YWxFbnJvbGxlZCA9IDA7XG4gICAgICAgICAgICBsZXQgdG90YWxXaXRoRHJhd24gPSAwO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBmaWx0ZXJEYXRhLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpbHRlckRhdGFbal1bJ0xldmVsJ10gPT09IGxlZ2VuZERhdGFbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdG90YWxTdHVkZW50Q291bnQgKz0gZmlsdGVyRGF0YVtqXVsnU3R1ZGVudCBDb3VudCddO1xuICAgICAgICAgICAgICAgICAgICB0b3RhbEVucXVpcnkgKz0gZmlsdGVyRGF0YVtqXVsnRW5xdWlyeSddO1xuICAgICAgICAgICAgICAgICAgICB0b3RhbEVucm9sbGVkICs9IGZpbHRlckRhdGFbal1bJ0Vucm9sbGVkJ107XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsV2l0aERyYXduICs9IGZpbHRlckRhdGFbal1bJ1dpdGhkcmF3biddO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxlZ2VuZFdpdGhTdHVkZW50Q291bnQucHVzaChbbGVnZW5kRGF0YVtpXSwgdG90YWxTdHVkZW50Q291bnRdKVxuICAgICAgICAgICAgbGVnZW5kV2l0aEVucXVpcnkucHVzaChbbGVnZW5kRGF0YVtpXSwgdG90YWxFbnF1aXJ5XSlcbiAgICAgICAgICAgIGxlZ2VuZFdpdGhFbnJvbGxlZC5wdXNoKFtsZWdlbmREYXRhW2ldLCB0b3RhbEVucm9sbGVkXSlcbiAgICAgICAgICAgIGxlZ2VuZFdpdGhXaXRoRHJhd24ucHVzaChbbGVnZW5kRGF0YVtpXSwgdG90YWxXaXRoRHJhd25dKVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHhBeGlzRGF0YSA9IFtdO1xuICAgICAgICBsZXQgeERhdGEgPSBbXTtcbiAgICAgICAgbGV0IHN0dWRlbnRDb3VudFNlcmllc0RhdGEgPSBbXSwgZW5xdWlyeVNlcmllc0RhdGEgPSBbXSwgZW5yb2xsZWRTZXJpZXNEYXRhID0gW10sIHdpdGhkcmF3blNlcmllc0RhdGEgPSBbXTsvL+WbvuihqDRcbiAgICAgICAgLy8g5a+55bm057qn5b6q546vLOeUn+aIkOafkOS4gOW5tOe6p+eahOaVsOaNrlxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlZ2VuZERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBsZXZlbE5hbWUgPSBsZWdlbmREYXRhW2ldO1xuICAgICAgICAgICAgLy8g5qC55o2ubGV2ZWzlubTnuqfnrZvpgInmlbDmja5cbiAgICAgICAgICAgIGxldCBkYXRhRmlsdGVyQnlMZXZlbCA9IGdldERhdGFCeUxldmVsKGZpbHRlckRhdGEsIGxldmVsTmFtZSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhsZXZlbE5hbWUsIGRhdGFGaWx0ZXJCeUxldmVsKTtcbiAgICAgICAgICAgIGxldCBzdHVkZW50Q291bnRBcnIgPSBbXSwgZW5xdWlyeUFyciA9IFtdLCBlbnJvbGxlZEFyciA9IFtdLCB3aXRoZHJhd25BcnIgPSBbXTsvL+e6v+W9ouWbvueahOaVsOaNrlsxLDIsMy4uLl1cblxuICAgICAgICAgICAgLy8g5q2k5aSE55qEZGF0YUZpbHRlckJ5TGV2ZWzmmK/miYDmnInmlbDmja5cbiAgICAgICAgICAgIGxldCB0ZW1wID0gW107IC8vIOWtmOWCqOWIhue7hOWQjueahOaVsOe7hCzmjInmnIjku73liIbmiJAxMue7hFxuICAgICAgICAgICAgbGV0IHQgPSBkYXRhRmlsdGVyQnlMZXZlbDtcbiAgICAgICAgICAgIGxldCBtb2QgPSAxMjtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbW9kOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0ZW1wLnB1c2godC5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0sIGluZGV4LCBhcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKChpbmRleCAtIGkpICUgbW9kID09PSAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0ZW1wLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0dWRlbnRDb3VudFRvdGFsUGVyTW9udGggPSAwLCBlbnF1aXJ5VG90YWxQZXJNb250aCA9IDAsXG4gICAgICAgICAgICAgICAgICAgIGVucm9sbGVkVG90YWxQZXJNb250aCA9IDAsIHdpdGhkcmF3blRvdGFsUGVyTW9udGggPSAwO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGVtcFtpXS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBzdHVkZW50Q291bnRUb3RhbFBlck1vbnRoICs9IHRlbXBbaV1bal1bJ1N0dWRlbnQgQ291bnQnXTtcbiAgICAgICAgICAgICAgICAgICAgZW5xdWlyeVRvdGFsUGVyTW9udGggKz0gdGVtcFtpXVtqXVsnRW5xdWlyeSddO1xuICAgICAgICAgICAgICAgICAgICBlbnJvbGxlZFRvdGFsUGVyTW9udGggKz0gdGVtcFtpXVtqXVsnRW5yb2xsZWQnXTtcbiAgICAgICAgICAgICAgICAgICAgd2l0aGRyYXduVG90YWxQZXJNb250aCArPSB0ZW1wW2ldW2pdWydXaXRoZHJhd24nXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdHVkZW50Q291bnRBcnIucHVzaChzdHVkZW50Q291bnRUb3RhbFBlck1vbnRoKTtcbiAgICAgICAgICAgICAgICBlbnF1aXJ5QXJyLnB1c2goZW5xdWlyeVRvdGFsUGVyTW9udGgpO1xuICAgICAgICAgICAgICAgIGVucm9sbGVkQXJyLnB1c2goZW5yb2xsZWRUb3RhbFBlck1vbnRoKTtcbiAgICAgICAgICAgICAgICB3aXRoZHJhd25BcnIucHVzaCh3aXRoZHJhd25Ub3RhbFBlck1vbnRoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g55Sf5oiQWOi9tFxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBkYXRhRmlsdGVyQnlMZXZlbC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIHhEYXRhLnB1c2goZGF0YUZpbHRlckJ5TGV2ZWxbal1bJ1llYXInXSArICctJyArIGRhdGFGaWx0ZXJCeUxldmVsW2pdWydNb250aCddKTtcbiAgICAgICAgICAgICAgICB4QXhpc0RhdGEgPSBBcnJheS5mcm9tKG5ldyBTZXQoeERhdGEpKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDorr7nva7lkITkuKrlubTnuqfnmoTnur/lvaLlm74s5Lmf5bCx5piv5Zyo5LiA5byg5Zu+6KGo5Lit55Sf5oiQ5LiA5p2h57q/XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc3R1ZGVudENvdW50QXJyJywgc3R1ZGVudENvdW50QXJyKVxuICAgICAgICAgICAgc3R1ZGVudENvdW50U2VyaWVzRGF0YS5wdXNoKGdldExpbmVPYmooc3R1ZGVudENvdW50QXJyLCBsZXZlbE5hbWUpKTtcbiAgICAgICAgICAgIGVucXVpcnlTZXJpZXNEYXRhLnB1c2goZ2V0TGluZU9iaihlbnF1aXJ5QXJyLCBsZXZlbE5hbWUpKTtcbiAgICAgICAgICAgIGVucm9sbGVkU2VyaWVzRGF0YS5wdXNoKGdldExpbmVPYmooZW5yb2xsZWRBcnIsIGxldmVsTmFtZSkpO1xuICAgICAgICAgICAgd2l0aGRyYXduU2VyaWVzRGF0YS5wdXNoKGdldExpbmVPYmood2l0aGRyYXduQXJyLCBsZXZlbE5hbWUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOiuvue9rumlvOWbvlxuICAgICAgICBzdHVkZW50Q291bnRTZXJpZXNEYXRhLnB1c2goZ2V0UGllT2JqKGxlZ2VuZFdpdGhTdHVkZW50Q291bnQpKTtcbiAgICAgICAgZW5xdWlyeVNlcmllc0RhdGEucHVzaChnZXRQaWVPYmoobGVnZW5kV2l0aEVucXVpcnkpKTtcbiAgICAgICAgZW5yb2xsZWRTZXJpZXNEYXRhLnB1c2goZ2V0UGllT2JqKGxlZ2VuZFdpdGhFbnJvbGxlZCkpO1xuICAgICAgICB3aXRoZHJhd25TZXJpZXNEYXRhLnB1c2goZ2V0UGllT2JqKGxlZ2VuZFdpdGhXaXRoRHJhd24pKTtcblxuICAgICAgICB2YXIgc2VsQWxsT2JqID0ge1xuICAgICAgICAgICAgbmFtZTogc2VsZWN0QWxsLFxuICAgICAgICAgICAgdHlwZTogJ2xpbmUnXG4gICAgICAgIH07XG4gICAgICAgIHN0dWRlbnRDb3VudFNlcmllc0RhdGEucHVzaChzZWxBbGxPYmopO1xuICAgICAgICBlbnF1aXJ5U2VyaWVzRGF0YS5wdXNoKHNlbEFsbE9iaik7XG4gICAgICAgIGVucm9sbGVkU2VyaWVzRGF0YS5wdXNoKHNlbEFsbE9iaik7XG4gICAgICAgIHdpdGhkcmF3blNlcmllc0RhdGEucHVzaChzZWxBbGxPYmopO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKHN0dWRlbnRDb3VudFNlcmllc0RhdGEpXG5cbiAgICAgICAgLy8g5aGr5YWl5pWw5o2uXG4gICAgICAgIGlmIChmaWx0ZXJEYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgbWFpbkNoYXJ0LnNldE9wdGlvbihnZXRPcHRpb24obGVnZW5kRGF0YSwgeEF4aXNEYXRhLCBbXSkpO1xuICAgICAgICAgICAgZW5xdWlyeUNoYXJ0LnNldE9wdGlvbihnZXRPcHRpb24obGVnZW5kRGF0YSwgeEF4aXNEYXRhLCBbXSkpO1xuICAgICAgICAgICAgZW5yb2xsZWRDaGFydC5zZXRPcHRpb24oZ2V0T3B0aW9uKGxlZ2VuZERhdGEsIHhBeGlzRGF0YSwgW10pKTtcbiAgICAgICAgICAgIHdpdGhkcmF3bkNoYXJ0LnNldE9wdGlvbihnZXRPcHRpb24obGVnZW5kRGF0YSwgeEF4aXNEYXRhLCBbXSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWFpbkNoYXJ0LnNldE9wdGlvbihnZXRPcHRpb24obGVnZW5kRGF0YSwgeEF4aXNEYXRhLCBzdHVkZW50Q291bnRTZXJpZXNEYXRhKSk7XG4gICAgICAgICAgICBlbnF1aXJ5Q2hhcnQuc2V0T3B0aW9uKGdldE9wdGlvbihsZWdlbmREYXRhLCB4QXhpc0RhdGEsIGVucXVpcnlTZXJpZXNEYXRhKSk7XG4gICAgICAgICAgICBlbnJvbGxlZENoYXJ0LnNldE9wdGlvbihnZXRPcHRpb24obGVnZW5kRGF0YSwgeEF4aXNEYXRhLCBlbnJvbGxlZFNlcmllc0RhdGEpKTtcbiAgICAgICAgICAgIHdpdGhkcmF3bkNoYXJ0LnNldE9wdGlvbihnZXRPcHRpb24obGVnZW5kRGF0YSwgeEF4aXNEYXRhLCB3aXRoZHJhd25TZXJpZXNEYXRhKSk7XG5cbiAgICAgICAgICAgIGhhbmRsZVNlbGVjdEFsbChtYWluQ2hhcnQsIGdldE9wdGlvbihsZWdlbmREYXRhLCB4QXhpc0RhdGEsIHN0dWRlbnRDb3VudFNlcmllc0RhdGEpKVxuICAgICAgICAgICAgaGFuZGxlU2VsZWN0QWxsKGVucXVpcnlDaGFydCwgZ2V0T3B0aW9uKGxlZ2VuZERhdGEsIHhBeGlzRGF0YSwgZW5xdWlyeVNlcmllc0RhdGEpKVxuICAgICAgICAgICAgaGFuZGxlU2VsZWN0QWxsKGVucm9sbGVkQ2hhcnQsIGdldE9wdGlvbihsZWdlbmREYXRhLCB4QXhpc0RhdGEsIGVucm9sbGVkU2VyaWVzRGF0YSkpXG4gICAgICAgICAgICBoYW5kbGVTZWxlY3RBbGwod2l0aGRyYXduQ2hhcnQsIGdldE9wdGlvbihsZWdlbmREYXRhLCB4QXhpc0RhdGEsIHdpdGhkcmF3blNlcmllc0RhdGEpKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2hhcnRcbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGhhbmRsZVNlbGVjdEFsbChjaGFydCwgb3B0aW9ucykge1xuICAgICAgICBjaGFydC5vZmYoJ2xlZ2VuZHNlbGVjdGNoYW5nZWQnKTtcbiAgICAgICAgY2hhcnQub24oJ2xlZ2VuZHNlbGVjdGNoYW5nZWQnLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICAgICAvL2xlZ2VuZOOAgOWFqOmAieaTjeS9nFxuICAgICAgICAgICAgaWYgKHBhcmFtcy5uYW1lID09PSBzZWxlY3RBbGwpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RGbGFnID0gIXNlbGVjdEZsYWc7IC8vdG9nZ2xlXG4gICAgICAgICAgICAgICAgLy/orr7nva7lhajpgIlcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleCBpbiBwYXJhbXMuc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZHluYW1pY1NlbGVjdGVkW2luZGV4XSA9IHNlbGVjdEZsYWc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8v6YeN57uYXG4gICAgICAgICAgICAgICAgY2hhcnQuc2V0T3B0aW9uKG9wdGlvbnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHJldHVybnMge3t0eXBlOiBzdHJpbmcsIHJhZGl1czogW251bWJlcixzdHJpbmddLCBjZW50ZXI6IFtzdHJpbmcsc3RyaW5nXSwgZGF0YTogQXJyYXl9fVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFBpZU9iaihkYXRhKSB7XG4gICAgICAgIGxldCBwaWVEYXRhID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcGllRGF0YS5wdXNoKHt2YWx1ZTogZGF0YVtpXVsxXSwgbmFtZTogZGF0YVtpXVswXX0pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdwaWUnLFxuICAgICAgICAgICAgcmFkaXVzOiBbMCwgJzIwJSddLFxuICAgICAgICAgICAgY2VudGVyOiBbJzE4JScsICc1MCUnXSxcbiAgICAgICAgICAgIGRhdGE6IHBpZURhdGFcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGFyclxuICAgICAqIEBwYXJhbSBuYW1lXG4gICAgICogQHJldHVybnMge3tuYW1lOiAqLCB0eXBlOiBzdHJpbmcsIHg6IHN0cmluZywgZGF0YTogKn19XG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0TGluZU9iaihhcnIsIG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICB0eXBlOiAnbGluZScsXG4gICAgICAgICAgICB4OiAnMzUlJyxcbiAgICAgICAgICAgIGRhdGE6IGFycixcbiAgICAgICAgICAgIC8vIG1hcmtMaW5lOiB7XG4gICAgICAgICAgICAvLyAgICAgLy8gc2lsZW50OiB0cnVlLFxuICAgICAgICAgICAgLy8gICAgIGRhdGE6IFt7XG4gICAgICAgICAgICAvLyAgICAgICAgIG5hbWU6ICdhdmVyYWdlJyxcbiAgICAgICAgICAgIC8vICAgICAgICAgLy8g5pSv5oyBICdhdmVyYWdlJywgJ21pbicsICdtYXgnXG4gICAgICAgICAgICAvLyAgICAgICAgIHR5cGU6ICdhdmVyYWdlJ1xuICAgICAgICAgICAgLy8gICAgIH1dXG4gICAgICAgICAgICAvLyB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBsZWdlbmREYXRhXG4gICAgICogQHBhcmFtIHhBeGlzRGF0YVxuICAgICAqIEBwYXJhbSBzZXJpZXNEYXRhXG4gICAgICogQHJldHVybnMge3tsZWdlbmQ6IHtyaWdodDogc3RyaW5nLCBkYXRhLCBzZWxlY3RlZDoge319LCB4QXhpczoge3R5cGU6IHN0cmluZywgYm91bmRhcnlHYXA6IGJvb2xlYW4sIGRhdGE6ICp9LCBzZXJpZXM6ICp9fVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldE9wdGlvbihsZWdlbmREYXRhLCB4QXhpc0RhdGEsIHNlcmllc0RhdGEpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxlZ2VuZDoge1xuICAgICAgICAgICAgICAgIHJpZ2h0OiAnMTAlJyxcbiAgICAgICAgICAgICAgICAvLyBkYXRhOiBsZWdlbmREYXRhLmNvbmNhdChzZWxlY3RBbGwpLFxuICAgICAgICAgICAgICAgIGRhdGE6IFtzZWxlY3RBbGxdLmNvbmNhdChsZWdlbmREYXRhKSxcbiAgICAgICAgICAgICAgICBzZWxlY3RlZDogZHluYW1pY1NlbGVjdGVkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeEF4aXM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnY2F0ZWdvcnknLFxuICAgICAgICAgICAgICAgIGJvdW5kYXJ5R2FwOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBkYXRhOiB4QXhpc0RhdGFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXJpZXM6IHNlcmllc0RhdGFcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcGFyYW0gY2VudHJlTmFtZUFyclxuICAgICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXREYXRhQnlDZW50cmVBcnJheShkYXRhLCBjZW50cmVOYW1lQXJyKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjZW50cmVOYW1lQXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGRhdGEubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YVtqXVsnQ2VudHJlJ10gPT09IGNlbnRyZU5hbWVBcnJbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goZGF0YVtqXSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHJldHVybnMge0FycmF5fVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldExldmVsc0luRGF0YShkYXRhKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocmVzdWx0LmluZGV4T2YoZGF0YVtpXVsnTGV2ZWwnXSkgPCAwKVxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGRhdGFbaV1bJ0xldmVsJ10pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHJldHVybnMge0FycmF5fVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldENlbnRyZXNJbkRhdGEoZGF0YSkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5pbmRleE9mKGRhdGFbaV1bJ0NlbnRyZSddKSA8IDApXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goZGF0YVtpXVsnQ2VudHJlJ10pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBhcnJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZVNjaG9vbFNlbGVjdChhcnIpIHtcbiAgICAgICAgbGV0IHN0cmluZyA9IFwiPG9wdGlvbiB2YWx1ZT0nYWxsJz5BbGw8L29wdGlvbj5cIjtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHN0cmluZyArPSBcIjxvcHRpb24gdmFsdWU9XFxcIlwiICsgYXJyW2ldICsgXCJcXFwiPlwiICsgYXJyW2ldICsgXCI8L29wdGlvbj5cIjtcbiAgICAgICAgfVxuXG4gICAgICAgICQoXCIjc2Nob29sLWxpc3RcIikuaHRtbChzdHJpbmcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGFyclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdlbmVyYXRlQ2VudHJlTGlzdChhcnIpIHtcbiAgICAgICAgbGV0IHN0cmluZyA9IFwiPGxpIGNsYXNzPSdjaGVja2VkJyB2YWx1ZT0nYWxsJz5BbGw8L2xpPlwiO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgc3RyaW5nICs9IFwiPGxpIGNsYXNzPSdjaGVja2VkJyB2YWx1ZT1cXFwiXCIgKyBhcnJbaV0gKyBcIlxcXCI+XCIgKyBhcnJbaV0gKyBcIjwvbGk+XCI7XG4gICAgICAgIH1cbiAgICAgICAgJChcIiNjZW50cmUtbGlzdFwiKS5odG1sKHN0cmluZyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZmlsdGVyRGF0YVxuICAgICAqIEBwYXJhbSBsZXZlbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldERhdGFCeUxldmVsKGZpbHRlckRhdGEsIGxldmVsKSB7XG4gICAgICAgIHJldHVybiBmaWx0ZXJEYXRhLmZpbHRlcihmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsWydMZXZlbCddID09PSBsZXZlbDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0UXVlcnlTdHJpbmcobmFtZSkge1xuICAgICAgICBsZXQgcmVnID0gbmV3IFJlZ0V4cChcIihefCYpXCIgKyBuYW1lICsgXCI9KFteJl0qKSgmfCQpXCIpO1xuICAgICAgICBsZXQgciA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc3Vic3RyKDEpLm1hdGNoKHJlZyk7XG4gICAgICAgIGlmIChyKXJldHVybiB1bmVzY2FwZShyWzJdKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG59KCk7Il19
