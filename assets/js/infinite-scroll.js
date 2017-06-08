/*
  Infinite Scroll
 ========================
 */

function InfiniteScroll(options) {

  this.contentSelector = options.contentSelector;
  this.nextSelector = options.nextSelector;
  this.navSelector = options.navSelector;

  var THIS = this;
  window.addEventListener('scroll', function(e) { THIS.start(e) })
}

InfiniteScroll.prototype.get = function(url) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.onreadystatechange = function () {
      if (req.readyState == XMLHttpRequest.DONE && req.status == 200) { resolve(req.response) }
    }
    req.onerror = function(err) { reject(err) };
    req.send();
  });
}

InfiniteScroll.prototype.displayNextPage = function(res) {
  var contentFeed = document.querySelector(this.contentSelector);
  var navEl = document.querySelector(this.navSelector);

  navEl.parentElement.removeChild(navEl);
  var nextPage = new DOMParser().parseFromString(res, "text/html");
  var nextPageContentFeed = nextPage.querySelector(this.contentSelector);
  contentFeed.insertAdjacentHTML('beforeend', nextPageContentFeed.innerHTML);
}

InfiniteScroll.prototype.loadNextPage = function() {

  if ( !document.querySelector(this.nextSelector) ) return;

  var THIS = this;

  var navEl = document.querySelector(this.navSelector);
  var navElContent = navEl.innerHTML;
  var nextPageEl = document.querySelector(this.nextSelector);
  var nextPageUrl = nextPageEl.getAttribute('href');

  navEl.innerHTML = '<p class="is-loadingText" style="margin: 0;">Loading...</p>';

  this.get(nextPageUrl)
    .then(function(res) { THIS.displayNextPage(res) })
    .catch(function() { navEl.innerHTML = navElContent })

}


InfiniteScroll.prototype.start = function(e) {

  var navEl = document.querySelector(this.navSelector);
  if ( !navEl ) return;

  var windowScrollTop = e.target.scrollingElement.scrollTop;
  var navElDistanceFromTop = navEl.offsetTop;
  var difference = navElDistanceFromTop - windowScrollTop;
  var windowHeight = window.innerHeight;

  if ( difference < (windowHeight * 2) ) {
    this.loadNextPage();
  }

}


if ( document.querySelector('.is-nextPage') ) {
  new InfiniteScroll({
    contentSelector: '#is-postsContent',
    navSelector: '.is-nav',
    nextSelector: '.is-nextPage'
  });
}


