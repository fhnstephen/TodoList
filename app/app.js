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

    .controller('appController', ['$scope', '$http', function ($scope, $http) {
        $http.get('/get-todos').success(function(data) {
            $scope.todos = data;
            $scope.todos.forEach(function(data) {
                data.deadline = new Date(data.deadline);
            });
        });
        /*
        $scope.getTodos = function() {
            return [
                {
                    title : 'Todolist App',
                    detail : 'Finish todo list app',
                    deadline : new Date(2014, 9, 2),
                },
                {
                    title : 'Learn Node.js',
                    detail : 'Learn how to use node.js',
                    deadline : new Date(2014, 9, 1),
                }
            ];
        };
        $scope.todos = $scope.getTodos();*/
        $scope.deleteTodo = function (index) {
            $http.get("delete-todo", { params : {'index' : index}}).success(function() {
                $scope.todos.splice(index, 1);
            });
        };
        $scope.addTodo = function (newTodo) {
            var todo = {
                title : newTodo.title,
                detail : newTodo.detail,
                deadline : newTodo.deadline
            };
            console.log(todo);
            $http.get("/add-todo", { params : todo}).success(function() {
                $scope.todos.push(todo);
                newTodo.title = "";
                newTodo.detail = "";
                newTodo.deadline = "";
            });
        };
        $scope.edit = function() {
            $scope.$state.go('todos.detail.edit', $scope.$stateParams);
        };
        $scope.finishEdit = function(index, todo) {
            $http.get("/edit-todo", { params : { 'index' : index, 'todo' : todo}}).success(function () {
                $scope.$state.go('todos.detail.view', $scope.$stateParams);
            });
        };
    }])

    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/todos");
        $stateProvider
            .state('todos', {
                abstract: true,
                url: "/todos",
                templateUrl: "todos.html"
            })
            .state('todos.list', {
                url: "",
                templateUrl: "todo-list.html"
            })
            .state('todos.detail', {
                abstract: true,
                url: "/{itemId}",
                template: "<div ui-view></div>"
            })
            .state('todos.detail.view', {
                url: "",
                templateUrl:"todo-detail-view.html"
            })
            .state('todos.detail.edit', {
                templateUrl: 'todo-detail-edit.html'
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
