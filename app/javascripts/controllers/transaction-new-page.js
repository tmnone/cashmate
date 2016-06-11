app.controller('TransactionNewPageController', 
['$scope', 'transactionRepository', 'TransactionMapper', 'notifyService', ($scope, transactionRepository, TransactionMapper, notify) => {

  $scope.newTransaction = TransactionMapper.load();
  
  $scope.addTransaction = () => {
    $scope.newTransaction.date = new Date();
    transactionRepository.addTransaction($scope.newTransaction).then(
      function(res) {
        notify.add('success', 'New transaction successfully added!', 5000);
        $scope.newTransaction = TransactionMapper.load();
      },
      function(reason) {
        notify.add('danger', reason.data.error);
      }
    );
  }
}]);
