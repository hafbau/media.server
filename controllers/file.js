const fs = require('fs');
const path = require('path');
const { contentDisposition } = require('../utils');
const FILES_PATH = path.join(__this_basedir, 'files');

module.exports = ({ File }, render) => {
  return {

    getFile: async (ctx) => {
      try {
        const { params: { _id } } = ctx;        
        const file = await File.findOne({ _id });
        
        if (file) {
          ctx.set({
            'Content-Type': file.type,
            'Content-Disposition': contentDisposition(file.type, file.name)
          });
          
          const fileStream = fs.createReadStream(path.join(FILES_PATH, String(file._id)));
          ctx.status = 200;

          return ctx.body = fileStream;
        }
        // no file
        throw new Error();
      }
      catch(err) {
        ctx.status = 404;
        return ctx.body = {
          success: false,
          message: 'File Not Found',
          fullMessage: err.message
        };

      }
    },

    postFiles: async (ctx) => {
      try {
        let { request: { body: { files } } } = ctx;
        files = files ? files : ctx.request.files;
        ctx.assert(files && Object.keys(files).length, 400, 'No files found in request')
        // this due to non-form files
        if (typeof files === 'string') files = JSON.parse(files)    
        const createdFiles = await Promise.all(
          Object.keys(files).map((fieldName) => {
            const file = files[fieldName]

            const createdFile = new File({
              name: file.name,
              type: file.type,
              size: file.size,
              lastModified: file.lastModified
            })
            // console.log('createdFile', createdFile)
            return createdFile.save()
              .then(savedFile => {
                return new Promise(function (resolve, reject) {
                  fs.createReadStream(file.path)
                    .once("end", _ => fs.unlink(file.path, _ => null))
                    .pipe(fs.createWriteStream(path.join(FILES_PATH, String(createdFile._id)))
                    .once("error", reject)
                    .once("close", () => resolve(savedFile))
                  );
                });
              });
          })
        );
        
        if (createdFiles && createdFiles.length) {
          ctx.status = 200;
          return ctx.body = {
            success: true,
            files: createdFiles.map(file => file._id)
          };
        }
        // no createdFiles or is empty
        throw new Error();
      }
      catch (err) {
        ctx.status = 400;
        return ctx.body = {
          success: false,
          message: 'File upload failed',
          fullMessage: err.message
        };

      }
    }
  }
}
