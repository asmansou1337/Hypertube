# Hypertube Project
- A web application that allows a registred user to research and watch movies.
- This project is part of the 1337 Khouribga Curriculum.

- **Installation**
  - this project run using docker
  - Follow this [instructions](how-to-install.md) to launch the project

### Project details:
 - **User part :**
  - Registration page:
     - at least an email address, a username, a last name, a first name and a password
     - After the registration, an e-mail with an unique link must be sent to the registered user to verify his account
    
 ![Alt text](screenshots/signup.png?raw=true "SignUP")
 - Login Page:
    - connect with his/her username and password
    - able to receive an email allowing him/her to re-initialize his/her password in case of forgetting his/her password 
    - disconnect with 1 click from any pages on the site.
    - login with Omniauth (the 42 strategy or google strategy)
    
 ![Alt text](screenshots/login.png?raw=true "Login")
  - User profile:
    - Once connected the user can modify his profile or password
    - The user must be able to select a preferred language that will be English by default
    
 ![Alt text](screenshots/edit-profile.png?raw=true "Edit")
    
 - **Search part :**
 - The search engine will interrogate at least two external sources (yts and 1337x), and return the ensemble of results in thumbnails forms.

 ![Alt text](screenshots/search.png?raw=true "Search")
 - The user can filter/sort or search by name for movies:

 ![Alt text](screenshots/search_filter.png?raw=true "Filter Search")
 
 - **Video part :**
 - This section present the details of a movie

 ![Alt text](screenshots/movie-detail.png?raw=true "Movie Detail")
 
 - The users have the option of leaving a comment on the video, and see the list of prior comments.

 ![Alt text](screenshots/comments.png?raw=true "Movie Comments")

 - Subtitles for the movie are also available (English + French)

 ![Alt text](screenshots/subtitles.png?raw=true "Movie Subtitle")
 
 - The user can see his favorites/watchlist movies
 
 ![Alt text](screenshots/mymovies.png?raw=true "Movies")
 ![Alt text](screenshots/watched.png?raw=true "Movies")
 
