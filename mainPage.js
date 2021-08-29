const API_KEY = "api_key=08dd326698d783b96fc6689627c7de6c";
const BASE_URL = "https://api.themoviedb.org/3";
const POPULAR_MOVIE_URL = "/discover/movie?sort_by=popularity.desc";
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const popularMovie_URL = BASE_URL + POPULAR_MOVIE_URL + '&' + API_KEY + '&' +'page=1';

const mainMovieList = document.getElementById('mainMovieList');

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




getMovies(popularMovie_URL);
    function getMovies(url) {
        fetch(url).then(res => res.json()).then(data => {
            console.log(data);
            showMovie(data);
            // console.log(data.results.length);
            // showMovie(data.results);

        })
}

function showMovie(data){
    mainMovieList.innerHTML = '';

    let dataPage = data.results;

    console.log("My total page: " + data.total_pages);


    dataPage.forEach( movie => {
        const{poster_path,original_title,release_date} = movie;
        // console.log('myTest' + poster_path + original_title + release_date);
        const movieTemp = document.createElement('div');
        movieTemp.classList.add('mainMovieList-item');
        movieTemp.innerHTML =
            `<img class="mainMovieList-item-image" src="${IMAGE_BASE_URL + poster_path}" alt="Image">
             <div class="mainMovieList-item-info">
                 <h3 class="mainMovieList-item-info-title">${original_title}</h3>
                 <p class="mainMovieList-item-info-releaseDate">${release_date}</p>
             </div>
            `;
        mainMovieList.appendChild(movieTemp);
    })
}



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

