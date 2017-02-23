/**
 * PostController
 *
 * @description :: Server-side logic for managing a single post
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  view: function(req, res) {
    if ( !req.session.user ) res.redirect('/login');
    let data = { currentUser: req.session.user };
    data.title = MetaDataService.pageTitle('Upload');
    data.metaData = MetaDataService.metaData();
    res.view('new', data);
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

