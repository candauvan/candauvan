angular.module('mainCtrl', [])

.controller('MainController', function ($scope, $location, $interval, Search, $mdDialog) {

	var vm = this;



	vm.transformChip =  transformChip;
  vm.tradeSelectionType = "broker";
  vm.searchText = "";
  vm.activateSearch = false;
	vm.listResult = [];
	vm.isSCount = 0
  vm.isSearch = true;
  vm.functionName = "";
	vm.ref = firebase.database().ref("customers");

  // Iterate every 100ms, non-stop and increment
  // the Determinate loader.
  $interval(function() {

    vm.determinateValue += 1;
    if (vm.determinateValue > 100) {
      vm.determinateValue = 30;
    }

  }, 100);

  vm.showAddCounterparty = function() {
    // Appending dialog to document.body to cover sidenav in docs app
    var parentEl = angular.element(document.body);
       $mdDialog.show({
         parent: parentEl,
         ok: "OK",
         template:
          '<md-dialog aria-label="dlg">'+
          ' <form ng-cloak>'+
          '   <md-toolbar>'+
          '     <div class="md-toolbar-tools">'+
          '       <h2>Create New Counterparty</h2>'+
          '       <span flex></span>'+
          '       <button class="md-icon-button md-button md-ink-ripple" type="button" ng-click="vm.closeDialog()">'+
          '       X'+
          '       </button>'+
          '     </div>'+
          '   </md-toolbar>'+
          '   <md-dialog-content>'+
          '     <div class="md-dialog-content">'+
          '       <md-input-container>'+
          '         <label>Counterparty ID</label>'+
          '         <input ng-model="vm.counterPartyId" type="text">'+
          '       </md-input-container>'+
          '       <md-input-container>'+
          '         <label>Description</label>'+
          '         <input ng-model="vm.counterPartyDesc" type="text">'+
          '       </md-input-container>'+
          '     </div>'+
          '     <section layout="row" layout-sm="column" layout-align="center center" layout-wrap>'+
          '       <md-button class="md-raised md-primary" ng-click="vm.addCounterParty()">Add</md-button>'+
          '     </section>'+
          '   </md-dialog-content>'+
          ' </form>'+
          '</md-dialog>',
         locals: {
           items: vm.chkSelected
         },
         controllerAs: 'vm',
         controller: DialogController
      });
  };

  vm.showAddBroker = function() {
    var parentEl = angular.element(document.body);
       $mdDialog.show({
         parent: parentEl,
         ok: "OK",
         template:
          '<md-dialog aria-label="dlg">'+
          ' <form ng-cloak>'+
          '   <md-toolbar>'+
          '     <div class="md-toolbar-tools">'+
          '       <h2>Create New Broker</h2>'+
          '       <span flex></span>'+
          '       <button class="md-icon-button md-button md-ink-ripple" type="button" ng-click="vm.closeDialog()">'+
          '       X'+
          '       </button>'+
          '     </div>'+
          '   </md-toolbar>'+
          '   <md-dialog-content>'+
          '     <div class="md-dialog-content">'+
          '       <md-input-container>'+
          '         <label>Broker ID</label>'+
          '         <input ng-model="vm.brokerId" type="text">'+
          '       </md-input-container>'+
          '       <md-input-container>'+
          '         <label>Description</label>'+
          '         <input ng-model="vm.brokerDesc" type="text">'+
          '       </md-input-container>'+
          '     </div>'+
          '     <section layout="row" layout-sm="column" layout-align="center center" layout-wrap>'+
          '       <md-button class="md-raised md-primary" ng-click="vm.addBroker()">Add</md-button>'+
          '     </section>'+
          '   </md-dialog-content>'+
          ' </form>'+
          '</md-dialog>',
         locals: {
           theScope: vm
         },
         controllerAs: 'vm',
         controller: DialogController
      });
  };

  vm.showAddTrade = function() {
    // Appending dialog to document.body to cover sidenav in docs app
    var parentEl = angular.element(document.body);
       $mdDialog.show({
         parent: parentEl,
         ok: "OK",
         template:
          '<md-dialog aria-label="dlg">'+
          ' <form ng-cloak>'+
          '   <md-toolbar>'+
          '     <div class="md-toolbar-tools">'+
          '       <h2>Thêm Khách Hàng Mới</h2>'+
          '       <span flex></span>'+
          '       <button class="md-icon-button md-button md-ink-ripple" type="button" ng-click="vm.closeDialog()">'+
          '       X'+
          '       </button>'+
          '     </div>'+
          '   </md-toolbar>'+
          '   <md-dialog-content>'+
          '     <div class="md-dialog-content">'+
          '       <md-input-container>'+
          '         <label>Tên KH</label>'+
          '         <input ng-model="vm.name" type="text">'+
          '       </md-input-container>'+
          '       <md-input-container>'+
          '         <label>Số Điện Thoại</label>'+
          '         <input ng-model="vm.phone" type="text">'+
          '       </md-input-container>'+
          '       <br/>'+
          '       <md-input-container>'+
          '         <label>Loại Hình Kinh Doanh</label>'+
          '         <input ng-model="vm.type" type="text">'+
          '       </md-input-container>'+
          '       <md-input-container>'+
          '         <label>Địa Chỉ</label>'+
          '         <input ng-model="vm.address" type="text">'+
          '       </md-input-container>'+
          '       <br/>'+
          '       <md-input-container>'+
          '         <label>Facebook</label>'+
          '         <input ng-model="vm.facebook" type="text">'+
          '       </md-input-container>'+
          '     </div>'+
          '     <section layout="row" layout-sm="column" layout-align="center center" layout-wrap>'+
          '       <md-button class="md-raised md-primary" ng-click="vm.addTrade()">Thêm</md-button>'+
          '     </section>'+
          '   </md-dialog-content>'+
          ' </form>'+
          '</md-dialog>',
         locals: {
           items: vm.chkSelected
         },
         controllerAs: 'vm',
         controller: DialogController
      });
  };

	vm.doSearch = function() {
		if (vm.isSCount == 0) {
			vm.activateSearch = true;
			vm.listResult = [];

			vm.ref.once('value',function (snapshot) {
				snapshot.forEach(function(childSnapshot) {
					vm.listResult.push(childSnapshot.val());
				});
				vm.listResult = vm.listResult.reverse();
				vm.activateSearch = false;
				vm.isSearched = true;
				vm.isSCount = 1;
			});

		}
	}

	vm.ref.orderByChild('timeStamp').on("child_added", function(snapshot, prevChildKey) {
  	var newPost = snapshot.val();
		vm.listResult.push(newPost);
	});

  function transformChip (chip) {
  	if (angular.isObject(chip)) {
      return chip;
    }
    // Otherwise, create a new one
    return { name: chip, type: 'new' }
  };

  function DialogController($scope, $mdDialog,$mdToast, Search) {

    var vm = this;

		vm.ref = firebase.database().ref('customers');

    var last = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };

    vm.toastPosition = angular.extend({},last);

    vm.closeDialog = function() {
      $mdDialog.hide();
    }

    vm.addBroker = function() {

      args = '{\"brokerID\": \"'+vm.brokerId+'\",\"desc\": \"'+vm.brokerDesc+'\"}';

      createData = {
        "jsonrpc": "2.0",
        "method": "invoke",
        "params": {
        "type": 1,
        "chaincodeID": {
          "name": "ccce3c6033aa8917918ebe89bef51e2a66d30268a7776f34e4b8d9974c712165871bca2e952e910b565d9218370543fca8129576a0d6268337dbc68a54b6c2b0"
        },
        "ctorMsg": {
          "function": "createBroker",
          "args": [args]
        },
        "secureContext": "<ENROLL_ID>"
        },
        "id": 1
      }

      Search.tradeMatchAPI(createData)
        .then(function (res) {
          var resData = res.data.result;
          if (res.data.result.status != undefined) {
            if (res.data.result.status == "OK") {
              showSimpleToast();
            }
          }
      });
      vm.closeDialog();
    }

    vm.addCounterParty = function() {

      args = '{\"counterpartyID\": \"'+vm.counterPartyId+'\",\"desc\": \"'+vm.counterPartyDesc+'\"}';

      createData = {
        "jsonrpc": "2.0",
        "method": "invoke",
        "params": {
        "type": 1,
        "chaincodeID": {
          "name": "ccce3c6033aa8917918ebe89bef51e2a66d30268a7776f34e4b8d9974c712165871bca2e952e910b565d9218370543fca8129576a0d6268337dbc68a54b6c2b0"
        },
        "ctorMsg": {
          "function": "createCounterparty",
          "args": [args]
        },
        "secureContext": "<ENROLL_ID>"
        },
        "id": 1
      }

      Search.tradeMatchAPI(createData)
        .then(function (res) {
          var resData = res.data.result;
          if (res.data.result.status != undefined) {
            if (res.data.result.status == "OK") {
              showSimpleToast();
            }
          }
      });
      vm.closeDialog();
    }

		vm.addTrade = function() {

			var postData = {
    		name: vm.name,
		    phone: vm.phone,
		    type: vm.type,
		    address: vm.address,
		    facebook: vm.facebook,
				timeStamp: new Date().getTime()
		  };

			// Get a key for a new Post.
  		var newPostKey = firebase.database().ref().child('customers').push().key;
			// Write the new post's data simultaneously in the posts list and the user's post list.
  		var updates = {};
  		updates['/customers/' + newPostKey] = postData;

			showSimpleToast();


  		return firebase.database().ref().update(updates).then(function() {
				console.log('zo zo man');
				vm.closeDialog();
				//vm.doSearch();
			});



    }

    function showSimpleToast() {
      var pinTo = getToastPosition();

      $mdToast.show(
        $mdToast.simple()
          .textContent('Create Successfull!')
          .position(pinTo )
          .hideDelay(3000)
      );
    };

    function getToastPosition() {
      sanitizePosition();
      return Object.keys(vm.toastPosition)
        .filter(function(pos) { return vm.toastPosition[pos]; })
        .join(' ');
    };

    function sanitizePosition() {
      var current = vm.toastPosition;

      if ( current.bottom && last.top ) current.top = false;
      if ( current.top && last.bottom ) current.bottom = false;
      if ( current.right && last.left ) current.left = false;
      if ( current.left && last.right ) current.right = false;

      last = angular.extend({},current);
    };

  };

})
