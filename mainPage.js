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

const config_page = document.querySelector('.DragConfigPage');
const loading_page = document.querySelector('.Loading-page');

/*-------------------------------------------- Buttons ----------------------------------------------------*/

let allLike_butts; // In asyn functions
let movieList_img_butts;

const config_butt = document.querySelector(".config");
const configClose_butt = document.querySelector(".DragConfigPage-closeImage");
const body_popUp_close_butt = document.querySelector(".body_popUp-close");

const myPrevious_butt = document.querySelector('#movieList_mainPage-buttons-previous');
const myNext_butt = document.querySelector('#movieList_mainPage-buttons-next');

const movieList_butt = document.querySelector('.navigationBar-textMenu-item_movieList');
const likedList_butt = document.querySelector('.navigationBar-textMenu-item_likedList');

const drag_items = document.querySelectorAll(".DragConfigPage-section-list-item");
const drag_list = document.querySelector('.DragConfigPage-section-list');

/*------------------------------------ Global variables ----------------------------------------------------*/
let current_page,total_pages,total_results; // Button info collections
let button_Page = 1; // Record which page is

let movieList_storeTemp = []; // Current page movie list storage
let likedList_storeTemp = []; // Liked List storage
let badge_count = 0;  // Like list notification count

let dragItem = null; // handle the drag element, drag Item use to check it is same object or position.
let carryMyDragIndex; // handle the drag index


/*---------------------------------------Programming Execute------------------------------------------------*/
render();
/*----------------------------------------------------------------------------------------------------------*/


function render(){
    /*Initial*/
    getMovies(popularMovie_URL + button_Page);

    /*Listener Events*/
    initButtons();
}

async function getMovies(url) {
    try {
        run_loadingPage(true);       /* Loading Page Start*/
        let res = await fetch(url);
        let data = await res.json();
        run_loadingPage(false);      /* Loading Page End*/

        getPageIndex_Info(data);
        showMovie(data);
    }catch (error){
        console.log("url-Errors: ",error);
    }
}

/* Loading page function */
function run_loadingPage(isLoading_orNot){
    if(isLoading_orNot){
        loading_page.style.visibility = "visible";
    }
    else{
        loading_page.style.visibility = "hidden";
    }
}
/* The button page index and total movies count*/
function getPageIndex_Info(data){
    current_page = data.page;
    total_pages = data.total_pages;
    total_results = data.total_results;
}
/* Function for show notification badge*/
function show_LikedListButton(){
    likedList_butt.style.visibility = "visible";
    if(badge_count !== 0){
        likedList_badge.textContent = `${badge_count}`;
    }
}
/* Buttons initialize */
function initButtons(){
    /* Check previous button is clickable, if yes go previous */
    myPrevious_butt.addEventListener("click",() => {
        if(button_Page > 1){
            button_Page -=1;
            let popularMovie_URL_temp = popularMovie_URL + button_Page;
            // After click, refresh the page
            getMovies(popularMovie_URL_temp);
        }
    });
    /* Check previous button is clickable, if yes go next */
    myNext_butt.addEventListener("click",() =>{
        if(button_Page < 500){
            button_Page +=1;
            let popularMovie_URL_temp = popularMovie_URL + button_Page;
            // After click, refresh the page
            getMovies(popularMovie_URL_temp);
        }
    });
    /* Switch the movie page layout */
    movieList_butt.addEventListener("click", () =>{
        config_butt.style.visibility = "hidden";
        movieListPage.style.visibility = "visible";
        likedListPage.style.visibility = "hidden";
        head_title.textContent = "The Most Popular Movies";
    });
    /* Switch the liked-List page layout */
    likedList_butt.addEventListener("click", () => {
        config_butt.style.visibility = "visible";
        movieListPage.style.visibility = "hidden";
        likedListPage.style.visibility = "visible";
        head_title.textContent = "The Liked Movies";

        /* After click likedlist button, refresh the notification badge */
        likedList_badge.textContent = "";
        badge_count = 0;
    });
    /* Pop Up screen */
    body_popUp_close_butt.addEventListener("click", () => {
        body_popUp_page.style.visibility = "hidden";
    });
    /* Open Config page */
    config_butt.addEventListener("click",() =>{
        config_page.style.visibility = "visible";
        console.log("Check How many like items: ",likedList_storeTemp.length);
        // add like list to config page
        for(let i = 0; i < likedList_storeTemp.length; i++){
            const likeMoiveTitle = likedList_storeTemp[i].original_title;
            const likedMovie_temp = document.createElement('div');
            likedMovie_temp.classList.add('DragConfigPage-section-list-item');
            likedMovie_temp.setAttribute("id",`dragNumber_${i+1}`);
            likedMovie_temp.setAttribute("draggable",`true`);
            likedMovie_temp.setAttribute('ondragstart','handleDragStart(event,this)');
            likedMovie_temp.setAttribute('ondragover','handleDragOver(event,this)');
            likedMovie_temp.setAttribute('ondragenter','handleDragEnter(event,this)');
            likedMovie_temp.setAttribute('ondragleave','handlerDragLeave(event,this)');
            likedMovie_temp.setAttribute('ondragend','handleDragEnd(event,this)');
            likedMovie_temp.setAttribute('ondrop','handleDrop(event,this)');
            likedMovie_temp.innerText = `${likeMoiveTitle}`;
            drag_list.appendChild(likedMovie_temp);
        }
    });
    /* Close Config page */
    configClose_butt.addEventListener("click",() => {
        config_page.style.visibility = "hidden";
        console.log("How many like items: ",likedList_storeTemp.length);
        //clean config page
        drag_list.innerHTML = '';
        //reprint like movie list
        likedListPage.innerHTML = '';
        for(let i = 0; i < likedList_storeTemp.length; i++){
            const {id,poster_path,original_title,release_date} = likedList_storeTemp[i];
            const movieTemp = document.createElement('div');
            movieTemp.classList.add(`likedList_mainPage-item`);
            movieTemp.setAttribute("id",`${id}`);
            movieTemp.innerHTML =
                `<img class="likedList_mainPage-item-image" src="${IMAGE_BASE_URL + poster_path}" alt="LikedImage">
                     <div class="likedList_mainPage-item-info">
                         <h3 class="likedList_mainPage-item-info-title">${original_title}</h3>
                         <p class="likedList_mainPage-item-info-releaseDate">${release_date}</p>
                     </div>
                     `;
            // Append html to liked list page
            likedListPage.appendChild(movieTemp);
        }
    });
}

/*-------------------------------------------- Dragon Functions ----------------------------------------------*/
function swapMyList(index_a, index_b, arr){
    let temp = arr[index_a];
    arr[index_a] = arr[index_b];
    arr[index_b] = temp;
}
function handleDragStart(e,dom) {
    dom.style.opacity = '0.4';

    dragItem = dom; // Take drag dom

    carryMyDragIndex = dom.id.split('_')[1];

    e.dataTransfer.effectAllowed = 'move'; // event set up
    e.dataTransfer.setData('text/html',dom.innerHTML); // event set data transfer
}

function handleDragEnd(e,dom) {
    dom.style.opacity = '1';
    drag_items.forEach((item) => {
        item.classList.remove('dragoverEfficient');
        //carry index refresh
        carryMyDragIndex = null;
    })
}

function handleDragOver(e,dom){
    if(e.preventDefault()){
        e.preventDefault();
    }
    return false;
}

function handleDragEnter(e,dom){
    dom.classList.add('dragoverEfficient');
}

function handlerDragLeave(e,dom){
    dom.classList.remove('dragoverEfficient');
}

function handleDrop(e,dom){
    e.stopPropagation();
    if(dragItem !== dom){ // drag Item use to check it is same object or position.
        dragItem.innerHTML = dom.innerHTML; // replace drag inner html
        dom.innerHTML = e.dataTransfer.getData('text/html'); // transfer data from data set
        let myEndIndex = dom.id.split('_')[1];
        swapMyList(carryMyDragIndex - 1,myEndIndex - 1, likedList_storeTemp); //swap like list order
    }
    return false;
}

/*-------------------------------------------------------------------------------------------------------*/
/* use for refresh the main page when next or previous button is clicked*/
/* this is Fvkin serious long */
function showMovie(data){
    // Use for control next and previous buttons
    // if page reach to 1 and 500, special styles will active
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

    let dataPage = data.results; // Get current page movies info

    mainMovieList.innerHTML = ''; /* Clear TEMPLATE Inner HTML before we insert new html */

    // Update current page index info
    buttonsInfo.innerHTML= `<span id="movieList_mainPage-buttons_info">
                            Page ${current_page}/Total ${total_pages} of ${total_results} results</span>`;

    // Deep copy to my page storage array
    movieList_storeTemp = JSON.parse(JSON.stringify(dataPage));

    // Insert all the movie html to my MainMovieList
    for(let i=0; i < dataPage.length; i++){
        const movie = dataPage[i]; //copy the reference
        const {poster_path,original_title,release_date} = movie; //Destruction

        // Create new Div, named mainMovieList-item
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
        //append to main Movie List
        mainMovieList.appendChild(movieTemp);
    }

    // Because all "Movie Image" is dynamic, we cannot use querySelector globally,
    // but the image is clickable and these image buttons declare globally.(But locally still work)
    // After we generate all movie HTML, then we will create all event listener.
    movieList_img_butts = document.querySelectorAll(".mainMovieList-item-image");
    movieList_img_butts.forEach((button) =>{
        button.addEventListener("click",() => {
            // Get number to know which picture its clicked
            let tempIndex = button.id.split('_'); /* [button,number] */
            let index = tempIndex[tempIndex.length - 1];

            // Get this movie info from movie storage array
            let getThisMovie = movieList_storeTemp[index];

            // If it is clicked, the pop up screen will be visible.
            body_popUp_page.style.visibility = "visible";

            // Update all the information about the pop up page
            const pop_backGround = document.querySelector('.body_popUp-backGround');
            pop_backGround.style.backgroundImage = `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),
                                                                url(${IMAGE_BASE_URL + getThisMovie.backdrop_path})`;
            const pop_mainImage = document.querySelector('.body_popUp-mainImage');
            pop_mainImage.src = `${IMAGE_BASE_URL + getThisMovie.poster_path}`;
            const pop_genres =  document.querySelector('.body_popUp-infoSection-genres');
            const genreArr = getThisMovie.genre_ids;
            const genresList = genres_bank.genres;

            // Clean the Genres section before we push, (this section is dynamic)
            pop_genres.innerHTML = "";
            // add all genres with specific back ground color
            for(let i=0; i < genreArr.length; i++){
                for(let j=0; j < genresList.length; j++){
                    if(genreArr[i] === genresList[j].id){
                        const genres_single = document.createElement('p');
                        genres_single.classList.add('body_popUp-infoSection-genres-item');
                        genres_single.textContent = genresList[j].name;
                        genres_single.style.backgroundColor = genresList[j].color;
                        // Append to genres section
                        pop_genres.appendChild(genres_single);
                    }
                }
            }
            // add description
            const pop_description = document.querySelector('.body_popUp-infoSection-description');
            pop_description.textContent = `${getThisMovie.overview}`;
            // add year
            const title_year = document.querySelector('.body_popUp-infoSection-title');
            title_year.textContent = `${getThisMovie.original_title} (${getThisMovie.release_date})`;
            // pop-up screen default location is at top, so after click, move to top
            window.scroll(0,50);
        });
    });


    // Because all "Like it" buttons are dynamic, we cannot use querySelector globally,
    // but the buttons should declare globally.(But locally still work)
    // After we generate all movie HTML, then we will create all event listener.
    allLike_butts = document.querySelectorAll(".mainMovieList-likeButton-press");
    allLike_butts.forEach((button) => {
        button.addEventListener("click", () => {
            // Get number to know which picture its clicked
            let tempIndex = button.id.split('_'); /* [button,number] */
            let index = tempIndex[tempIndex.length - 1];

            // Get this movie info from movie storage array
            let getThisMovie = movieList_storeTemp[index];

            // if check the movie is in my liked list storage, if not, add it
            if(!likedList_storeTemp.includes(getThisMovie)){

                // Notification badge update, and refresh it
                badge_count++;
                show_LikedListButton();

                // add to my liked list storage
                likedList_storeTemp.push(getThisMovie);

                const {id,poster_path,original_title,release_date} = getThisMovie; //destruction
                // Create to liked list html
                const movieTemp = document.createElement('div');
                movieTemp.classList.add(`likedList_mainPage-item`);
                movieTemp.setAttribute("id",`${id}`);
                movieTemp.innerHTML =
                    `<img class="likedList_mainPage-item-image" src="${IMAGE_BASE_URL + poster_path}" alt="LikedImage">
                     <div class="likedList_mainPage-item-info">
                         <h3 class="likedList_mainPage-item-info-title">${original_title}</h3>
                         <p class="likedList_mainPage-item-info-releaseDate">${release_date}</p>
                     </div>
                     `;
                // Append html to liked list page
                likedListPage.appendChild(movieTemp);
            }
        });
    });
}
