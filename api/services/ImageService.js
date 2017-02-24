/**
 * ImageService
 *
 */

module.exports = {
  getDisplayImage: function (url, placement) {

    url = getOptimizedUrl(url, placement);
    const imageClass = getImageClass(placement);

    if (url.indexOf('.gif') === -1) {
      return `<img class="${imageClass}" src="${ url }" alt="">`;
    } else {
      const base = url.split('.gif')[0];
      return `<video class="${imageClass}" width="600" style="width: 100%;" poster="${base}.jpg" autoplay loop muted playsinline>
              <source type="video/mp4" src="${base}.mp4">
              <source type="video/webm" src="${base}.webm">
              <img src="${base}.jpg" alt="" />
            </video>`;
    }

  }
};

function getImageClass(placement) {
  switch (placement) {
    case 'post':
      return 'post__item-img';
    case 'excerpt':
      return 'post-excerpt__img';
    case 'profile':
      return 'profile__img';
    case 'profile-excerpt':
      return 'post-excerpt__author-img';
    default:
      return 'post__item-img';
  }
  ;
}

function getOptimizedUrl(url, placement) {

  let transformation;
  switch (placement) {
    case 'post':
      transformation = 'w_600,f_auto,fl_lossy,q_auto/';
      break;
    case 'excerpt':
      transformation = 'w_600,f_auto,fl_lossy,q_auto/';
      break;
    case 'profile':
      transformation = 'w_100,f_auto,fl_lossy,q_auto/';
      break;
    case 'profile-excerpt':
      transformation = 'w_50,f_auto,fl_lossy,q_auto/';
      break;
    default:
      transformation = 'w_600,f_auto,fl_lossy,q_auto/';
      break;
  }

  const string = 'upload/';
  const index = url.indexOf(string) + string.length;
  const optimizedUrl = url.slice(0, index) + transformation + url.slice(index);

  return optimizedUrl;
}


