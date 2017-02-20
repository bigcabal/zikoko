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


var feed_filter_dropdown_toggle =  Array.from( document.querySelectorAll('.feed-filter__dropdown-toggle') );

feed_filter_dropdown_toggle.forEach(function(element){
  element.addEventListener('click', function(e){
    e.preventDefault();
    console.log("clicked feed filter dropdown");
    findAncestor(e.target, 'feed-filter__dropdown').classList.toggle('feed-filter__dropdown--opened');
  })
});

function findAncestor (el, cls) {
  while ((el = el.parentElement) && !el.classList.contains(cls));
  return el;
}


var zkk_nav_dropdown = Array.from( document.querySelectorAll('.zkk-nav__dropdown') );
zkk_nav_dropdown.forEach(function(element) {
  element.addEventListener('click', function (e) {
    e.target.classList.toggle('zkk-nav__dropdown--opened');
    return false;
  });
})




