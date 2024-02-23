"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");


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


async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  console.log('this is term', term);
  const shows = await getShowsByTerm(term);

  populateShows(shows);

  // the code below listens for a click on any episode button. 

  const episodeBtns = document.querySelectorAll('.Show-getEpisodes');
  for(let btn of episodeBtns){
    btn.addEventListener('click', function(e){
      // I added an IF statment to test if the button has already been clicked by checking if the button itself has a sibling (since when the button is clicked it appends the list of episodes right underneath the button as a sibling.) If the button has a sibling, it is removed, allowing the user to show and hide the episodes. 

      //if the button does NOT have a sibling, then it creates the elements that belong in the Episodes Area (div, h3, and ul). These elements are then appended into the parent element of the button, and given name and id attributes. 
      
      //NEXT we place the values of the parentId (the id of the show asossiated with the button) and the ul asossiated with the show episodes info into the getEpisodesofShow
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

//The getEpisodesOfShow accepts the id of the show, and the event.target ul. We then get the data of all the episodes id, name, season, and number
async function getEpisodesOfShow(id, target) { 
  const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  console.log(res);
 
  for(let episode of res.data){
    const episodeInfo = {id: episode.id, name: episode.name, season: episode.season, number: episode.number};
    populateEpisodes(episodeInfo, target)
  }
}

//The populateEpisodes appends the lis with the epiode information from getEpisodesOfShow() to the event.target ul 
function populateEpisodes(episode, target) { 
  const li = document.createElement('li');
    li.innerText = `${episode.name} (season ${episode.season}, number ${episode.number})`;
    target.append(li);
}
