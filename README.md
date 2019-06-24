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


### Front End UI

Our front end UI is the crux of this project. 

Our front end displays from abstracts of recent papers shown on https://arxiv.org/ along with their authors, relevant research fields, etc. in a way that resembles a newspaper or the website of one.

Our front end is implemented in [React](https://reactjs.org/). 

## Instructions For Use

See the sub-sections below for details on how to use our ETL utilities or our front end interface. 

### ETL Only Instructions

Our ETL process scrapes https://arxiv.org/ for information on the most recent papers archived there and stores it in our [NoSQL](https://en.wikipedia.org/wiki/NoSQL) database. We are currently using  [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). 

To execute our ETL entire process (i.e. scraping https://arxiv.org/ and storing the results into our DB), run the following command from the top most level of the checkout:

```
./arxiv_as_a_newspaper -run-etl-process
```

You will be prompted for credentials to write to our DB.

To execute our ETL process and write the results to a `.json` file rather than writing to our DB, run the following command from the top most level of the checkout:

```
./arxiv_as_a_newspaper -write-etl-results-to-file <destiation.json>
```

### Front End Only Instructions

If you want to simply use our front end interface (the info for the papers shown will be from our latest scrape of https://arxiv.org/), run the following command from the top most level of the checkout:

```
./arxiv_as_a_newspaper -start-front-end-server
```

### End-To-End Instructions

To run our entire end-to-end process (which is simply running our ETL process, writing ther esults to our DB, and then starting the front end server), run the following command from the top most level of the checkout:

```
./arxiv_as_a_newspaper -end-to-end
```

## Debugging Dependencies

Here is an incomplete list of commands that might come in useful if you're having trouble with missing libraries when attempting to use any of our tools:

```
sudo pip3 install bs4
sudo pip3 install pymongo
sudo pip3 install dnspython
```
