const API_KEY = "api_key=08dd326698d783b96fc6689627c7de6c";
const BASE_URL = "https://api.themoviedb.org/3";
const POPULAR_MOVIE_URL = "/discover/movie?sort_by=popularity.desc";
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
let popularMovie_URL = BASE_URL + POPULAR_MOVIE_URL + '&' + API_KEY + '&' +'page=';

const mainMovieList = document.getElementById('mainMovieList');
const buttonsInfo = document.getElementById('movieList_mainPage-buttons_info');

let myPrevious_butt = document.querySelector('#movieList_mainPage-buttons-previous');
let myNext_butt = document.querySelector('#movieList_mainPage-buttons-next');

let current_page,total_pages,total_results;

let button_Page = 1;

// let myURL_data;

//initial
render();

// console.log(myURL_data);

function render(){
    getMovies(popularMovie_URL + button_Page);
}


function getMovies(url) {
    console.log(url);
    fetch(url).then(res => res.json()).then(data => {
        getButtonInfo(data);
        showMovie(data);
    })
}

/* Page up date*/
function previous_mainPage(){

    button_Page -=1;
    let popularMovie_URL_temp = popularMovie_URL + button_Page;
    console.log("button: " + button_Page);
    getMovies(popularMovie_URL_temp);

}

function next_mainPage(){
    button_Page +=1;
    let popularMovie_URL_temp = popularMovie_URL + button_Page;
    console.log("button: " + button_Page);
    getMovies(popularMovie_URL_temp);
}




function getButtonInfo(data){
    current_page = data.page;
    total_pages = data.total_pages;
    total_results = data.total_results;
}


function showMovie(data){
    mainMovieList.innerHTML = '';

    if(data.page <= 1){
        myPrevious_butt.style.background = 'darkGray';

    }
    else{
        myPrevious_butt.style.background = 'whitesmoke';
    }

    if(data.page > 500){
        myNext_butt.style.background = 'darkGray';
    }
    else{
        myNext_butt.style.background = 'whitesmoke';
    }


    // console.log(" Current Page: "+current_page+" total Pages: "+total_pages+" total results: "+total_results);

    let dataPage = data.results;


    // console.log("My total page: " + data.total_pages);
    // console.log("My total result: " + data.total_results);
    // console.log("My current page: " + data.page);

    buttonsInfo.innerHTML= `<span id="movieList_mainPage-buttons_info">
                            Page ${current_page}/Total ${total_pages} of ${total_results} results</span>`;


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
             <div class="mainMovieList-likeButton">
                 <button class="mainMovieList-likeButton-press">Like it?</button>
             </div>
            `;
        mainMovieList.appendChild(movieTemp);
    })
}

function closeButt_body_popUp(){
    let body_popUp_butt = document.querySelector('.body_popUp');
    body_popUp_butt.style.visibility = "hidden";
}

function mouseClick_HideOrShow_movieList(){
    let config_butt = document.querySelector(".config");
    config_butt.style.visibility = "hidden";

    let movieListPage = document.querySelector(".movieList_mainPage");
    movieListPage.style.visibility = "visible";

    let likedListPage = document.querySelector(".likedList_mainPage");
    likedListPage.style.visibility = "hidden";
}

function mouseClick_HideOrShow_likedList(){
    let config_butt = document.querySelector(".config");
    config_butt.style.visibility = "visible";

    let movieListPage = document.querySelector(".movieList_mainPage");
    movieListPage.style.visibility = "hidden";

    let likedListPage = document.querySelector(".likedList_mainPage");
    likedListPage.style.visibility = "visible";
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

