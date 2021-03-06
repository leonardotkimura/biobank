const DataContract = require('../contract/dataContract');
const ProcessRequestContract = require('../contract/processRequestContract');
const DnaContractContract = require('../contract/dnaContractContract');
const ControllerUtil = require('./ControllerUtil.js');

exports.index = async function(req, res, next){
  const dataContract = new DataContract();
  const datas = await dataContract.getAllData();

  const formattedDatas = datas.map(function(data){
    return {
      id: data.id,
      type: ControllerUtil.formatDataType(data.type),
      title: data.title,
      description: data.description,
      collector: data.collector,
      created_at: ControllerUtil.formatDate(new Date(data.created_at)),
      price: data.price
    }
  })

  res.render('data/index', { datas: formattedDatas });
};


exports.newRawData = async function(req, res, next){
  res.render('data/raw-data-new', { });
};

exports.createRawData = async function(req, res, next){
  let rawData = createRawDataFromRequest(req);
  const dataContract = new DataContract();
  await dataContract.createRawData(rawData)
  res.redirect("/data/" + rawData.id)
};

exports.newProcessedData = async function(req, res, next){
  res.render('data/processed-data-new', { });
};

exports.createProcessedData = async function(req, res, next){
  let processedData = createProcessedDataFromRequest(req);
  const dataContract = new DataContract();
  await dataContract.createProcessedData(processedData);
  if(req.body.process_request_id) {
    await updateProcessRequestAndRawData(req.body.process_request_id, processedData);
  }
  res.redirect("/data/" + processedData.id)
};

exports.show = async function(req, res, next){
  const dataId = req.params.dataId;
  const dataContract = new DataContract();
  const data = await dataContract.readData(dataId);
  const dnaContract = await getDnaContract(data.id)

  data.type = ControllerUtil.formatDataType(data.type);
  data.status = ControllerUtil.formatDataStatus(data.status);
  data.created_at = ControllerUtil.formatDate(new Date(data.created_at));

  res.render('data/show', { data, dnaContract });
};

exports.listOperations = async function(req, res, next){
  const dataId = req.params.dataId;
  const dataContract = new DataContract();
  const data = await dataContract.readData(dataId);
  const operations = await dataContract.getAllOperation(req.params.dataId);

  const formattedOperations = operations.map(function(operation){
    return {
      userAddress: operation.userAddress,
      id: operation.id,
      type: ControllerUtil.formatOperationType(operation.type),
      created_at: ControllerUtil.formatDate(new Date(operation.created_at)),
    }
  })

  res.render('data/list-operations', { data, operations: formattedOperations });
};

function createRawDataFromRequest(req){
  return {
    type : 'raw_data',
    id: ControllerUtil.getHashFromMagneticLink(req.body.magnet_link),
    title: req.body.name,
    status: 'unprocessed',
    magnet_link: req.body.magnet_link,
    description: req.body.description,
    created_at: new Date().toDateString()
  }
}

function createProcessedDataFromRequest(req){
  return {
    type : 'processed_data',
    id: ControllerUtil.getHashFromMagneticLink(req.body.magnet_link),
    title: req.body.name,
    status: 'processed',
    magnet_link: req.body.magnet_link,
    description: req.body.description,
    created_at: new Date().toDateString(),
    process_request_id: req.body.process_request_id
  }
}

async function updateProcessRequestAndRawData(processRequestId, processedData){
  const processRequestContract = new ProcessRequestContract()
  const dataContract = new DataContract();
  let processRequest = await processRequestContract.readProcessRequest(processRequestId);
  processRequest.status = 'processed';
  processRequest.processed_data_id = processedData.id;
  await processRequestContract.updateProcessRequest(processRequest);

  let rawData = await dataContract.readData(processRequest.raw_data_id);
  rawData.status = 'processed';
  await dataContract.updateData(rawData);
}

async function getDnaContract(dnaId){
  const dnaContractId = ControllerUtil.getHash(dnaId)
  const dnaContractContract = new DnaContractContract();
  return await dnaContractContract.readDnaContract(dnaContractId)
}

