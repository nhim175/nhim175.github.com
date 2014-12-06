var app;

app = angular.module('app');

app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $disqusProvider) {
  $urlRouterProvider.otherwise("/blog");
  $locationProvider.hashPrefix('!');
  return $disqusProvider.setShortname('nhim175');
});

app.directive('markdown', function() {
  var config;
  return config = {
    restrict: 'E',
    scope: {
      content: '='
    },
    link: function(scope, elem, attrs) {
      return elem.html(markdown.toHTML(scope.content));
    }
  };
});

app.directive('moment', function() {
  var config;
  return config = {
    restrict: 'E',
    scope: {
      format: '=',
      time: '='
    },
    link: function(scope, elem, attrs) {
      return elem.html(moment(scope.time).format(scope.format));
    }
  };
});

app.factory('Category', [
  '$rootScope', function($rootScope) {
    var Category, CategoryCollection, categoryCollection, find, list;
    list = null;
    Category = Parse.Object.extend('Category');
    CategoryCollection = Parse.Collection.extend({
      model: Category
    });
    categoryCollection = new CategoryCollection;
    categoryCollection.comparator = function(c) {
      return c.get('id');
    };
    $rootScope.$on('category::fetched', function(event, data) {
      return list = data;
    });
    find = function(id) {
      var c, _i, _len, _ref;
      _ref = list.models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        if (c.id === id) {
          return c;
        }
      }
    };
    return {
      Object: Category,
      Collection: categoryCollection,
      find: find
    };
  }
]);

app.factory('Post', function() {
  var Post, PostCollection, find, postCollection, postQuery;
  Post = Parse.Object.extend('Post');
  PostCollection = Parse.Collection.extend({
    model: Post
  });
  postCollection = new PostCollection;
  postQuery = new Parse.Query(Post);
  postCollection.comparator = function(c) {
    return c.get('createdAt');
  };
  find = function(id) {
    return new Parse.Query(Post).get(id);
  };
  return {
    Object: Post,
    Collection: postCollection,
    Query: postQuery,
    find: find
  };
});

app.factory('User', function() {
  return Parse.User;
});

app.config(function($stateProvider, $urlRouterProvider) {
  return $stateProvider.state('admin', {
    url: '/admin',
    templateUrl: 'components/admin/admin.html',
    controller: 'AdminController'
  });
});

app.controller('AdminController', [
  '$scope', '$rootScope', '$state', 'Category', 'User', function($scope, $rootScope, $state, Category, User) {
    if (!User.current()) {
      $state.go('login');
    }
    return Category.Collection.fetch().then(function(collection) {
      $scope.category = collection;
      $rootScope.$broadcast('category::fetched', collection);
      return $scope.$apply();
    });
  }
]);

app.config(function($stateProvider, $urlRouterProvider) {
  return $stateProvider.state('index.category', {
    url: '/category/:id',
    templateUrl: 'components/post/post.grid.html',
    controller: 'CategoryController',
    resolve: {
      posts: function($stateParams, Post, Category) {
        return Post.Query.equalTo("category", Category.find($stateParams.id)).find();
      }
    }
  });
});

app.controller('CategoryController', [
  '$scope', '$state', 'Post', 'Category', 'posts', 'categories', function($scope, $state, Post, Category, posts, categories) {
    $scope.post = {
      models: posts
    };
    $scope.category = categories;
    $scope.getCategoryNameById = function(id) {
      return Category.find(id).get('name');
    };
    return $scope.getCategoryColorById = function(id) {
      return Category.find(id).get('color');
    };
  }
]);

app.config(function($stateProvider, $urlRouterProvider) {
  return $stateProvider.state('index', {
    abstract: true,
    templateUrl: 'components/home/home.html',
    controller: 'HomeController',
    resolve: {
      categories: function(Category) {
        return Category.Collection.fetch();
      }
    }
  });
});

app.controller('HomeController', [
  '$scope', '$rootScope', '$document', '$timeout', 'Category', 'categories', function($scope, $rootScope, $document, $timeout, Category, categories) {
    $scope.category = categories;
    $scope.offScreen = false;
    $rootScope.$broadcast('category::fetched', categories);
    $scope.toggleOffScreen = function() {
      $scope.offScreen = !$scope.offScreen;
      if ($scope.offScreen === true) {
        $timeout(function() {
          return $document.one('click', function(event) {
            $scope.offScreen = false;
            return $scope.$apply();
          });
        }, 0);
      }
      return false;
    };
    return FB.XFBML.parse();
  }
]);

app.config(function($stateProvider, $urlRouterProvider) {
  return $stateProvider.state('login', {
    templateUrl: 'components/login/login.html',
    controller: 'LoginController'
  });
});

app.controller('LoginController', [
  '$scope', '$rootScope', '$state', 'User', function($scope, $rootScope, $state, User) {
    return $scope.login = function() {
      return User.logIn($scope.username, $scope.password, {
        success: function(user) {
          return $state.go('admin');
        }
      });
    };
  }
]);

app.config(function($stateProvider, $urlRouterProvider) {
  return $stateProvider.state('admin.posts', {
    url: '/posts',
    templateUrl: 'components/post/post.admin.html',
    controller: 'PostController'
  }).state('admin.new-posts', {
    url: '/posts/new',
    templateUrl: 'components/post/post.new.html',
    controller: 'PostController'
  }).state('index.home', {
    url: '/blog',
    templateUrl: 'components/post/post.grid.html',
    controller: 'PostController'
  }).state('index.post', {
    url: '/post/:id',
    templateUrl: 'components/post/post.single.html',
    controller: 'SinglePostController',
    resolve: {
      post: function($stateParams, Post) {
        return Post.find($stateParams.id);
      }
    }
  });
});

app.controller('PostController', [
  '$scope', '$state', 'Post', 'Category', function($scope, $state, Post, Category) {
    Post.Collection.fetch().then(function(collection) {
      $scope.post = collection;
      return $scope.$apply();
    });
    $scope.create = function() {
      var post;
      post = new Post.Object;
      post.set('title', $scope.title);
      post.set('content', $scope.content);
      post.set('category', $scope.categoryId);
      return post.save().then(function(result) {
        return $state.go('admin.posts');
      });
    };
    $scope.getCategoryNameById = function(id) {
      return Category.find(id).get('name');
    };
    return $scope.getCategoryColorById = function(id) {
      return Category.find(id).get('color');
    };
  }
]);

app.controller('SinglePostController', [
  '$scope', '$stateParams', '$window', '$timeout', 'Post', 'Category', 'post', function($scope, $stateParams, $window, $timeout, Post, Category, post) {
    var $disqusResetTimeout;
    $scope.post = post;
    $scope.category = Category.find(post.get('category').id);
    $disqusResetTimeout = null;
    return $window.onresize = function() {
      if ($disqusResetTimeout) {
        $timeout.cancel($disqusResetTimeout);
      }
      return $disqusResetTimeout = $timeout(function() {
        console.log('resetting disqus');
        return DISQUS.reset({
          reload: true
        });
      }, 1000);
    };
  }
]);
