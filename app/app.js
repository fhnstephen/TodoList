/**
 * Created by FHNstephen on 2014/10/5 0005.
 */

angular.module('todoApp', ["ui.router"])
    .run(['$rootScope', '$state', '$stateParams',
        function ($rootScope, $state, $stateParams) {

            // It's very handy to add references to $state and $stateParams to the $rootScope
            // so that you can access them from any scope within your applications.For example,
            // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
            // to active whenever 'contacts.list' or one of its decendents is active.
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ])

    .controller('appController', ['$scope', function ($scope) {
        $scope.todos = [
            {
                title: 'example1',
                detail: 'just an example',
                showDetail: true,
                deadline: 'none'
            },
            {
                title: 'example2',
                detail: 'another example',
                showDetail: false,
                deadline: 'none'
            }
        ];
        $scope.changeDetailShowingStatus = function (todo) {
            todo.showDetail = !todo.showDetail;
        };
        $scope.deleteTodo = function (index) {
            $scope.todos.splice(index, 1);
            console.log(index);
        };
        $scope.addTodo = function (index) {
            var newTodo = {
                title: $scope.newTodoTitle,
                detail: $scope.newTodoDetail,
                showDetail: true,
                deadline: $scope.newTodoDeadline
            }
            $scope.todos.push(newTodo);
            $scope.newTodoTitle = "";
            $scope.newTodoDetail = "";
        }
    }])

    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");
        $stateProvider
            .state('home', {
                url: "/",
                templateUrl: "todo-list.html"
            })
            .state('about', {
                url: "/about",
                templateUrl: "about.html"
            })
            .state('contact', {
                url: "/contact",
                templateUrl: "contact.html"
            });
    });
