// Search Bar

document.querySelector('.toggle--open-search').addEventListener('click', function() {
    document.querySelector('.search-header').classList.add('search-header--is-opened');
    document.querySelector('.page-overlay').classList.add('page-overlay--is-visible');
    document.querySelector('.search-header__field').focus();
    return false;
});


document.querySelector('.toggle--close-search').addEventListener('click', function() {
    closeSearchHeader();
    return false;
});

document.querySelector('.page-overlay').addEventListener('click', function() {
    closeSearchHeader();
    return false;
});

function closeSearchHeader() {
    document.querySelector('.search-header').classList.remove('search-header--is-opened');
    document.querySelector('.page-overlay').classList.remove('page-overlay--is-visible');
    document.querySelector('.search-header__field').value = '';
}

document.querySelector('.page-overlay').addEventListener('click', function() {
    closeSearchHeader();
    return false;
});


// Dropdowns
function setDropdownListeners() {
    if (document.querySelector('.user-profile-toggle')) {
        document.querySelector('.user-profile-toggle').addEventListener('click', function() {
            var userProfile = document.querySelector('.user-profile');
            if (userProfile.classList.contains('user-profile--active')) {
                userProfile.classList.remove('user-profile--active')
            } else {
                userProfile.classList.add('user-profile--active')
            }
            return false;
        });
    }

    if (document.querySelector('.account-toggle')) {
        document.querySelector('.account-toggle').addEventListener('click', function() {
            var account = document.querySelector('.account');
            if (account.classList.contains('account--active')) {
                account.classList.remove('account--active')
            } else {
                account.classList.add('account--active')
            }
            return false;
        });
    }
}

setDropdownListeners();

document.querySelector('.category-toggle').addEventListener('click', function() {
    var categories = document.querySelector('.filter__categories');
    if (categories.classList.contains('filter__categories--active')) {
        categories.classList.remove('filter__categories--active')
    } else {
        categories.classList.add('filter__categories--active')
    }
    return false;
});





/*
 * LIKE POST
 *
 */



var likePostForms = Array.from(document.querySelectorAll('.js-likePostForm'));

function likePost(e) {

    e.preventDefault();

    var postId = e.target[0].value;
    var userId = '5897941e9bc4d71100448c21';
    var userAuth = 'aXJlQGJpZ2NhYmFsLmNvbTpwYXNzd29yZA==';

    console.log("STARTING====")

    //

    var xhr = new XMLHttpRequest();
    var url = "https://formation-api.herokuapp.com/api/likes";
    var formData = { post: postId, user: userId };

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", "Basic " + userAuth);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            // Request finished. Do processing here.
            console.log("done ==========")
            console.log(xhr);
        }
    }
    xhr.send(formData);


}

likePostForms.forEach(function(form) {
    //form.addEventListener('submit', likePost);
})
