app.controller('IndexPageController', 
['$scope', 'transactionRepository', 'notifyService', ($scope, transactionRepository, notify) => {
  $scope.transactions = [];
  transactionRepository.readAll().then((res) => {
    $scope.transactions = res.results;
  });
  
  $scope.updateLabel = function(transaction, editData){
    transaction.labels = editData;
    transactionRepository.updateTransactionLabel(transaction).then((res) => {
      notify.add('success', 'Transaction LABELS successfully updated!', 2500);
    });
  };

  $scope.updateValue = function(transaction, editData){
    transaction.value = editData;
    transactionRepository.updateTransactionValue(transaction).then((res) => {
      notify.add('success', 'Transaction VALUE successfully updated!', 2500);
    });
  };

  $scope.updateNote = function(transaction, editData){
    transaction.note = editData;
    transactionRepository.updateTransactionNote(transaction).then((res) => {
      notify.add('success', 'Transaction NOTE successfully updated!', 2500);
    });
  }
}]);