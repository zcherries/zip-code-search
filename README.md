# Zip Code Search

After dowloading repository, navigate to the directory in a terminal window and start the server:

nodemon server.js

Navigate to [http://localhost:8080/](http://localhost:8080/) in your browser.

## Notes about widgit:
This widgit searches for a zip code in the database, and then displays the city, state, and loads a map of the location. Zip codes are validated for a 5-digit number. Anything else will not be processed. If the zip code cannot be found, then it will display an error message.

No external libraries were used in this pure JavaScript zip code lookup widgit.