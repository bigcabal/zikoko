/**
 * PostsController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  index: function (req, res) {

    let data = {};
    data.order = req.param('order') || 'hot';
    data.feed = 'Everything';

    APIService.request('/posts?populate=[author]&sort=publishedAt%20DESC')
      .then((posts) => data.posts = posts)
      .then(() => APIService.request('/categories'))
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
    let data = {};
    data.order = req.param('order') || 'hot';

    APIService.request('/posts?populate=[author]&sort=publishedAt%20DESC')
      .then((posts) => data.posts = posts)
      .then(() => APIService.request('/categories'))
      .then((categories) => data.categories = categories)
      .then(() => {
        const category = data.categories.find((category) => {
          return category.id === categoryId
        });
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

    APIService.request('/posts?populate=[author]&sort=publishedAt%20DESC')
      .then((posts) => data.posts = posts)
      .then(() => APIService.request('/categories'))
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

    APIService.request(`/posts/${postId}`)
      .then((post) => {
        console.log(post);
        return data.post = post;
      })
      .then(() => {
        res.view('post', data);
      })

  },


  create: function (req, res) {

    let post;

    setupPost(req.body)
      .then((newPost) => post = newPost)
      .then(() => createTags(post.tags))
      .then((tags) => {
        console.log("finish creating tags")
        post.tags = tags
      })
      .then(() => APIService.request('/posts', 'post', post))
      .then(() => {
        console.log("finish creating post")
        res.redirect('/')
      })
      .catch(() => res.redirect('/new'))
  },

  amp: function (req, res) {
    "use strict";
    res.view('new-post');
  },

  instant_articles: function (req, res) {
    "use strict";
    res.view('new-post');
  }

};


function createTags(tagList) {

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




function setupPost(postDetails) {

  const image = 'https://res.cloudinary.com/big-cabal/image/upload/w_800,f_auto,fl_lossy,q_auto/v1476207568/running_ra4qwq.gif';
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

  return Promise.resolve(newPost);
}

