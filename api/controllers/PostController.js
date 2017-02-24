/**
 * PostController
 *
 * @description :: Server-side logic for managing a single post
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  single: function (req, res) {

    console.log("===================");

    const postSlug = req.params.slug;

    let data = {};
    data.currentUser = req.session.user;

    APIService.request(`/posts?slug=${postSlug}`)
      .then((post) => {
        console.log(post);
        data.title = MetaDataService.pageTitle(post.title);
        data.metaData = MetaDataService.pageMeta('post', post);
        return data.post = post;
      })
      .then(() => APIService.request(`/users?username=${data.post.author.username}`))
      .then((users) => {
        // @todo fix role
        //return data.post.author.role = RolesService.getHighestRole(users[0].roles)
        return data.post.author.role = 'Tingz Fam';
      })
      .then(() => res.view('post', data))
      .catch((err) => {
        "use strict";
        console.log("ERR", err);
        res.redirect('/')
      })

  },

  amp: function (req, res) {
    res.view('post-amp');
  },

  instant_articles: function (req, res) {
    res.redirect('/');
  },

  like: function(req, res) {
    if ( !req.session.user ) res.redirect('/login');

    const postId = req.body.post_id;
    const like = {
      post: postId
    };

    APIService.authRequest(req.session.user.authorization, `/likes`, 'POST', like)
      .then(() => res.redirect('/'))
      .catch((err) => res.redirect('/?error=likePost'))
  },

  delete: function(req, res) {
    if ( !req.session.user ) res.redirect('/login');
    const postId = req.body.post_id;

    APIService.authRequest(req.session.user.authorization, `/posts/${postId}`, 'DELETE')
      .then(() => res.redirect('/'))
      .catch((err) => res.redirect('/?error=deletePost'))
  }

};
