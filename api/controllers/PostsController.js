/**
 * PostsController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const postsPerPage = sails.config.globals.settings.postsPerPage;

module.exports = {

  list: function (req, res) {

    console.log("POSTS ============")

    // Request parameters
    const categorySlug = req.params.category_slug || null;
    const page = req.params.page_number || 1;

    // Default view data
    let data = {};
    data.order = req.param('order') || 'latest';
    data.feed = categorySlug ? null : 'Everything';
    data.currentUser = req.session.user;
    data.title = MetaDataService.pageTitle();
    data.metaData = MetaDataService.pageMeta();

    // Pagination
    let queryLimit = `&limit=${postsPerPage}`;
    let queryPagination = `&skip=${ (page - 1) * postsPerPage}`;

    // Default query
    let query = `/posts?sort=publishedAt%20DESC${queryLimit}${queryPagination}`;


    function setCategory() {
      return APIService.req({ path: `/categories?slug=${categorySlug}` })
        .then((APIResponse) => {
          const category = APIResponse.data[0];
          query = `/categories/${category.id}/populatedposts?sort=publishedAt%20DESC${queryLimit}${queryPagination}`;
          data.title = MetaDataService.pageTitle(category.name);
          data.metaData = MetaDataService.pageMeta('category', category);

          console.log(query);
          return data.feed = category.name;
        })
    }

    APIService.getPostsNavigation({ session: req.session })
      .then((postsNavigation) => data.postsNavigation = postsNavigation)
      .then(() => {
        if ( data.feed === 'Everything' ) return;
        return setCategory();
      })
      .then(() => APIService.req({ path: query, user: data.currentUser }))
      .then((APIResponse) => {
        data.pagination = {
          page: page,
          total: APIResponse.headers.total,
          pageBase: categorySlug ? '' : `/categories/${categorySlug}`
        }
        return APIResponse.data;
      })
      .then((posts) => data.posts = posts)
      .then(() => APIService.getSidebarPosts(req.session))
      .then((APIResponse) => data.sidebarPosts = APIResponse.data)
      .then(() => res.view('posts', data))
      .catch((err) => res.redirect('/login?error=list'));

  },

  search: function (req, res) {

    // Request parameters
    const term = req.param('term') || null;
    if ( !term ) res.redirect('/');
    const page = req.params.page_number || 1;

    // Default view data
    let data = {};
    data.term = term;
    data.currentUser = req.session.user;
    data.title = MetaDataService.pageTitle(`Search Results for "${term}"`);
    data.metaData = MetaDataService.pageMeta('search', term);

    // Pagination
    let queryLimit = `&limit=${postsPerPage}`;
    let queryPagination = `&skip=${ (page - 1) * postsPerPage}`;

    // Default query
    let query = `/posts/search?query=${ encodeURI(term) }${queryLimit}${queryPagination}`;


    function cleanPost(post) {
      post.sharing = post.sharing_;
      post.media = post.media_;
      post.author = post.author_;
      post.categories = post.categories_;
      post.tags = post.tags_;
      post.blocks = post.blocks_;
      delete post['sharing_'];
      delete post['media_'];
      delete post['author_'];
      delete post['categories_'];
      delete post['tags_'];
      delete post['blocks_'];
      return post;
    }

    APIService.getPostsNavigation({ session: req.session })
      .then((postsNavigation) => data.postsNavigation = postsNavigation)
      .then(() => APIService.req({ path: query, user: data.currentUser }))
      .then((APIResponse) => {
        data.pagination = {
          page: page,
          total: APIResponse.data.hits.total,
          pageBase: '/search',
          query: `?term=${term}`
        }
        return APIResponse.data.hits.hits;
      })
      .then((uglyPosts) => {
        const posts = uglyPosts.map((uglyPost) => cleanPost(uglyPost._source));
        data.posts = posts;
      })
      .then(() => APIService.getSidebarPosts(req.session))
      .then((APIResponse) => data.sidebarPosts = APIResponse.data)
      .then(() => res.view('search', data))
      .catch(() => res.redirect('/'))

  },

  instant_articles: function (req, res) {

    APIService.req({ path: query })
      .then((APIResponse) => {
        console.log(APIResponse.data);
        res.set('Content-Type', 'application/rss+xml');
        res.type('application/rss+xml');
        res.view('feed-ia', {
          layout: null,
          posts: APIResponse.data
        });
      })
      .catch(() => res.redirect('/'))
  },

};
