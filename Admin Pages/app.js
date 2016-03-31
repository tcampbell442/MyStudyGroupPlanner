(function(){
  var app = angular.module('admin', []);

  app.controller('AdminController', function(){
    this.items = reports;
  });

  app.controller("PanelController", function(){
    this.tab = 1;

    this.selectTab = function(setTab){
      this.tab = setTab;
    };

    this.isSelected = function(checkTab){
      return this.tab === checkTab;
    };
  });

  app.controller("RoomController", function(){
    this.rooms = {};
  });

  app.controller("SearchUserController", function(){
    this.users = {};
  });

  var reports = [
  {
    code: "111",
    date: "mm/dd/yyyy",
  },

  {
    code: "222",
    date: "mm/dd/yyyy",
  },

  {
    code: "333",
    date: "mm/dd/yyyy",
  },

  {
    code: "444",
    date: "mm/dd/yyyy",
  }
];
})();