const API_KEY = "api_key=08dd326698d783b96fc6689627c7de6c";
const BASE_URL = "https://api.themoviedb.org/3";
const POPULAR_MOVIE_URL = "/discover/movie?sort_by=popularity.desc";
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
let popularMovie_URL = BASE_URL + POPULAR_MOVIE_URL + '&' + API_KEY + '&' +'page=';

const mainMovieList = document.getElementById('mainMovieList');
const buttonsInfo = document.getElementById('movieList_mainPage-buttons_info');

const likedList_badge = document.querySelector('.navigationBar-textMenu-item_likedList_badge');

const movieListPage = document.querySelector(".movieList_mainPage");
const likedListPage = document.querySelector("#likedList_mainPage");
const body_popUp_page = document.querySelector('.body_popUp');

/*------------------------------ Buttons ----------------------------------------------------*/
//get all buttons
// const allLike_butts = document.querySelectorAll(".mainMovieList-likeButton-press");

let allLike_butts; // In asyn functions

const config_butt = document.querySelector(".config");
const body_popUp_close_butt = document.querySelector(".body_popUp-close");

const myPrevious_butt = document.querySelector('#movieList_mainPage-buttons-previous');
const myNext_butt = document.querySelector('#movieList_mainPage-buttons-next');

const movieList_butt = document.querySelector('.navigationBar-textMenu-item_movieList');
const likedList_butt = document.querySelector('.navigationBar-textMenu-item_likedList');

/*------------------------------ Global variables ----------------------------------------------------*/
let current_page,total_pages,total_results;
let button_Page = 1;

let movieList_storeTemp = []; //use for add to like list
let likedList_storeTemp = [];
let likedList_check = [];
let badge_count = 0;

render();

function render(){
    getMovies(popularMovie_URL + button_Page);
    initButtons();
}

function getMovies(url) {
    console.log(url);
    fetch(url).then(res => res.json()).then(data => {
        console.log("Check my all data: ");
        console.log(data);

        getButtonInfo(data);
        showMovie(data);
    })
}

function initButtons(){
    myPrevious_butt.addEventListener("click",() => {
        if(button_Page > 1){
            button_Page -=1;
            let popularMovie_URL_temp = popularMovie_URL + button_Page;
            console.log("button: " + button_Page);
            getMovies(popularMovie_URL_temp);
        }
    });
    myNext_butt.addEventListener("click",() =>{
        if(button_Page < 500){
            button_Page +=1;
            let popularMovie_URL_temp = popularMovie_URL + button_Page;
            console.log("button: " + button_Page);
            getMovies(popularMovie_URL_temp);
        }
    });
    movieList_butt.addEventListener("click", () =>{
        config_butt.style.visibility = "hidden";
        movieListPage.style.visibility = "visible";
        likedListPage.style.visibility = "hidden";
    });
    likedList_butt.addEventListener("click", () => {
        config_butt.style.visibility = "visible";
        movieListPage.style.visibility = "hidden";
        likedListPage.style.visibility = "visible";
        likedList_badge.textContent = "";
        badge_count = 0;
    });
    body_popUp_close_butt.addEventListener("click", () => {
        body_popUp_page.style.visibility = "hidden";
    });
}

function show_LikedListButton(){

    likedList_butt.style.visibility = "visible";
    if(badge_count != 0){
        likedList_badge.textContent = `${badge_count}`;
    }
}

function getButtonInfo(data){
    current_page = data.page;
    total_pages = data.total_pages;
    total_results = data.total_results;
}


function showMovie(data){



    if(data.page <= 1){
        myPrevious_butt.style.background = 'darkGray';
        myPrevious_butt.style.cursor = 'not-allowed';
        myPrevious_butt.disabled = "disabled";
    }
    else{
        myPrevious_butt.style.background = 'whitesmoke';
        myPrevious_butt.style.cursor = null;
        myPrevious_butt.disabled = null;
    }

    if(data.page >= 500){
        myNext_butt.style.background = 'darkGray';
        myNext_butt.style.cursor = 'not-allowed';
        myNext_butt.disabled = "disabled";
    }
    else{
        myNext_butt.style.background = 'whitesmoke';
        myNext_butt.style.cursor = null;
        myNext_butt.disabled = null;
    }

    let dataPage = data.results; // Each movie info

    // console.log("My total page: " + data.total_pages);
    // console.log("My total result: " + data.total_results);
    // console.log("My current page: " + data.page);

    mainMovieList.innerHTML = ''; /* Clear default Inner HTML */

    buttonsInfo.innerHTML= `<span id="movieList_mainPage-buttons_info">
                            Page ${current_page}/Total ${total_pages} of ${total_results} results</span>`;

    // console.log("DataPage length :"+ dataPage.length);
    // console.log("DataPage item_1 :");
    // console.log(dataPage[0]);

    movieList_storeTemp = JSON.parse(JSON.stringify(dataPage));

    // console.log("movieList_storeTemp check item :");
    // console.log(movieList_storeTemp);

    for(let i=0; i < dataPage.length; i++){
        const movie = dataPage[i];
        const {poster_path,original_title,release_date} = movie;

        // console.log('myTest' + poster_path + original_title + release_date);

        const movieTemp = document.createElement('div');
        movieTemp.classList.add(`mainMovieList-item`);
        movieTemp.innerHTML =
            `<img class="mainMovieList-item-image" src="${IMAGE_BASE_URL + poster_path}" alt="Image">
             <div class="mainMovieList-item-info">
                 <h3 class="mainMovieList-item-info-title">${original_title}</h3>
                 <p class="mainMovieList-item-info-releaseDate">${release_date}</p>
             </div>
             <div class="mainMovieList-likeButton">
                 <button class="mainMovieList-likeButton-press" id='button_${i}'>Like it?</button>
             </div>
            `;
        mainMovieList.appendChild(movieTemp);
    }

    /* After generate all the like buttons, then select */
    allLike_butts = document.querySelectorAll(".mainMovieList-likeButton-press");

    /*------------------------------------------------------------------------*/
    // likedListPage.innerHTML = ''; //after remove templicate delete this line
    /*-----------------------------------------------------------------------*/

    allLike_butts.forEach((button) => {
        button.addEventListener("click", () => {
            let index = button.id.charAt(button.id.length - 1);
            // console.log("I clicked : " + index);

            //append to liked list array
            let getThisMovie = movieList_storeTemp[index];

            if( !likedList_storeTemp.includes(getThisMovie)){

                badge_count++;
                show_LikedListButton();

                likedList_storeTemp.push(getThisMovie);

                const {poster_path,original_title,release_date} = getThisMovie;

                const movieTemp = document.createElement('div');
                movieTemp.classList.add(`likedList_mainPage-item`);
                movieTemp.innerHTML =
                    `<img class="likedList_mainPage-item-image" src="${IMAGE_BASE_URL + poster_path}" alt="Image">
                     <div class="likedList_mainPage-item-info">
                         <h3 class="likedList_mainPage-item-info-title">${original_title}</h3>
                         <p class="likedList_mainPage-item-info-releaseDate">${release_date}</p>
                     </div>
                     `;
                // console.log(movieList_storeTemp.length);
                //add inner html
                likedListPage.appendChild(movieTemp);
            }
        });
    });
}