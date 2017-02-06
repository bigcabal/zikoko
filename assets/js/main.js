// Search Bar

document.querySelector('.toggle--open-search').addEventListener('click', function () {
  document.querySelector('.search-header').classList.add('search-header--is-opened');
  document.querySelector('.page-overlay').classList.add('page-overlay--is-visible');
  document.querySelector('.search-header__field').focus();
  return false;
});


document.querySelector('.toggle--close-search').addEventListener('click', function () {
  closeSearchHeader();
  return false;
});

document.querySelector('.page-overlay').addEventListener('click', function () {
  closeSearchHeader();
  return false;
});

function closeSearchHeader() {
  document.querySelector('.search-header').classList.remove('search-header--is-opened');
  document.querySelector('.page-overlay').classList.remove('page-overlay--is-visible');
  document.querySelector('.search-header__field').value = '';
}


// Feed Filter
var feed_filter_dropdown = Array.from( document.querySelectorAll('.feed-filter__dropdown') );
feed_filter_dropdown.forEach(function(element) {
  element.addEventListener('click', function (e) {
    e.preventDefault();
    console.log("clicked feed filter dropdown");
    e.target.classList.toggle('feed-filter__dropdown--opened');
    return false;
  })
})

var zkk_nav_dropdown = Array.from( document.querySelectorAll('.zkk-nav__dropdown') );
zkk_nav_dropdown.forEach(function(element) {
  element.addEventListener('click', function (e) {
    e.target.classList.toggle('zkk-nav__dropdown--opened');
    return false;
  });
})




