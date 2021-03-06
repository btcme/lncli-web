(function sendPayments() {
  module.exports = function controller($scope, $uibModalInstance, defaults, lncli) {
    const $ctrl = this;

    $ctrl.spinner = 0;

    $ctrl.values = defaults;
    $ctrl.decodedPayment = null;

    $ctrl.ok = () => {
      $ctrl.spinner += 1;
      lncli.sendPayment($ctrl.values.payreq, $ctrl.values.amount).then((response) => {
        $ctrl.spinner -= 1;
        console.log('SendPayment', response);
        if (response.data.error) {
          if ($ctrl.isClosed) {
            lncli.alert(response.data.error);
          } else {
            $ctrl.warning = response.data.error;
          }
        } else if (response.data.payment_error) {
          if ($ctrl.isClosed) {
            lncli.alert(response.data.payment_error);
          } else {
            $ctrl.warning = response.data.payment_error;
          }
        } else {
          $ctrl.warning = null;
          $uibModalInstance.close($ctrl.values);
        }
      }, (err) => {
        $ctrl.spinner -= 1;
        console.log(err);
        const errmsg = err.message || err.statusText;
        if ($ctrl.isClosed) {
          lncli.alert(errmsg);
        } else {
          $ctrl.warning = errmsg;
        }
      });
    };

    $ctrl.decode = () => {
      $ctrl.spinner += 1;
      lncli.decodePayReq($ctrl.values.payreq).then((response) => {
        $ctrl.spinner -= 1;
        console.log('DecodePayReq', response);
        if (response.data.error) {
          $ctrl.decodedPayment = null;
          if ($ctrl.isClosed) {
            lncli.alert(response.data.error);
          } else {
            $ctrl.warning = response.data.error;
          }
        } else {
          $ctrl.warning = null;
          $ctrl.decodedPayment = response.data;
        }
      }, (err) => {
        $ctrl.spinner -= 1;
        console.log(err);
        $ctrl.decodedPayment = null;
        const errmsg = err.message || err.statusText;
        if ($ctrl.isClosed) {
          lncli.alert(errmsg);
        } else {
          $ctrl.warning = errmsg;
        }
      });
    };

    $ctrl.cancel = () => {
      $uibModalInstance.dismiss('cancel');
    };

    $ctrl.dismissAlert = () => {
      $ctrl.warning = null;
    };

    $scope.$on('modal.closing', (event, reason, closed) => {
      console.log(`modal.closing: ${closed ? 'close' : 'dismiss'}(${reason})`);
      $ctrl.isClosed = true;
    });
  };
}());
