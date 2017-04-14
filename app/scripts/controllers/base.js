'use strict';

angular.module('andrular-js-quiz')
  .controller('BaseCtrl', ['$scope','_', function ($scope, _) {
    $scope.tasks = null;
    $scope.inverseArray = null;
    $scope.newTaskName = null;
    $scope.allSelected = false;
    $scope.isActiveList = true;

    $scope.activeTasks = [];
    $scope.doneTasks = [];

    $scope.$watch("isActiveList", function(){
      $scope.tasks = $scope.isActiveList ? $scope.activeTasks : $scope.doneTasks;
      $scope.inverseArray = $scope.isActiveList ? $scope.doneTasks : $scope.activeTasks;
    });

    $scope.addNewTask = function(){
      if($scope.newTaskName){
        $scope.tasks.push({
          selected: false,
          name: $scope.newTaskName
        });
        $scope.newTaskName = null;
      }
    };
    $scope.removeTask = function(taskForRemove){
      var index = _.indexOf($scope.tasks, taskForRemove);
      if(index >= 0){
        $scope.inverseArray.push.apply($scope.inverseArray, $scope.tasks.splice(index, 1));
      }
    };

    $scope.deleteAll = function(){
      $scope.inverseArray.push.apply($scope.inverseArray, $scope.tasks.splice(0,$scope.tasks.length));
    };
    $scope.deleteSelected = function(){
      $scope.inverseArray.push.apply($scope.inverseArray, _.remove($scope.tasks, function (task) {
        return task.selected;
      }));
    };
    $scope.selectAll = function(){
      _.forEach($scope.tasks, function (task) {
        task.selected = true;
      });
    };

  }]);