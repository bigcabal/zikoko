/**
 * PostController
 *
 * @description :: Server-side logic for managing single post
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  index: function (req, res) {

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

  }

};

