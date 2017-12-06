var app;
app = angular.module('app', []);
//使用mockjax方法覆盖Ajax请求
Mock.mockjax(app);
app.controller('appCtrl', function ($scope, $http) {
    var box;
    box = $scope.box = [];

    // 业务上正常请求ajax
    $scope.get = function () {
        $http({
            url: 'http://caiyichen.me',
            method: 'POST',
            params: {name: 1},
            data: {age: 24}
        }).success(function (data) {
            // console.log(111,data);
            return box.push(data);
        });
    };
});
