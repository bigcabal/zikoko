/**
 * AuthService
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  createUser: function (newUser) {
    return new Promise(function (resolve, reject) {

      const options = {
        path: '/register',
        method: 'POST',
        data: newUser
      };

      APIService.req(options)
        .then((APIResponse) => resolve(APIResponse.data))
        .catch((err) => reject(err))

    })
  },

  signIn: function(login) {
    return new Promise(function (resolve, reject) {

      const options = {
        path: '/auth/local',
        method: 'POST',
        data: login
      };

      APIService.req(options)
        .then((APIResponse) => resolve(APIResponse.data))
        .catch((err) => reject(err))

    })

  }

};

