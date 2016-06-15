app.controller('IndexPageController', 
['$q', '$scope', 'transactionRepository', 'notifyService', ($q, $scope, transactionRepository, notify) => {
  
  $scope.transactions = [];
  
  // $scope.totalItems = 0;
  $scope.itemStart = 0;
  $scope.itemsShow = 5;
  $scope.activePage = 1;


  $scope.renderPage = function(page){
    $scope.activePage = page;
    $scope.itemStart = $scope.itemsShow * ($scope.activePage - 1);
    transactionRepository.readPage($scope.itemStart, $scope.itemsShow).then((res) => {
      $scope.transactions = res.results;
      $scope.totalItems = res.count;
      return res;
    });
  }

  $scope.renderPage($scope.activePage);

  
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