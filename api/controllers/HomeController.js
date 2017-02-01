/**
 * HomeController
 *
 * @description :: Server-side logic for managing homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  index: function (req, res) {

    let data = {}


    APIService.get('/posts')
      .then((posts) => {
        console.log(posts);
        return data.posts = posts;
      })
      .then(() => {
        return APIService.get('/categories')
      })
      .then((categories) => {
        return data.categories = categories;
      })
      .then(() => {
        return APIService.get('/users')
      })
      .then((users) => {
        return data.users = users;
      })
      .then(() => {
        res.view('homepage', data);
      })
      .catch((err) => {
        console.log("error", err)
      })

  }

};

