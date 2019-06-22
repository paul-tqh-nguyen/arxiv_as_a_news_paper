# arxiv_as_a_newspaper

Some of us read papers from https://arxiv.org/ to keep up to date with the state of the art in whatever field we work in. 

We treat it as a news source. 

It would be interesting to investigate the impacts of having the user experience of https://arxiv.org/ match that of older or more traditional news sources. 

This is a front-end for the content of https://arxiv.org/ that resembles a news paper. 

Progress is ongoing. 

## Arichecture

This repository contains 2 distinct functional sub-systems. 

### ETL

We need to be able to query for the names, abstracts, authors, etc. of recently published research shown on https://arxiv.org/.

https://arxiv.org/ does not have an [API](https://en.wikipedia.org/wiki/Representational_state_transfer).

https://arxiv.org/ cannot provide it, so we must provide it via our [ETL](https://en.wikipedia.org/wiki/Extract,_transform,_load) functionality, the first of our 2 distinct functional sub-systems.

Our [ETL](https://en.wikipedia.org/wiki/Extract,_transform,_load) will scrape https://arxiv.org/ and store the information into a database that our front end will access. 

Our [ETL](https://en.wikipedia.org/wiki/Extract,_transform,_load) functionality is not currently run on a regular basis through automation nor are there plans to do so until our front end interface finds a non-ephemeral home.

The scraping is implemented in [Python3](https://www.python.org/download/releases/3.0/) via [Beautiful Soup](https://en.wikipedia.org/wiki/Beautiful_Soup_(HTML_parser)).

Our database is implemented as a [NoSQL](https://en.wikipedia.org/wiki/NoSQL) database via [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). 

### Front End UI

Our front end UI is the crux of this project. 

Our front end displays from abstracts of recent papers shown on https://arxiv.org/ along with their authors, relevant research fields, etc. in a way that resembles a newspaper or the website of one.

Our front end is implemented in [React](https://reactjs.org/). 
