angular.module('iinvestorApp.controllers', []).
controller('pricesController', function($filter, iinvestorService) {
    var _this = this; //'http://www.iii.co.uk/iii-perfchart-data/LSE:BARC/D';

    _this.widgets = [];
    _this.getTimes = iinvestorService.getTimes();

    var timeCode = 'D';

    function getHiegstLowest(flag, records) {
        var result = null;
        angular.forEach(records, function(value) {
            if(flag && (null === result || value.high > result)) {
                result = value.high;
            }
            else if(!flag && (null === result || value.low < result)) {
                result = value.low;
            }
        });
        return result;
    }
    function init() {
        var markets = [];
        markets = iinvestorService.getCompanyNames();

        iinvestorService.getPrices(markets, timeCode).then(function(result) {
            angular.forEach(result, function(value, key) {
                var highest = getHiegstLowest(true, value.data.history);
                var lowest = getHiegstLowest(false, value.data.history);
                _this.widgets.push({key:markets[key].key,
                                    investmentName:markets[key].value,
                                    high:highest,
                                    low:lowest,
                                    timePeriod:value.data.period.id
                });
            })
        }, function(reason) {
            console.log(reason);
        });
    }
    init();

});