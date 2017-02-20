/**
 * PostsController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  list: function (req, res) {

    const categorySlug = req.params.category_slug || null;

    let data = {};
    data.order = req.param('order') || 'latest';
    data.feed = categorySlug ? null : 'Everything';
    data.currentUser = req.session.user;
    data.title = MetaDataService.pageTitle();
    data.metaData = MetaDataService.metaData();

    let query = '/posts?sort=publishedAt%20DESC';

    APIService.request('/categories')
      .then((categories) => data.categories = categories)
      .then(() => {
        if ( data.feed === 'Everything' ) return Promise.resolve();
        const category = data.categories.find((category) => { return category.slug === categorySlug });
        console.log(category)
        query = `/categories/${category.id}/populatedposts`;
        data.title = MetaDataService.pageTitle(category.name);
        data.metaData = MetaDataService.metaData(`Posts in ${data.feed} Category`, null, null, `/category/${categorySlug}`);
        return data.feed = category.name;
      })
      .then(() => APIService.request(query))
      .then((posts) => data.posts = posts)
      .then(() => res.view('posts', data))
      .catch((err) => {
        console.log(err);
        res.redirect('/');
      });

  },

  search: function (req, res) {

    const term = req.param('term') || null;
    if ( !term ) res.redirect('/');

    let data = {};
    data.term = term;
    data.currentUser = req.session.user;
    data.title = MetaDataService.pageTitle(`Search Results for "${term}"`);
    data.metaData = MetaDataService.metaData(`Search Results for ${term}`, null, null, null);

    const query = `/posts?where={"title":{"contains":"${term}"}}`;

    APIService.request(query)
      .then((posts) => data.posts = [posts] /* @todo Error here, returning a single post */)
      .then(() => APIService.request('/categories'))
      .then((categories) => data.categories = categories)
      .then(() => {
        console.log(data.posts);
        res.view('search', data)
      })
      .catch(() => res.redirect('/'))

  },

  single: function (req, res) {

    console.log("===================");

    const postSlug = req.params.slug;

    let data = {};
    data.currentUser = req.session.user;

    APIService.request(`/posts?slug=${postSlug}`)
      .then((post) => {
        console.log(post);
        data.title = MetaDataService.pageTitle(post.title);
        console.log(post.sharing);
        data.metaData = MetaDataService.metaData(post.sharing.title, post.sharing.subtitle, post.sharing.imageUrl, `/post/${post.slug}`);
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

  likePost: function(req, res) {
    if ( !req.session.user ) res.redirect('/login');

    // @todo like Post

    const userId = req.session.user.id;
    const postId = req.body.post_id;

    res.redirect(`/post/${postId}`);

  },



  create: function (req, res) {
    if ( !req.session.user ) res.redirect('/login');

    function handleError() {
      res.redirect('/new?error')
    }

    function handleSuccess(newPost) {
      console.log(newPost);
      res.redirect(`/post/${newPost.slug}`)
    }

    let post;
    CloudinaryService.upload( req.file('postImage') )
      .then((result) => {
        console.log(result);
        return result.secure_url;
      })
      .then((imageUrl) => setupPost(req.body, imageUrl))
      .then((newPost) => post = newPost)
      .then(() => createTags(post.tags))
      .then((tags) => post.tags = tags)
      .then(() => APIService.authRequest(req.session.user.authorization, '/posts', 'post', post))
      .then((newPost) => handleSuccess(newPost))
      .catch(() => handleError())

  },
  createView: function(req, res) {
    if ( !req.session.user ) res.redirect('/login');
    let data = { currentUser: req.session.user };
    data.title = MetaDataService.pageTitle('Upload');
    data.metaData = MetaDataService.metaData();
    res.view('new', data);
  },

  amp: function (req, res) {
    res.view('post-amp');
  },

  instant_articles: function (req, res) {
    res.redirect('/');
  }

};


function createTags(tagList) {

  console.log("createTags()");

  if (!tagList || tagList == '') return Promise.resolve([]);

  const tags = tagList.split(' ');
  const final = [];

  let sequence = Promise.resolve();

  for ( let i = 0; i < tags.length; i++ ) {
    const tag = tags[i].split('#')[1];
    if ( tag ) {
      sequence = sequence.then(() => {
        return TagsService.create(tag)
          .then((newTag) => { return final.push({ name: newTag.name, id: newTag.id }) })
      })
    }
  }

  sequence = sequence.then(() => Promise.resolve(final));
  return sequence;
}


function setupPost(postDetails, imageUrl) {

  const image = imageUrl;
  const description = postDetails.description;
  const tags = postDetails.tags;

  const newPost = {};

  newPost.title = description;
  newPost.excerpt = description;
  newPost.description = description;
  newPost.featured_image_url = image;

  newPost.sharing = {};
  newPost.sharing.title = description;
  newPost.sharing.subtitle = description;
  newPost.sharing.imageUrl = image;

  newPost.show_post_author = true;
  newPost.publish_to_ia = false;
  newPost.publish_to_amp = true;

  newPost.post_type = 'media';
  newPost.media = {};
  newPost.media.media_type = 'image';
  newPost.media.url = image;
  newPost.media.description = description;

  newPost.categories = [];
  newPost.tags = tags;

  newPost.status = 'published';

  console.log("new post setup")

  return Promise.resolve(newPost);
}

