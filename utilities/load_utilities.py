#!/usr/bin/python3

"""

Utilities for the Load part of our ETL process.

These utilities manage data in our NoSQL database.

Owner : paul-tqh-nguyen

Created : 06/24/2019

File Name : load_utilities.py

File Organization:
* Imports
* MongoDB General Connection Utilities
* MongoDB Accessor Utilities
* Main Runner

"""

###########
# Imports #
###########

from functools import lru_cache
import getpass
import urllib.parse
import pymongo

########################################
# MongoDB General Connection Utilities #
########################################

RECENT_PAPERS_DB_NAME="arxivRecentPapers"
RECENT_PAPERS_COLLECTION_NAME="recentPapers"

@lru_cache(maxsize=1)
def _get_username_and_password():
    print("Please Enter In Your Credentials To Access the arXiv Recent Papers Cache DB.")
    username = input("Username: ")
    password = getpass.getpass("Password: ")
    return username, password

MONGO_DB_CONNECTION_URL_FORMAT_STRING = "mongodb+srv://{username}:{password}@arxiv-news-paper-v2tf1.mongodb.net/test?retryWrites=true&w=majority"

def _arxiv_mongo_db_connection_url():
    username, password = _get_username_and_password() # @todo handle bad authentication info gracefully
    username_quoted = urllib.parse.quote_plus(username)
    password_quoted = urllib.parse.quote_plus(password)
    mongo_db_connection_url = MONGO_DB_CONNECTION_URL_FORMAT_STRING.format(username=username_quoted, password=password_quoted)
    return mongo_db_connection_url

@lru_cache(maxsize=1)
def _arxiv_mongo_db_client():
    mongo_db_connection_url = _arxiv_mongo_db_connection_url()
    client = pymongo.MongoClient(mongo_db_connection_url)
    return client

def _arxic_recent_papers_db(client):
    db = client.get_database(RECENT_PAPERS_DB_NAME)
    return db

##############################
# MongoDB Accessor Utilities #
##############################

def _arxiv_recent_papers_collection():
    client = _arxiv_mongo_db_client()
    db = _arxic_recent_papers_db(client)
    arxiv_recent_papers_collection = pymongo.collection.Collection(db,RECENT_PAPERS_COLLECTION_NAME)
    return arxiv_recent_papers_collection

def arxiv_recent_paper_docs_as_dicts():
    arxiv_recent_papers_collection = _arxiv_recent_papers_collection()
    arxiv_recent_paper_json_docs = [doc for doc in arxiv_recent_papers_collection.find({})]
    return arxiv_recent_paper_json_docs

###############
# Main Runner #
###############

def main():
    print("This is the library for data loading utilities used in the ETL process of arxiv_as_a_newspaper. See https://github.com/paul-tqh-nguyen/arxiv_as_a_newspaper for more details.")
    # @todo remove all of the below once stability is reached.
    docs = arxiv_recent_paper_docs_as_dicts()
    print("docs")
    print(docs)
    return None

if __name__ == '__main__':
    main()
