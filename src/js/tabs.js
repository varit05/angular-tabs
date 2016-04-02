angular.module('tabs', [])
    .component('tabs', {
        templateUrl: 'tabs/html/tabs.html',
        controller: tabsCtrl
    })
    .component('tab', {
        require: '^tabs',
        bindings: {
            name: '='
        },
        link: function ($scope, $element, $attr, tabsCtrl) {
            $scope.$evalAsync(function () {
                tabsCtrl.addTab($scope.name, $element.html());
                $element.remove();
            });
        }
    });

function tabsCtrl($scope) {
    $scope.tabs = [];
    $scope.selected = 0;

    this.addTab = function (title, content) {
        $scope.tabs.push({title: title, content: content});
    };

    $scope.toggleTab = function (index) {
        $scope.selected = index;

        angular.forEach($scope.tabs, function (tab) {
            tab.selected = false;
        });

        $scope.tabs[index].selected = true;
    };
}