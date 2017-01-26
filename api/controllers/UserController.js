/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  index: function (req, res) {

    const userId = req.params.id;
    let data = {}

    APIService.get(`/users/${userId}`)
      .then((user) => {
        console.log(user);
        return data.user = user;
      })
      .then(() => {
        res.view('user', data);
      })

  }

};

