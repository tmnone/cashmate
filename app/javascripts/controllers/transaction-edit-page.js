app.controller('TransactionEditPageController', 
['$scope', '$routeParams', 'transactionRepository', 'TransactionMapper', 'notifyService',
($scope, $routeParams, transactionRepository, TransactionMapper, notify) => {

  transactionRepository.read($routeParams.id).then((res) => {
    $scope.transaction = res.results[0];
    $scope.copyData();
  });

  $scope.copyData = () => {
    $scope.editable = TransactionMapper.load({
      objectId: $scope.transaction.objectId,
      value: $scope.transaction.value,
      labels: $scope.transaction.labels,
      note: $scope.transaction.note
    })
  }

  $scope.updateTransaction = () => {

    transactionRepository.updateTransaction($scope.editable).then((res) => {
      notify.add('success', 'Transaction successfully updated!', 5000);
    });
  }

  $scope.reset = () => {
    $scope.copyData();
  }
  
}]);
