/**
 * CloudinaryService
 *
 */


var cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'big-cabal',
  api_key: '122125953429187',
  api_secret: 'F0lC8UhoJaGnJGDufpTSSp5hdgw'
});

module.exports = {

  upload: function (image) {
    return new Promise(function (resolve, reject) {
      var options = {
        resource_type: 'image',
        folder: 'zikoko-formation',
      };

      image.upload(function (err, uploadedFiles) {
        if (err) {
          reject();
        }
        else if (uploadedFiles.length < 1) {
          reject();
        }
        else {
          console.log("there were files");
          cloudinary.v2.uploader.upload(uploadedFiles[0].fd, options, (error, result) => {
            if (error) reject(error)
            resolve(result);
          });
        }



      });

    })
  }


};

