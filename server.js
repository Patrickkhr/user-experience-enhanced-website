// 1. Opzetten van de webserver

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Stel het basis endpoint in
const apiUrl = 'https://fdnd-agency.directus.app/items'

// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine
// View engine zorgt ervoor dat data die je ophaalt uit de api , waar je in je code dingen mee doet, daar html van maakt
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'))

// Zorg dat werken met request data makkelijker wordt
app.use(express.urlencoded({ extended: true }));



/*** Routes & data ***/
const storyData = await fetchJson(apiUrl + '/tm_story')

// Maak een GET route voor de index
// Stap 1
app.get('/', function(request, response) {
  response.render('index')
})

// Stap 2
app.get('/lessons', function(request, response) {
  Promise.all([
  fetchJson('https://fdnd-agency.directus.app/items/tm_story'),
  fetchJson('https://fdnd-agency.directus.app/items/tm_language'),
  fetchJson('https://fdnd-agency.directus.app/items/tm_playlist'),
  fetchJson('https://fdnd-agency.directus.app/items/tm_audio')]).then(([storyData, languageData, playlistData, audioData]) => {
    response.render('lessons', {stories: storyData.data, 
      language: languageData.data,
      playlist: playlistData.data,
      audio: audioData.data,
      likes: likes
    })
  });
})

app.get('/all-stories', function(request, response) {
  Promise.all([
  fetchJson('https://fdnd-agency.directus.app/items/tm_story'),
  fetchJson('https://fdnd-agency.directus.app/items/tm_language')]).then(([storyData, languageData]) => {
    response.render('all-stories', {
      stories: storyData.data,
      language: languageData.data
    })
  });
})

// Maak een POST route voor het verwerken van like/unlike acties

let likes = {}

app.post('/:playlistId/like-or-unlike', function(request, response) {
    const playlistId = Number(request.params.playlistId);
    const actionn = request.body.actionn; // Retrieve the value of the 'actie' parameter from the form
    

  // console.log(actionn, playlistId)
    // Implement the logic to handle liking or unliking the playlist
    if (actionn === 'liked') {
      // Handle 'like' action
      likes[playlistId] = true
    } else if (actionn === 'unliked') {
      likes[playlistId] = false
    } 

    if (request.body.enhanced) {
      // Haal de playlists uit de API op..
      // Geef die playlists _en_ de likes door aan de liked-playlist.ejs partial, en render die
      fetchJson('https://fdnd-agency.directus.app/items/tm_playlist').then((playlistData) => {
        response.render('partials/liked-playlist', {
          playlist: playlistData.data,
          likes: likes
        })
      });
      likes[playlistId] = true
    } else {
      likes[playlistId] = false
      response.redirect(303, '/lessons')
    }
  })


// 3. Start de webserver
// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})