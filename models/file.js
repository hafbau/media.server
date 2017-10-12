/**
 *  File schema
 *
 *  Define File Model
 *  @param {Object} connected mongoose `db`
 *  @return {Object}
 **/

module.exports = function(db) {
  // get an instance of db and db.Schema
  const Schema = db.Schema;

  const FileSchema = new Schema({
    name: { type: String,  required: true },
    type: { type: {}, required: true },
    meta: {},
    size: { type: Number, required: true },
    createdAt: { type: Date, required: true, default: Date.now() },
    lastModified: { type: Date, required: true, default: Date.now() } // contrived?
  });

  // hooks
  

  // set up a db model and pass it using module.exports
  const File = db.model('File', FileSchema);
  // custom helpers
  
  return File 
};
