## Installing:

**Inside the project folder, Open two terminals**
- In the first terminal (the front server)
    1. Change the keys
        - cd client/config
        - vim keys.js
     
    2. Launch the script startClient
      
    3. Install the dependencies 
      - npm install

    4. Run the server:
      - nodemon run
      
- In the second terminal (the backend server)
    1. Change the keys
        - cd server/config
        - vim apiConf.js
        - change the imdbKey
     
    2. Launch the script startServer
    
    3. Install the dependencies 
      - npm install

    4. Run the server:
      - nodemon run
      
  To get the imdbKey, see infos here: https://www.npmjs.com/package/imdb-api
