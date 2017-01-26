/**
 * APIService
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var https = require('https');

const config = {
  host: 'formation-api.herokuapp.com',
  path: '/api',
  headers: {
    'Authorization': sails.config.authorization
  }
}

module.exports = {

  get: function (path) {
    return new Promise(function (resolve, reject) {
      let options = {
        host: config.host,
        port: 443,
        path: `${config.path}${path}`,
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

