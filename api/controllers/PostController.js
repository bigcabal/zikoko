/**
 * PostController
 *
 * @description :: Server-side logic for managing a single post
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  single: function (req, res) {

    console.log("SINGLE POST ===================");

    const postSlug = req.params.slug;

    let data = {};
    data.currentUser = req.session.user;


    APIService.req({ path: `/posts?slug=${postSlug}` })
      .then((APIResponse) => {
        const post = APIResponse.data[0];
        console.log(post);
        data.title = MetaDataService.pageTitle(post.title);
        data.metaData = MetaDataService.pageMeta('post', post);
        return data.post = post;
      })
      .then(() => {
        if ( data.post.show_post_author ) {
          return APIService.req({ path: `/users?username=${data.post.author.username}`, user: req.session.user })
            .then((APIResponse) => {
            // @todo fix role
            //return data.post.author.role = RolesService.getHighestRole(users[0].roles)
            return data.post.author.role = 'Tingz Fam';
          })
        } else {
          return;
        }
      })
      .then(() => APIService.req({ path: '/posts?limit=4', session: req.session }))
      .then((APIResponse) => data.sidebarPosts = APIResponse.data)
      .then(() => res.view('post', data))
      .catch((err) => {
        "use strict";
        console.log("ERR", err);
        res.redirect('/?error=single')
      })

  },

  amp: function (req, res) {
    res.view('post-amp');
  },


  archived: function (req, res) {

    const archivedPostCategory = req.params.archived_category;
    const archivedPostSlug = req.params.archived_slug;
    const archivedPostUrl = `zikoko.com/${archivedPostCategory}/${archivedPostSlug}`;

    APIService.req({ path: `/posts?where={"old_url":{"contains":"${archivedPostUrl}"}}` })
      .then((APIResponse) => res.redirect(`/post/${APIResponse.data[0].slug}`))
      .catch(() => res.redirect('/?error=archived'))

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
      .catch((err) => res.redirect('/'))
  }

};
