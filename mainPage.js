const API_KEY = "api_key=08dd326698d783b96fc6689627c7de6c";
const BASE_URL = "https://api.themoviedb.org/3";
const POPULAR_MOVIE_URL = "/discover/movie?sort_by=popularity.desc";
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
let popularMovie_URL = BASE_URL + POPULAR_MOVIE_URL + '&' + API_KEY + '&' +'page=';

// Get from https://api.themoviedb.org/3/genre/movie/list?api_key=08dd326698d783b96fc6689627c7de6c&language=en-US
const genres_bank = {"genres":[{"id":28,"name":"Action","color":"#ff0000"},{"id":12,"name":"Adventure","color":"#ff4000"},{"id":16,"name":"Animation","color":"#ff8000"},
        {"id":35,"name":"Comedy","color":"#ffbf00"},{"id":80,"name":"Crime","color":"#ffff00"},{"id":99,"name":"Documentary","color":"#bfff00"},
        {"id":18,"name":"Drama","color":"#80ff00"},{"id":10751,"name":"Family","color":"#40ff00"},{"id":14,"name":"Fantasy","color":"#00ff00"},
        {"id":36,"name":"History","color":"#00ff40"},{"id":27,"name":"Horror","color":"#00ff80"},{"id":10402,"name":"Music","color":"#00ffbf"},
        {"id":9648,"name":"Mystery","color":"#00ffff"},{"id":10749,"name":"Romance","color":"#00bfff"},{"id":878,"name":"Science Fiction","color":"#0080ff"},
        {"id":10770,"name":"TV Movie","color":"#0040ff"},{"id":53,"name":"Thriller","color":"#0000ff"},{"id":10752,"name":"War","color":"#ff00ff"},
        {"id":37,"name":"Western","color":"#ff0040"}]};

const mainMovieList = document.getElementById('mainMovieList');
const buttonsInfo = document.getElementById('movieList_mainPage-buttons_info');

const likedList_badge = document.querySelector('.navigationBar-textMenu-item_likedList_badge');

const movieListPage = document.querySelector(".movieList_mainPage");
const likedListPage = document.querySelector("#likedList_mainPage");
const body_popUp_page = document.querySelector('.body_popUp');
const head_title = document.querySelector('.title_Movies');

const moviePageSwitch = document.querySelector('.moviePage_switch');
/*------------------------------ Buttons ----------------------------------------------------*/
//get all buttons
// const allLike_butts = document.querySelectorAll(".mainMovieList-likeButton-press");

let allLike_butts; // In asyn functions
let movieList_img_butts;

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
let badge_count = 0;


//
render();

function render(){
    getMovies(popularMovie_URL + button_Page);

    /**/
    initButtons();
}

function getMovies(url) {
    console.log(url);
    //loadpage display
    fetch(url).then(res => res.json()).then(data => {
        console.log("Check my all data: ");
        console.log(data);
        getButtonInfo(data);
        showMovie(data);
    })
    //loadpage none
}

function initButtons(){
    myPrevious_butt.addEventListener("click",() => {
        if(button_Page > 1){
            button_Page -=1;
            let popularMovie_URL_temp = popularMovie_URL + button_Page;
            console.log("button: " + button_Page);
            // setTimeout(getMovies(popularMovie_URL_temp),10000);
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
        head_title.textContent = "The Most Popular Movies";
    });
    likedList_butt.addEventListener("click", () => {
        config_butt.style.visibility = "visible";
        movieListPage.style.visibility = "hidden";
        likedListPage.style.visibility = "visible";
        head_title.textContent = "The Liked Movies";
        likedList_badge.textContent = "";
        badge_count = 0;
    });
    body_popUp_close_butt.addEventListener("click", () => {
        body_popUp_page.style.visibility = "hidden";
    });
}

function show_LikedListButton(){

    likedList_butt.style.visibility = "visible";
    if(badge_count !== 0){
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
            `<img class="mainMovieList-item-image" src="${IMAGE_BASE_URL + poster_path}" id="img_button_${i}" alt="Image">
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

    movieList_img_butts = document.querySelectorAll(".mainMovieList-item-image");
    movieList_img_butts.forEach((button) =>{
        button.addEventListener("click",() => {

            let tempIndex = button.id.split('_'); /* [button,number] */
            let index = tempIndex[tempIndex.length - 1];

            //append to liked list array
            let getThisMovie = movieList_storeTemp[index];

            console.log(getThisMovie);
            body_popUp_page.style.visibility = "visible";

            const pop_backGround = document.querySelector('.body_popUp-backGround');
            pop_backGround.style.backgroundImage = `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),
                                                                url(${IMAGE_BASE_URL + getThisMovie.backdrop_path})`;

            const pop_mainImage = document.querySelector('.body_popUp-mainImage');
            pop_mainImage.src = `${IMAGE_BASE_URL + getThisMovie.poster_path}`;

            const pop_genres =  document.querySelector('.body_popUp-infoSection-genres');
            const genreArr = getThisMovie.genre_ids;
            const genresList = genres_bank.genres;
            pop_genres.innerHTML = "";
            for(let i=0; i < genreArr.length; i++){
                for(let j=0; j < genresList.length; j++){
                    if(genreArr[i] === genresList[j].id){
                        const genres_single = document.createElement('p');
                        genres_single.classList.add('body_popUp-infoSection-genres-item');

                        genres_single.textContent = genresList[j].name;
                        genres_single.style.backgroundColor = genresList[j].color;

                        pop_genres.appendChild(genres_single);
                    }
                }
            }

            const pop_description = document.querySelector('.body_popUp-infoSection-description');
            pop_description.textContent = `${getThisMovie.overview}`;

            const title_year = document.querySelector('.body_popUp-infoSection-title');
            title_year.textContent = `${getThisMovie.original_title} (${getThisMovie.release_date})`;

            window.scroll(0,50);
        });
    });

    /* After generate all the like buttons, then select */

    /*------------------------------------------------------------------------*/
    // likedListPage.innerHTML = ''; //after remove templicate delete this line
    /*-----------------------------------------------------------------------*/

    allLike_butts = document.querySelectorAll(".mainMovieList-likeButton-press");

    allLike_butts.forEach((button) => {
        button.addEventListener("click", () => {

            let tempIndex = button.id.split('_'); /* [button,number] */
            let index = tempIndex[tempIndex.length - 1];

            //append to liked list array
            let getThisMovie = movieList_storeTemp[index];

            // console.log(movieList_storeTemp);

            if(!likedList_storeTemp.includes(getThisMovie)){

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
