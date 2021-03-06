/**
 * This file contains all necessary Angular controller definitions for 'frontend.admin.login-history' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function() {
  'use strict';

  angular.module('frontend.admin.users')
    .controller('UserController', [
      '_','$scope','$q','$log','UserService','MessageService','$state','DialogService','UserModel','_user',
      function controller(_,$scope,$q,$log, UserService, MessageService,$state,DialogService,UserModel,_user ) {

          // Set current scope reference to models
          UserModel.setScope($scope, 'user');

          // Expose necessary data
          $scope.user = _user;
          initUserPassports()
          $scope.authUser = UserService.user();

          // User delete dialog buttons configuration
          $scope.confirmButtonsDelete = {
              ok: {
                  label: 'Delete',
                  className: 'btn-danger btn-link',
                  callback: function callback() {
                      $scope.deleteUser();
                  }
              },
              cancel: {
                  label: 'Cancel',
                  className: 'btn-default btn-link'
              }
          };

          // Scope function to save modified user.
          $scope.saveUser = function saveUser() {

              var data = angular.copy($scope.user);

              // Make actual data update
              var deferred = $q.defer();
              UserModel
                  .update(data.id, data)
                  .then(
                      function onSuccess() {
                          $scope.showForm = false;
                          MessageService.success('User "' + $scope.user.username + '" updated successfully');
                          initUserPassports()
                          deferred.resolve(true);
                      },function(err){
                          UserModel.handleError($scope,err)
                          deferred.reject('Error');
                      }
                  );

              return deferred.promise;
          };

          // Scope function to delete user
          $scope.deleteUser = function deleteUser() {
              UserModel
                  .delete($scope.user.id)
                  .then(
                      function onSuccess() {
                          MessageService.success('User "' + $scope.user.username + '" deleted successfully');
                          $state.go('admin.users');
                      }
                  )
              ;
          };

          $scope.cancelEditing = function() {
              $scope.editableForm.$cancel()
              initUserPassports()
          }

          function initUserPassports() {
              $scope.user.passports = {
                  password : "",
                  protocol : 'local'
              }
              $scope.user.password_confirmation = undefined
          }

      }
    ])
  ;
}());
