"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
console.log('getshows()', term);
  const res = await axios.get(`https://api.tvmaze.com/search/shows?q=${term}`);
console.log('this is res', res);
  const shows = [];

for (let idx of res.data){
  shows.push({
    id: idx.show.id,
    name: idx.show.name,
    summary: `<p><b>${idx.show.name}</b>${idx.show.summary}</p>`,
    image: idx.show.image ? idx.show.image.medium : 'https://tinyurl.com/tv-missing'
  });
}

return shows; 
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();
  console.log('this is shows', shows);

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src=${show.image}
              alt="Bletchly Circle San Francisco"
              class="w-25 me-3">
           <div id=${show.id} class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);
      
    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  console.log('this is term', term);
  const shows = await getShowsByTerm(term);

  // $episodesArea.hide();
  populateShows(shows);

  const episodeBtns = document.querySelectorAll('.Show-getEpisodes');
  for(let btn of episodeBtns){
    btn.addEventListener('click', function(e){
      if(e.target.nextElementSibling){
        console.log('HAS SIBLING');
        const remove = e.target.nextElementSibling;
        remove.remove();
      } else {
        console.log(e.target.parentNode.id);

        const parentId = e.target.parentNode.id;
        const parent = e.target.parentNode; 
      
        const div = document.createElement('div');
        const h3 = document.createElement('h3');
        const ul = document.createElement('ul');
  
        parent.append(div);
        div.append(h3);
        div.append(ul);
        div.setAttribute('id', 'episodeArea');
        div.setAttribute('name', 'visible');
        h3.innerText = "Episodes";
        ul.setAttribute('id', 'episodesList');
  
        getEpisodesOfShow(parentId, ul);
      }
    })
  }
}


$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */



async function getEpisodesOfShow(id, target) { 
  const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  console.log(res);
 
  for(let episode of res.data){
    console.log({id: episode.id, name: episode.name, season: episode.season, number: episode.number});
    const li = document.createElement('li');
    li.innerText = episode.name
    target.append(li);
  }
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) { 


}
