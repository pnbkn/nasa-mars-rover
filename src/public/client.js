
let store = Immutable.Map({ 
    id: 5,
    photos: '',
    rovers: [{id: 5, name: 'Curiosity'}, {id: 6, name: 'Opportunity'}, {id: 7, name: 'Spirit'}]
})

function updateStore(state, newState) {
    store = state.merge(newState)
    render(root, store)
}   

const root = document.getElementById('root')

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// Set up Page with Nav and Photo Grid
const App = (state) => {
    let rovDetails = JSON.parse(JSON.stringify(state))
    let photos = rovDetails.photos.photos;
    const statusBar = document.querySelector('.status-bar');
    return `
        <nav>
        <ul class="navigation">
            ${NavLinks(state.get("rovers"))}
        </ul>
        </nav>
        <header>
            <div class="status-bar">
            ${photoImages(photos, "info", state.get("id"))}
            </div>
        </header>
        <main>
            <section>
                <ul class="grid">
                ${photoImages(photos, "photos", state.get("id"))}
                </ul>
            </section>
        </main>
        <footer><img src="images/nasa-logo.png"/></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS
// Create the Nav Links
const NavLinks = (rovers)=> rovers.map(rover => (`<li class="rover" id=${rover.id} onclick="displayRover(${rover.id})"><h2>${rover.name}</h2></li>`)).join("")

//When called by nav link click, grabs the photo for that particular rover, using the Rover ID
const displayRover = (id)=>{
    const statusBar = document.querySelector('.rover');
    getPhotos(store, id);
    return(statusBar.setAttribute("id", id))
}

// Pulls in the Rover Info and Photos to the UI
const photoImages = (state, type, id) => {
    const statusBar = document.querySelector('.status-bar');
    const grid = document.querySelector('.grid');
    if(!state){
        getPhotos(store, id);
        
    }
        if(type === "info"){
            return(`
            <div class="sub-nav">
                <h1>${state.photos[0].rover.name}</h1><br/>
                <div class="status">
                    <h4>Status: <span>${state.photos[0].rover.status}</span> </h4>
                    <h4>Landing Date: <span>${state.photos[0].rover.landing_date}</span></h4>
                    <h4>Launch Date: <span>${state.photos[0].rover.launch_date}</span></h4>
                </div>
            </div>
            `)
        }
        else{
            return (
                state.photos.map(photo => {
                    return(`
                    <li>
                    <img src="${photo.img_src}" /><br/>
                    <h4>Photo Date: ${photo.earth_date}</h4>
                    </li>`)
                }).join("")
            )
        
        }

}

// ------------------------------------------------------  API CALLS

// Fetch the photos from the API
const getPhotos = (state, id) => {
   fetch(`http://localhost:3000/photos/${id}`)
    .then(res => res.json())
    .then(photos => updateStore(store, { photos }))
}