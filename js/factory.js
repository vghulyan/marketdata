angular.module('iinvestorApp.factory', [])
    .factory('iinvestorService', ['$q', '$http', function($q, $http) {

        function getTimes() {
            return ['D','1M','1Y'];
        }
        // Ideally this should come from the backend (please note: 1 & 4 are the same === LSE:IBST)
        function getCompanyNames() {
            return [

                {key:'@GB:ASX',value:'GB Energy Ltd'},
                {key:'LSE:LLOY',value:'Lloyds Banking Group PLC'},
                {key:'LSE:BARC',value:'Barclays PLC'},

                //{key:'LSE:IBST',value:'Ibstock'},
                // {key:'LSE:RTN',value:'Restaurant Group PLC'},
                // {key:'LSE:PLP',value:'Polypipe Group'},
                // {key:'LSE:PAGE',value:'Pagegroup'},
                // {key:'LSE:FORT',value:'Lefort'},
                // {key:'LSE:ENQ',value:'Enquest'},
                // {key:'LSE:GMS',value:'Gulf Marine'},
                // {key:'LSE:OXB',value:'Oxford Biomedica'}
                ];
        }

        function getPrice(widget) {
            var defer = $q.defer();
            var market = getMarketValue(widget);
            var dataSet = null;
            $http.get('data/'+market+'_'+widget.timePeriod+'.json').then(function(result) {

                var highest = getHiegstLowest(true, result.data.history);
                var lowest = getHiegstLowest(false, result.data.history);
                dataSet = {key:widget.key,
                    investmentName:widget.investmentName,
                    high:highest,
                    low:lowest,
                    timePeriod:widget.timePeriod
                };

                defer.resolve(dataSet);
            });
            return defer.promise;
        }
        function getPrices(markets, timeCode) {
            var promises = markets.map(function(market) {
                var marketValue = market.key.substring(market.key.indexOf(':')+1, market.key.length);

                return $http({
                    url   : 'data/'+marketValue+'_d.json',
                    method: 'GET',
                    data  : market
                });

            });

            return $q.all(promises);
        }
        function getMarketValue(market) {
            return market.key.substring(market.key.indexOf(':')+1, market.key.length);
        }
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

        return {
            getCompanyNames: getCompanyNames,
            getTimes: getTimes,
            getPrices : getPrices,
            getPrice: getPrice,
        }

}]);