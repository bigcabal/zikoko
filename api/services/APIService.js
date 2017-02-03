/**
 * APIService
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var https = require('https');

const config = {
  headers: {
    'Authorization': `Basic ${new Buffer(`${ process.env.AUTH_IDENTIFIER || sails.config.authorization.identifier }:${ process.env.AUTH_PASSWORD || sails.config.authorization.password }`).toString('base64')}`
  }
}

module.exports = {

  get: function (path) {
    return new Promise(function (resolve, reject) {
      let options = {
        host: sails.config.globals.API.host,
        port: 443,
        path: `${sails.config.globals.API.path}${path}`,
        method: 'GET',
        headers: config.headers
      }
      let newRequest = https.request(options, function (response) {
        let body = '';
        response.on('data', function (data) {
          data = data.toString();
          body += data;
        });
        response.on('end', function () {
          body = JSON.parse(body);
          resolve(body);
        });
      });
      newRequest.on('error', (e) => {
        console.error(e);
        reject(e);
      });
      newRequest.end();

    })


  }

};

