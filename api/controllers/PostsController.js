/**
 * PostsController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  index: function (req, res) {

    let data = {};
    data.feed = 'Everything';

    APIService.get('/posts?populate=[author]')
      .then((posts) => data.posts = posts)
      .then(() => APIService.get('/categories'))
      .then((categories) => data.categories = categories)
      .then(() => {
        res.view('posts', data);
      })
      .catch((err) => {
        console.log("error", err)
      })

  },

  category: function (req, res) {

    const categoryId = req.params.category_id;
    let data = {}

    APIService.get('/posts?populate=[author]')
      .then((posts) => data.posts = posts)
      .then(() => APIService.get('/categories'))
      .then((categories) => data.categories = categories)
      .then(() => {
        const category = data.categories.find((category) => { return category.id === categoryId });
        data.feed = category.name;
        res.view('posts', data);
      })
      .catch((err) => {
        console.log("error", err);
        res.redirect('/');
      })

  },

  search: function (req, res) {

    const term = req.param('term') || '';
    let data = {}

    APIService.get('/posts?populate=[author]')
      .then((posts) => data.posts = posts)
      .then(() => APIService.get('/categories'))
      .then((categories) => data.categories = categories)
      .then(() => {
        data.term = term;
        res.view('search', data);
      })
      .catch((err) => {
        console.log("error", err)
      })

  },


  single: function (req, res) {

    const postId = req.params.id;
    let data = {}

    APIService.get(`/posts/${postId}`)
      .then((post) => {
        console.log(post);
        return data.post = post;
      })
      .then(() => {
        res.view('post', data);
      })

  },

  amp: function (req, res) {
    "use strict";
    res.view('new-post');
  },

  instant_articles: function (req, res) {
    "use strict";
    res.view('new-post');
  }
}

;

