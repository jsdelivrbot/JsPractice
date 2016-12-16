/**
 * router.js
 *
 * Created by xiepan on 2016/11/25 下午4:22.
 */

(function () {

    var util = {
        getParamsUrl: function () {
            var hashDetail = location.hash.split('?'),
                hashName = hashDetail[0].split('#')[1],
                params = hashDetail[1] ? hashDetail[1].split('&') : [],
                query = {};

            for (var i = 0; i < params.length; i++) {
                var item = params[i].split('=');
            }
        }
    }
})();