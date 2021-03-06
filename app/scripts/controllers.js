'use strict';

angular.module('confusionApp')

.controller('MenuController', ['$scope', 'menuFactory', function ($scope, menuFactory) {

  $scope.tab = 1;
  $scope.filtText = '';
  $scope.showDetails = false;

  $scope.showMenu = false;
  $scope.message = "Loading ...";
  menuFactory.getDishes().query(
    function (response) {
      $scope.dishes = response;
      $scope.showMenu = true;
    },
    function (response) {
      $scope.message = "Error: " + response.status + " " + response.statusText;
    });

  $scope.select = function (setTab) {
    $scope.tab = setTab;

    if (setTab === 2) {
      $scope.filtText = "appetizer";
    } else if (setTab === 3) {
      $scope.filtText = "mains";
    } else if (setTab === 4) {
      $scope.filtText = "dessert";
    } else {
      $scope.filtText = "";
    }
  };

  $scope.isSelected = function (checkTab) {
    return ($scope.tab === checkTab);
  };

  $scope.toggleDetails = function () {
    $scope.showDetails = !$scope.showDetails;
  };
}])

.controller('ContactController', ['$scope', function ($scope) {

  $scope.feedback = {
    mychannel: "",
    firstName: "",
    lastName: "",
    agree: false,
    email: ""
  };

  var channels = [{
    value: "tel",
    label: "Tel."
  }, {
    value: "Email",
    label: "Email"
  }];

  $scope.channels = channels;
  $scope.invalidChannelSelection = false;

}])

.controller('FeedbackController', ['$scope', 'feedbackFactory', function ($scope, feedbackFactory) {

  $scope.sendFeedback = function () {

    console.log($scope.feedback);

    if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
      $scope.invalidChannelSelection = true;
      console.log('incorrect');
    } else {
      $scope.invalidChannelSelection = false;
      feedbackFactory.getFeedback().save($scope.feedback);

      $scope.feedback = {
        mychannel: "",
        firstName: "",
        lastName: "",
        agree: false,
        email: ""
      };
      
      $scope.feedback.mychannel = "";
      $scope.feedbackForm.$setPristine();
    }
  };
}])

.controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function ($scope, $stateParams, menuFactory) {
  $scope.showDish = false;
  $scope.message = "Loading ...";
  $scope.dish = menuFactory.getDishes().get({
      id: parseInt($stateParams.id, 10)
    })
    .$promise.then(
      function (response) {
        $scope.dish = response;
        $scope.showDish = true;
      },
      function (response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
      }
    );
}])

.controller('DishCommentController', ['$scope', 'menuFactory', function ($scope, menuFactory) {

  var feedback = {
    rating: 5,
    comment: "",
    author: "",
    date: ""
  };

  $scope.feedback = feedback;

  $scope.submitComment = function () {
    $scope.feedback.date = new Date().toISOString();
    // console.log($scope.feedback);
    $scope.dish.comments.push($scope.feedback);

    menuFactory.getDishes().update({
      id: $scope.dish.id
    }, $scope.dish);
    $scope.commentForm.$setPristine();
    $scope.feedback = {
      rating: 5,
      comment: "",
      author: "",
      date: ""
    };
  };

}])

.controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', function ($scope, menuFactory, corporateFactory) {

  $scope.showDish = false;
  $scope.showSpecialist = false;
  $scope.showPromotions = false;

  $scope.message = "Loading ...";
  $scope.specialistMessage = "Loading ...";
  $scope.promotionsMessage = "Loading ...";

  $scope.featuredDish = menuFactory.getDishes().get({
      id: 0
    })
    .$promise.then(
      function (response) {
        $scope.featuredDish = response;
        $scope.showDish = true;
      },
      function (response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
      }
    );

  $scope.specialist = corporateFactory.getLeaders().get({
      id: 0
    })
    .$promise.then(
      function (response) {
        // success
        $scope.specialist = response;
        $scope.showSpecialist = true;
      },
      function (response) {
        // fail
        $scope.specialistMessage = "Error: " + response.status + " " + response.statusText;
      }
    );

  $scope.promotions = menuFactory.getPromotions().query()
    .$promise.then(
      function (response) {
        // success
        $scope.promotions = response;
        $scope.showPromotions = true;
      },
      function (response) {
        // fail
        $scope.promotionsMessage = "Error: " + response.status + " " + response.statusText;
      }
    );

}])

.controller('AboutController', ['$scope', 'corporateFactory', function ($scope, corporateFactory) {
  $scope.showLeadership = false;
  $scope.message = "Loading ...";

  $scope.leadership = corporateFactory.getLeaders().query().$promise.then(
    function (response) {
      // success
      $scope.leadership = response;
      $scope.showLeadership = true;
    },
    function (response) {
      // fail
      $scope.message = "Error: " + response.status + " " + response.statusText;
    }
  );
}]);