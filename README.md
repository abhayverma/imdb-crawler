# Node + Express + React IMDB Web Crawler
Contains API and React FrontEnd for crawling and listing the IMDB top movies

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them

```
npm - https://www.npmjs.com/get-npm
```

### Installing

A step by step guide that tell you how to get a development env running


Clone the repo locally, then using terminal navigate into the cloned repo and run the below command to install node packages:

```
npm i
cd client
npm i
```
This will install node packages for server and client

Once the packages are installed, use terminal window to start local instance

### Server:
```
node index.js
```
OR

```
node .
```

Please wait until the server crawls the initial set of movies from IMDB. Start the client once you see the "Crawling completed" message on your terminal window running the server instance.

Start a new terminal window to run the client instance, move inside the client directory of your project repo.
### Client:
```
cd client
npm start
```

The application crawls imdb when react app is mounted and then uses state management to internally search through the fetched movie list.

## Authors

* **Abhay Verma** - *Initial work* - [AbhayVerma](https://github.com/abhayverma)
