/**
 * ImageService
 *
 */

module.exports = {
  getDisplayImage: function (url, placement) {

    url = getOptimizedUrl(url, placement);
    const imageClass = getImageClass(placement);
    return `<img class="${imageClass}" src="${ url }" alt="">`;
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
      transformation = '600/';
      break;
    case 'excerpt':
      transformation = '600/';
      break;
    case 'profile':
      transformation = '100/';
      break;
    case 'profile-excerpt':
      transformation = '50/';
      break;
    default:
      transformation = '600/';
      break;
  }

  const filenameIndex = url.lastIndexOf('/') + 1;
  var optimizedUrl = "";

  if (url.slice(0, filenameIndex) === "https://bc-image-test.s3.amazonaws.com/") {
    var ves = url.lastIndexOf('?');
    url = url.slice(0, ves);
    newIndex = url.lastIndexOf('/') + 1;
    if (url.indexOf('.gif') === -1) {
        optimizedUrl = "http://bc-image-test.s3-website-us-east-1.amazonaws.com/" + transformation + url.slice(newIndex);
    } else if (url.indexOf('.webp') === -1) {
        optimizedUrl = "http://bc-image-test.s3-website-us-east-1.amazonaws.com/" + transformation + url.slice(newIndex);
    } else {
        optimizedUrl = "http://bc-image-test.s3-website-us-east-1.amazonaws.com/" + url.slice(newIndex);
    }
  } else {
      if (url.indexOf('.gif') === -1) {
          optimizedUrl = url.slice(0, filenameIndex) + transformation + url.slice(filenameIndex);
      } else if (url.indexOf('.webp') === -1) {
          optimizedUrl = url.slice(0, filenameIndex) + transformation + url.slice(filenameIndex);
      } else {
          optimizedUrl = url.slice(0, filenameIndex) + url.slice(filenameIndex);
      }
  }

  return optimizedUrl;
}
