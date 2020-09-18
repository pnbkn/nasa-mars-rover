let store = {
    id: 5,
    photos: '',
    rovers: [{id: 5, name: 'Curiosity'}, {id: 6, name: 'Opportunity'}, {id: 7, name: 'Spirit'}],
}

// let store = Immutable.fromJS({ 
//     id: 5,
//     photos: '',
//     rovers: Immutable.fromJS(['Curiosity', 'Opportunity', 'Spirit'])
// })

// function updateStore(state, newState) {
//     store = state.merge(newState)
//     render(root, store)
// }    
//console.log(store.getIn(['user', 'name']))
// add our markup to the page

const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
    console.log("STORE ", store)
}

// const updateStore = (state, newState) => {
//     store = state.merge(newState)
//     render(root, store)
//     console.log("STORE ", store)
// }

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    console.log("APP ", state)
    let { rovers, photos, id} = state;
    const statusBar = document.querySelector('.status-bar');
    console.log("STATUS ", id)
    return `
        <nav>
        <ul class="navigation">
            ${NavLinks(rovers)}
        </ul>
        </nav>
        <header>
            <div class="status-bar">
            ${photoImages(photos, "info", id)}
            </div>
        </header>
        <main>
            <section>
                <ul class="grid">
                ${photoImages(photos, "photos", id)}
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

const NavLinks = (rovers)=> rovers.map(rover => (`<li class="rover" id=${rover.name} onclick="displayRover(${rover.id})"><h2>${rover.name}</h2></li>`)).join("")


const displayRover = (id)=>{
    const statusBar = document.querySelector('.rover');
    getPhotos(store, id);
    return(statusBar.setAttribute("id", id))
}

const photoImages = (photosArr, type, id) => {

    const {photos} = photosArr;
    const statusBar = document.querySelector('.status-bar');
    const grid = document.querySelector('.grid');
    if(!photosArr){
        getPhotos(store, id);
    }
    
    const mapArr = photos.photos;
  
        if(type === "info"){
            return(`
            <div class="sub-nav">
                <h1>${mapArr[0].rover.name}</h1><br/>
                <div class="status">
                    <h4>Status: <span>${mapArr[0].rover.status}</span> </h4> |
                    <h4>Landing Date: <span>${mapArr[0].rover.landing_date}</span></h4> |
                    <h4>Launch Date: <span>${mapArr[0].rover.launch_date}</span></h4>
                </div>
            </div>
            `)
        }
        else{
            return (
                mapArr.map(photo => {
                    return(`
                    <li>
                    <img src="${photo.img_src}" />
                    </li>`)
                }).join("")
            )
        
        }

}

// ------------------------------------------------------  API CALLS

const getRovers = (state) => {
    let { rovers } = state

    fetch(`http://localhost:3000/rovers`)
        .then(res => res.json())
        .then(rovers => updateStore(store, { rovers }))

    return data
}


const getPhotos = (state, id) => {
    let { photos } = state;
    // let id = 5;
    console.log("PHST ", photos)
    fetch(`http://localhost:3000/photos/${id}`)
        .then(res => res.json())
        .then(photos => updateStore(store, { photos }))
    return photos
}

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
// const Greeting = (name) => {
//     if (name) {
//         return `
//             <h1>Welcome, ${name}!</h1>
//         `
//     }

//     return `
//         <h1>Hello!</h1>
//     `
// }

// Example of a pure function that renders infomation requested from the backend
// const ImageOfTheDay = (apod) => {

//     // If image does not already exist, or it is not from today -- request it again
//     const today = new Date()
//     const photodate = new Date(apod.date)
//     console.log(photodate.getDate(), today.getDate());

//     console.log(photodate.getDate() === today.getDate());
//     if (!apod || apod.date === today.getDate() ) {
//         getImageOfTheDay(store)
//     }

//     // check if the photo of the day is actually type video!
//     if (apod.media_type === "video") {
//         return (`
//             <p>See today's featured video <a href="${apod.url}">here</a></p>
//             <p>${apod.title}</p>
//             <p>${apod.explanation}</p>
//         `)
//     } else {
//         return (`
//             <img src="${apod.image.url}" height="350px" width="100%" />
//             <p>${apod.image.explanation}</p>
//         `)
//     }
// }