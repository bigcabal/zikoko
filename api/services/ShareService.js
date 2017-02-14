/**
 * ShareService
 *
 */

module.exports = {

  getShareUrl: function(post, type) {

    const url = encodeURIComponent( `https://zikoko.com/post/${post.slug}` );
    const title = encodeURIComponent( post.sharing.title );
    const subtitle = encodeURIComponent( post.sharing.subtitle );
    const image = encodeURIComponent( post.sharing.imageUrl );

    const shareUrls = {
      facebook: `http://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet/?text=${title}&url=${url}&via=zikokomag`,
      email: `mailto:?subject=${title}&body=${url}`,
      pinterest: `https://www.pinterest.com/pin/create/button/?url=${url}&description=${title}&media=${image}`
    }

    return shareUrls[type];
  }

};
