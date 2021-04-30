'use strict';

// const DataContract = require('./lib/data/data-contract');
// const ProcessorContract = require('./lib/processor/processor-contract');
// const OperationContract = require('./lib/operation/operation-contract');
// const ProcessRequestContract = require('./lib/process-request/process-request-contract');
const AccountContract = require('./lib/account/account-contract');
const BiocoinContract = require('./lib/biocoin/biocoin-contract');
const OperationPaymentContract = require('./lib/operation-payment/operation-payment-contract');


// module.exports.DataContract = DataContract;
// module.exports.ProcessRequestContract = ProcessRequestContract;
// module.exports.ProcessorContract = ProcessorContract;
// module.exports.OperationContract = OperationContract;
module.exports.AccountContract = AccountContract;
module.exports.BiocoinContract = BiocoinContract;
module.exports.OperationPaymentContract = OperationPaymentContract;

module.exports.contracts = [ AccountContract, BiocoinContract, OperationPaymentContract ];
