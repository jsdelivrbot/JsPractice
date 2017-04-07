/**
 * main.js
 *
 * Created by ice on 2017/4/6 上午11:13.
 */

!function () {

    let mainChart = echarts.init(document.getElementById('main'));
    let enquiryChart = echarts.init(document.getElementById('enquiry'));
    let enrolledChart = echarts.init(document.getElementById('enrolled'));
    let withdrawnChart = echarts.init(document.getElementById('withdrawn'));

    const baseOptions = {
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
    const host = 'http://analysis.bestyiwan.com/';
    const client = getQueryString('client') || 'GEH';
    const url = host + 'api/open/enrollment/statistics/?format=json&api_key=smYS9q9Hv9o7Ioek95Z7MFmuimoOsneuAMEWGtq3Uq6JYiRqyQBaOPSda3tZ06CaXznie6cdBbOI5tgpuyvxo9zEchp6sfGD3pKKkVl9gf6zkKD6CNq3WFV2IyVhAL8TVFoMsJgvKlTZAnVZz4htejJfkw4V54UVDxoTEgju3ivzpnzdl6jHcVj7ACnBatCPWDZlFXp9raEokOFFKtGZKvLhe9aG22F3MkDUhbfR2DypXhe6ZaT9hjvbL6BeDYf'
        + '&client=' + client;

    let date = new Date();
    let currentMonth = date.getMonth() + 1;
    let currentYear = date.getFullYear();

    const selectAll = 'Select All';
    let selectFlag = true;
    let dynamicSelected = {};
    let reqArr = [];

    for (let j = (currentMonth !== 12 ? currentMonth + 1 : 13); j < 13; j++) {
        reqArr.push($.get(url + `&month=${j}&year=${currentYear - 1}`))
        // console.log(url + `&month=${j}&year=${currentYear - 1}`)
    }
    for (let i = 1; i <= currentMonth; i++) {
        reqArr.push($.get(url + `&month=${i}&year=${currentYear}`))
        // console.log(url + `&month=${i}&year=${currentYear}`)
    }
    console.log('Request Array', reqArr);

    mainChart.showLoading();
    let startTime = +new Date();

    $.when(...reqArr).done(function (...data) {

        mainChart.hideLoading()
        // enquiryChart.hideLoading()
        let filterData = [];
        for (let i = 0; i < data.length; i++) {
            filterData.push(data[i][0])
        }
        let totalData = Array.prototype.concat.apply([], filterData);
        console.log('totalData', totalData)

        console.log('requestTime', +new Date() - startTime)

        // generateSchoolSelect
        let centreData;
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
                        $(this).removeClass('checked')
                    } else {
                        $(this).addClass('checked')
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
                $('li[value="all"]').addClass('checked')
            } else {
                $('li[value="all"]').removeClass('checked')
            }

            // 选择的学校
            let selectedCentres = [];
            $('.checked').each(function () {
                selectedCentres.push(($(this).attr('value')))
            });

            console.log('selectedCentres', selectedCentres)

            generateData(selectedCentres, totalData)

        })


    }).catch(function (error) {
        console.log(error);
        alert('Request error')
    });


    function generateData(centreNamesArr, totalData) {

        if (typeof centreNamesArr === 'string') {
            centreNamesArr = [centreNamesArr]
        }

        let filterData;
        if (centreNamesArr.length === 0) {
            filterData = [];
        } else if (centreNamesArr[0] === 'all') {
            filterData = totalData;
        } else {
            filterData = getDataByCentreArray(totalData, centreNamesArr)
        }

        console.log('filterData', filterData)
        console.log('filterData length', filterData.length)
        console.log('centreNamesArr length', centreNamesArr.length)

        let legendData = getLevelsInData(filterData)
        console.log('centreName：', centreNamesArr)
        console.log('level：', legendData)

        // 每个年级对应的数据之和 例: ['一年级'，10]
        let legendWithStudentCount = [], legendWithEnquiry = [], legendWithEnrolled = [], legendWithWithDrawn = [];

        // 遍历各个年级，寻找filterData中对应的年级
        for (let i = 0; i < legendData.length; i++) {
            let totalStudentCount = 0;
            let totalEnquiry = 0;
            let totalEnrolled = 0;
            let totalWithDrawn = 0;
            for (let j = 0; j < filterData.length; j++) {
                if (filterData[j]['Level'] === legendData[i]) {
                    totalStudentCount += filterData[j]['Student Count'];
                    totalEnquiry += filterData[j]['Enquiry'];
                    totalEnrolled += filterData[j]['Enrolled'];
                    totalWithDrawn += filterData[j]['Withdrawn'];
                }
            }
            legendWithStudentCount.push([legendData[i], totalStudentCount])
            legendWithEnquiry.push([legendData[i], totalEnquiry])
            legendWithEnrolled.push([legendData[i], totalEnrolled])
            legendWithWithDrawn.push([legendData[i], totalWithDrawn])
        }

        let xAxisData = [];
        let xData = [];
        let studentCountSeriesData = [], enquirySeriesData = [], enrolledSeriesData = [], withdrawnSeriesData = [];//图表4
        // 对年级循环,生成某一年级的数据
        for (let i = 0; i < legendData.length; i++) {
            var levelName = legendData[i];
            // 根据level年级筛选数据
            let dataFilterByLevel = getDataByLevel(filterData, levelName);
            // console.log(levelName, dataFilterByLevel);
            let studentCountArr = [], enquiryArr = [], enrolledArr = [], withdrawnArr = [];//线形图的数据[1,2,3...]

            // 此处的dataFilterByLevel是所有数据
            let temp = []; // 存储分组后的数组,按月份分成12组
            let t = dataFilterByLevel;
            let mod = 12;
            for (let i = 0; i < mod; i++) {
                temp.push(t.filter(function (item, index, arr) {
                    if ((index - i) % mod === 0)
                        return item;
                }));
            }
            for (let i = 0; i < temp.length; i++) {
                let studentCountTotalPerMonth = 0, enquiryTotalPerMonth = 0,
                    enrolledTotalPerMonth = 0, withdrawnTotalPerMonth = 0;
                for (let j = 0; j < temp[i].length; j++) {
                    studentCountTotalPerMonth += temp[i][j]['Student Count'];
                    enquiryTotalPerMonth += temp[i][j]['Enquiry'];
                    enrolledTotalPerMonth += temp[i][j]['Enrolled'];
                    withdrawnTotalPerMonth += temp[i][j]['Withdrawn']
                }
                studentCountArr.push(studentCountTotalPerMonth);
                enquiryArr.push(enquiryTotalPerMonth);
                enrolledArr.push(enrolledTotalPerMonth);
                withdrawnArr.push(withdrawnTotalPerMonth);
            }

            // 生成X轴
            for (let j = 0; j < dataFilterByLevel.length; j++) {
                xData.push(dataFilterByLevel[j]['Year'] + '-' + dataFilterByLevel[j]['Month']);
                xAxisData = Array.from(new Set(xData))
            }

            // 设置各个年级的线形图,也就是在一张图表中生成一条线
            console.log('studentCountArr', studentCountArr)
            studentCountSeriesData.push(getLineObj(studentCountArr, levelName));
            enquirySeriesData.push(getLineObj(enquiryArr, levelName));
            enrolledSeriesData.push(getLineObj(enrolledArr, levelName));
            withdrawnSeriesData.push(getLineObj(withdrawnArr, levelName));
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

        console.log(studentCountSeriesData)

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

            handleSelectAll(mainChart, getOption(legendData, xAxisData, studentCountSeriesData))
            handleSelectAll(enquiryChart, getOption(legendData, xAxisData, enquirySeriesData))
            handleSelectAll(enrolledChart, getOption(legendData, xAxisData, enrolledSeriesData))
            handleSelectAll(withdrawnChart, getOption(legendData, xAxisData, withdrawnSeriesData))
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
                for (let index in params.selected) {
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
        let pieData = [];
        for (let i = 0; i < data.length; i++) {
            pieData.push({value: data[i][1], name: data[i][0]})
        }
        return {
            type: 'pie',
            radius: [0, '20%'],
            center: ['18%', '50%'],
            data: pieData
        }
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
            data: arr,
            // markLine: {
            //     // silent: true,
            //     data: [{
            //         name: 'average',
            //         // 支持 'average', 'min', 'max'
            //         type: 'average'
            //     }]
            // }
        }
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
        }
    }

    /**
     *
     * @param data
     * @param centreNameArr
     * @returns {Array}
     */
    function getDataByCentreArray(data, centreNameArr) {
        let result = [];
        for (let i = 0; i < centreNameArr.length; i++) {
            for (let j = 0; j < data.length; j++) {
                if (data[j]['Centre'] === centreNameArr[i]) {
                    result.push(data[j])
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
        let result = [];
        for (let i = 0; i < data.length; i++) {
            if (result.indexOf(data[i]['Level']) < 0)
                result.push(data[i]['Level'])
        }
        return result;
    }

    /**
     *
     * @param data
     * @returns {Array}
     */
    function getCentresInData(data) {
        let result = [];
        for (let i = 0; i < data.length; i++) {
            if (result.indexOf(data[i]['Centre']) < 0)
                result.push(data[i]['Centre'])
        }
        return result;
    }

    /**
     *
     * @param arr
     */
    function generateSchoolSelect(arr) {
        let string = "<option value='all'>All</option>";
        for (let i = 0; i < arr.length; i++) {
            string += "<option value=\"" + arr[i] + "\">" + arr[i] + "</option>";
        }

        $("#school-list").html(string);
    }

    /**
     *
     * @param arr
     */
    function generateCentreList(arr) {
        let string = "<li class='checked' value='all'>All</li>";
        for (let i = 0; i < arr.length; i++) {
            string += "<li class='checked' value=\"" + arr[i] + "\">" + arr[i] + "</li>";
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
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        let r = window.location.search.substr(1).match(reg);
        if (r)return unescape(r[2]);
        return null;
    }

}();