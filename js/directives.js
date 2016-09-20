'use strict';

/* Directives */
angular.module('iinvestorApp.directives', []).
directive('widgetcolumn', function(iinvestorService) {
    return {
        restrict: 'A',
        templateUrl : 'template/widgetColumn.html',
        controller: function ($scope) {
            $scope.$watch('widget.timePeriod', function (newValue, oldValue) {
                if(newValue !== oldValue) {
                    console.log($scope.widget, newValue, oldValue);
                    iinvestorService.getPrice($scope.widget).then(function(result) {
                        $scope.widget = result;
                    }, function(reason) {
                        console.log(reason);
                    });
                }
            }.bind(this));
        },
    };
});
