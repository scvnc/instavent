const 
  azure = require('azure-storage'),
  entGen = require('azure-storage').TableUtilities.entityGenerator,
  TABLE_NAME = 'mytable',
  PARTITION_NAME = 'default';

let tableSvcPromise;

function getTableSvc () {

  if (tableSvcPromise != null) {
    return tableSvcPromise;
  }
  

  tableSvcPromise = new Promise ((res, rej) => {
    
    var tableSvc = azure.createTableService();

    tableSvc.createTableIfNotExists(TABLE_NAME, error => {
      if (error) {
        return rej(error);
      } else {
        return res(tableSvc);
      }
    });
    
  });

  return tableSvcPromise;
}

function put (id, object) {
        
    
  const entity = {
    PartitionKey: entGen.String(PARTITION_NAME),
    RowKey: entGen.String(id),
    json: entGen.String(JSON.stringify(object))
  };

  return getTableSvc()
    .then(tableSvc => new Promise((res, rej) => {
      
      tableSvc.insertOrReplaceEntity(TABLE_NAME, entity, function (error) {
        
        if (error) {
          
          return rej(error);
        }
        
        return res();
      });

    }));

}

function get (id) {

  return getTableSvc()
    .then(tableSvc => new Promise((res, rej) => {

      tableSvc
        .retrieveEntity(TABLE_NAME, PARTITION_NAME, id, (error, result) => {
          
          if (error) {
            return rej(error)
          }

          return res(JSON.parse(result.json._));
        })
      
    }));
}


module.exports = {
  getTableSvc,
  put,
  get
};
