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

    let query = '/posts?sort=publishedAt%20DESC';

    APIService.request('/categories')
      .then((categories) => data.categories = categories)
      .then(() => {
        if ( data.feed === 'Everything' ) return Promise.resolve();
        const category = data.categories.find((category) => { return category.slug === categorySlug });
        query = `/categories/${category.id}/posts?sort=publishedAt%20DESC`;
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

    const term = req.param('term') || '';
    let data = {};
    data.term = term;
    data.currentUser = req.session.user;

    APIService.request('/posts?sort=publishedAt%20DESC')
      .then((posts) => data.posts = posts)
      .then(() => APIService.request('/categories'))
      .then((categories) => data.categories = categories)
      .then(() => res.view('search', data))
      .catch(() => res.redirect('/'))

  },

  single: function (req, res) {

    const postSlug = req.params.slug;

    let data = {};
    data.currentUser = req.session.user;

    APIService.request(`/posts?slug=${postSlug}`)
      .then((post) => {
        console.log(post);
        return data.post = post;
      })
      .then(() => APIService.request(`/users?username=${data.post.author.username}`))
      .then((users) => { return data.post.author.role = RolesService.getHighestRole(users[0].roles) })
      .then(() => res.view('post', data))
      .catch(() => res.redirect('/'))


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

    console.log(req.body.postImage);

    req.file('postImage').upload(function(err, uploadedFiles) {
      if (err) {
        return res.negotiate(err);
      }

      // If no files were uploaded, respond with an error.
      if (uploadedFiles.length === 0){
        return res.badRequest('No file was uploaded');
      }

      console.log(" success----")
      console.log(uploadedFiles);
      res.redirect('/new')

    })



    // let post;
    // setupPost(req.body)
    //   .then((newPost) => post = newPost)
    //   .then(() => createTags(post.tags))
    //   .then((tags) => {
    //     console.log("finish creating tags")
    //     return post.tags = tags;
    //   })
    //   .then(() => APIService.authRequest(req.session.user.authorization, '/posts', 'post', post))
    //   .then((newPost) => {
    //     console.log(newPost);
    //     res.redirect(`/post/${newPost.slug}`)
    //   })
    //   .catch(() => res.redirect('/new'))
  },
  createView: function(req, res) {
    if ( !req.session.user ) res.redirect('/login');
    let data = { currentUser: req.session.user };
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

  const image = postDetails.image || 'https://res.cloudinary.com/big-cabal/image/upload/w_800,f_auto,fl_lossy,q_auto/v1476207568/running_ra4qwq.gif';
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

