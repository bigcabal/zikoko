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

    APIService.req({ path: `/posts?slug=${postSlug}` })
      .then((post) => APIService.req({ path: `/posts/${post.id}`, user: req.session.user }))
      .then((post) => {
        console.log(post);
        data.title = MetaDataService.pageTitle(post.title);
        data.metaData = MetaDataService.pageMeta('post', post);
        return data.post = post;
      })
      .then(() => APIService.req({ path: `/users?username=${data.post.author.username}`, user: req.session.user }))
      .then((users) => {
        // @todo fix role
        //return data.post.author.role = RolesService.getHighestRole(users[0].roles)
        return data.post.author.role = 'Tingz Fam';
      })
      .then(() => APIService.req({ path: '/posts?limit=4', session: req.session }))
      .then((sidebarPosts) => data.sidebarPosts = sidebarPosts)
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



  like: function(req, res) {
    if ( !req.session.user ) res.redirect('/login');

    const postId = req.body.post_id;
    const postSlug = req.body.post_slug;

    const like = {
      post: postId
    };

    APIService.req({ path: '/likes', user: req.session.user, method: 'POST', data: like })
      .then(() => res.redirect(`/post/${postSlug}`))
      .catch((err) => res.redirect('/?error=likePost'))
  },

  delete: function(req, res) {
    if ( !req.session.user ) res.redirect('/login');
    const postId = req.body.post_id;

    APIService.req({ path: `/posts/${postId}`, user: req.session.user, method: 'DELETE' })
      .then(() => res.redirect('/'))
      .catch((err) => res.redirect('/?error=deletePost'))
  }

};
