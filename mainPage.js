const API_KEY = "api_key=08dd326698d783b96fc6689627c7de6c";
const BASE_URL = "https://api.themoviedb.org/3";
const POPULAR_MOVIE_URL = "/discover/movie?sort_by=popularity.desc";

const popularMovie_URL = BASE_URL + POPULAR_MOVIE_URL + '&' + API_KEY;

console.log(popularMovie_URL);


function mouseClick_HideOrShow_movieList(){
    let confi_butt = document.querySelector(".config");
    confi_butt.style.visibility = "hidden";

    let movieListPage = document.querySelector(".movieList_mainPage");
    movieListPage.style.visibility = "visible";

    let likedListPage = document.querySelector(".likedList_mainPage");
    likedListPage.style.visibility = "hidden";
}

function mouseClick_HideOrShow_likedList(){
    let confi_butt = document.querySelector(".config");
    confi_butt.style.visibility = "visible";

    let movieListPage = document.querySelector(".movieList_mainPage");
    movieListPage.style.visibility = "hidden";

    let likedListPage = document.querySelector(".likedList_mainPage");
    likedListPage.style.visibility = "visible";
}




// getMovies(popularMovie_URL);
// function getMovies(url) {
//     fetch(url).then(res => res.json()).then(data => {
//         console.log(data);
//     })
// }
//
//
// const butt = document.querySelector('.testButton');
//
// butt.addEventListener("click",buttonIni);
//
// function buttonIni(){
//     let h = document.createElement("p");
//     let text = document.createTextNode("me!");
//     h.appendChild(text);
//     document.body.appendChild(h);
// }

