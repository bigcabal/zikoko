/**
 * APIService
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var https = require('https');
var isJSON = require('is-json');

module.exports = {

  // Generic request
  req: function(options) {
    return new Promise(function(resolve, reject) {

      const user = options.user || null;
      const path = options.path;
      const method = options.method ? options.method.toUpperCase() : 'GET';
      const data = options.data || null;
      const saveDataToSession = options.session || false;

      const requestOptions = {
        host: sails.config.API.host,
        port: 443,
        path: `${sails.config.API.path}${path}`,
        method: method
      }
      if (user) requestOptions.headers = {'Authorization': `Basic ${user.authorization}`}


      if ( saveDataToSession ) {

        options.session.temporaryStorage = options.session.temporaryStorage || {};

        if ( options.session.temporaryStorage[path] ) {
          console.log(`FOUND RESULT TO "${path}" IN TEMPORARYSTORAGE`);
          resolve(options.session.temporaryStorage[path])
        } else {
          httpRequest(method, requestOptions, data, options.session)
            .then((response) => resolve(response))
            .catch((err) => reject(err));
        }

      } else {
        httpRequest(method, requestOptions, data)
          .then((response) => resolve(response))
          .catch((err) => reject(err));
      }


    }) // end Promise
  },


  // Repeated requests

  posts: {

    getSidebarPosts: function() {
      "use strict";

    }

  }


};


function httpRequest(method, requestOptions, data, session) {
  return new Promise((resolve, reject) => {
    let newRequest = https.request(requestOptions, function (response) {
      let body = '';
      response.on('data', function (data) {
        data = data.toString();
        body += data;
      });
      response.on('end', function () {

        if (isJSON(body)) {
          body = JSON.parse(body);
          if ( session ) {
            const path = requestOptions.path.split(sails.config.globals.API.path)[1];
            session.temporaryStorage[path] = body;
          }
          resolve(body);
        } else if (body == '[]') {
          resolve([]);
        } else {
          console.log("IS NOT JSON =====")
          console.log(body);
          reject(body);
        }

      });
    });
    newRequest.on('error', (e) => {
      console.error(e);
      reject(e);
    });

    if (method === 'POST' | method === 'PUT') {
      newRequest.write(JSON.stringify(data));
    }

    newRequest.end();
  })
}

