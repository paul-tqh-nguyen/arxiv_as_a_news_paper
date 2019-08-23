# arxiv_as_a_newspaper

Some of us read papers from https://arxiv.org/ to keep up to date with the state of the art in whatever field we work in. 

We treat it as a news source. 

It would be interesting to investigate the impacts of having the user experience of https://arxiv.org/ match that of older or more traditional news sources. 

This is a front-end for the content of https://arxiv.org/ that resembles a news paper.

A demo is available at https://paul-tqh-nguyen.github.io/arxiv_as_a_newspaper/ for the front-end functionality.

## Arichecture

This repository contains 2 distinct functional sub-systems. 

### ETL

We need to be able to query for the names, abstracts, authors, etc. of recently published research shown on https://arxiv.org/.

~~https://arxiv.org/ does not have an [API](https://en.wikipedia.org/wiki/Representational_state_transfer).~~

UPDATE: After progress on our ETL has already been completed, we learned about the existence of their [API](https://arxiv.org/help/api). Had this been known prior to the completion of our ETL utilities, then design decisions would have been made differently. 

Our [ETL](https://en.wikipedia.org/wiki/Extract,_transform,_load) functionality, the first of our 2 distinct functional sub-systems, is what provides us access to the content from https://arxiv.org/.

Our [ETL](https://en.wikipedia.org/wiki/Extract,_transform,_load) will scrape https://arxiv.org/ (or a mirror, see https://arxiv.org/help/mirrors) and store the information into a database that our front end will access. 

NOTE: The extraction process can take a long time as we want to avoid being throttled or blocked. 

Our [ETL](https://en.wikipedia.org/wiki/Extract,_transform,_load) functionality is not currently run on a regular basis through automation nor are there plans to do so until our front end interface finds a non-ephemeral home.

The scraping is implemented in [Python3](https://www.python.org/download/releases/3.0/) via [Beautiful Soup](https://en.wikipedia.org/wiki/Beautiful_Soup_(HTML_parser)).

Manual and automated [testing](https://en.wikipedia.org/wiki/Software_testing) has only taken place via [Linux](https://en.wikipedia.org/wiki/Linux)-like operating systems. 

Please report any issues regarding [ETL](https://en.wikipedia.org/wiki/Extract,_transform,_load) troubles on other operating system flavors, e.g. [Windows](https://en.wikipedia.org/wiki/Microsoft_Windows).

### Front End UI

Our front end UI is the crux of this project. 

Our front end displays from abstracts of recent papers shown on https://arxiv.org/ along with their authors, relevant research fields, etc. in a way that resembles a newspaper or the website of one.

Our front end is implemented in [React](https://reactjs.org/).

Our front end connects to our DB via [MongoDB Stitch](https://medium.com/@nparsons08/mongodb-stitch-your-application-backend-delivered-as-a-service-7cf21d979ed). For more details on this implementation, see [Notes Regarding Stitch](https://github.com/paul-tqh-nguyen/arxiv_as_a_newspaper/wiki/Notes-Regarding-Stitch).

## Instructions For Use

See the sub-sections below for details on how to use our ETL utilities or our front end interface. 

### ETL Only Instructions

Our ETL process scrapes https://arxiv.org/ for information on the most recent papers archived there and stores it in our [NoSQL](https://en.wikipedia.org/wiki/NoSQL) database. We are currently using  [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). 

To execute our ETL entire process (i.e. scraping https://arxiv.org/ and storing the results into our DB), run the following command from the top most level of the checkout:

```
./arxiv_as_a_newspaper.py -run-etl-process
```

You will be prompted for credentials to write to our DB.

### Front End Only Instructions

If you want to simply use our front end interface (the info for the papers shown will be from our latest scrape of https://arxiv.org/), run the following command from the top most level of the checkout:

```
./arxiv_as_a_newspaper.py -start-front-end-server
```

### Front End Deployment Instructions

If local changes are made to the front end functionality, we can deploy them to our demo site at https://paul-tqh-nguyen.github.io/arxiv_as_a_newspaper/ via the following command:
```
./arxiv_as_a_newspaper.py -deploy
```

Credentials are required.

### End-To-End Instructions

To run our entire end-to-end process (which is simply running our ETL process, writing the results to our DB, and then starting the front end server), run the following command from the top most level of the checkout:

```
./arxiv_as_a_newspaper.py -end-to-end
```

NOTE: The ETL process can take a long time as we want to avoid being throttled or blocked. 

## Troubleshooting Tips

This section contains some tips for troubleshooting any installation or run-time problems. 

All of the notes below stem from troubles repoted by our end users and are stored on our [wiki](https://github.com/paul-tqh-nguyen/arxiv_as_a_newspaper/wiki).

This list is incomplete. 

Trouble Shooting Tips:
* [Debugging Dependencies](https://github.com/paul-tqh-nguyen/arxiv_as_a_newspaper/wiki/Debugging-Dependencies)
* [Linux Lamentations](https://github.com/paul-tqh-nguyen/arxiv_as_a_newspaper/wiki/Linux-Lamentations)
