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
* MongoDB Writing Utilities
* MongoDB Document Deletion Utilities
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
    username, password = _get_username_and_password()
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

def _clear_credentials_caches():
    _get_username_and_password.cache_clear()
    _arxiv_mongo_db_client.cache_clear()
    return None

def _print_authentication_failed_message():
    print("Attempt to authenticate with the given credentials failed.\n")
    return None

##############################
# MongoDB Accessor Utilities #
##############################

def _error_is_authentication_error(error):
    error_string = str(error)
    credentials_cannot_be_authenticated = (isinstance(error, pymongo.errors.OperationFailure) and "Authentication failed." == error_string)
    password_is_empty = (isinstance(error, pymongo.errors.ConfigurationError) and "A password is required." == error_string)
    username_is_empty = (isinstance(error, pymongo.errors.InvalidURI) and "The empty string is not valid username." == error_string)
    bad_auth_authentication_failed = (isinstance(error, pymongo.errors.OperationFailure) and "bad auth Authentication failed." == error_string)
    error_is_authentication_error =  credentials_cannot_be_authenticated or password_is_empty or username_is_empty or bad_auth_authentication_failed
    return error_is_authentication_error

def _ensure_that_collection_is_valid_wrt_authentication(collection):
    is_valid = False
    try:
        is_valid = (collection.count_documents({}) is not None)
    except Exception as error:
        is_valid = False
        if _error_is_authentication_error(error):
            _clear_credentials_caches()
        else:
            raise Exception("Unexpected handled error: {error}".format(error=error))
    return is_valid

def _arxiv_recent_papers_collection():
    number_of_attempts = 0
    max_number_of_attempts = 10
    arxiv_recent_papers_collection_is_valid_wrt_authentication = False
    while not arxiv_recent_papers_collection_is_valid_wrt_authentication and number_of_attempts < max_number_of_attempts:
        number_of_attempts += 1
        arxiv_recent_papers_collection = None
        try:
            client = _arxiv_mongo_db_client()
            db = _arxic_recent_papers_db(client)
            arxiv_recent_papers_collection = pymongo.collection.Collection(db,RECENT_PAPERS_COLLECTION_NAME)
        except Exception as error:
            if _error_is_authentication_error(error):
                _clear_credentials_caches()
            else:
                raise Exception("Unexpected handled error: {error}".format(error=error))
        arxiv_recent_papers_collection_is_valid_wrt_authentication = arxiv_recent_papers_collection is not None and _ensure_that_collection_is_valid_wrt_authentication(arxiv_recent_papers_collection)
        if not arxiv_recent_papers_collection_is_valid_wrt_authentication:
            _print_authentication_failed_message()
        if number_of_attempts >= max_number_of_attempts and not arxiv_recent_papers_collection_is_valid_wrt_authentication:
            raise SystemExit("Could not connect to the DB after {max_number_of_attempts} attempts. Exiting.".format(max_number_of_attempts=max_number_of_attempts))
    return arxiv_recent_papers_collection

def arxiv_recent_paper_docs_as_dicts():
    arxiv_recent_papers_collection = _arxiv_recent_papers_collection()
    arxiv_recent_paper_json_docs = [doc for doc in arxiv_recent_papers_collection.find({})]
    return arxiv_recent_paper_json_docs

#############################
# MongoDB Writing Utilities #
#############################

def write_documents_as_dicts_to_arxiv_recent_papers_collection(dicts):
    '''
    Returns number of documents stored
    '''
    success_status = False
    arxiv_recent_papers_collection = _arxiv_recent_papers_collection()
    dicts = list(dicts)
    arxiv_recent_papers_collection.insert_many(dicts)
    number_of_documents_stored = len(dicts)
    return number_of_documents_stored

#######################################
# MongoDB Document Deletion Utilities #
#######################################

def clear_arxiv_recent_papers_collection_of_all_documents_in_research_field(research_field):
    '''
    Returns number of delected documents.
    '''
    arxiv_recent_papers_collection = _arxiv_recent_papers_collection()
    deletion = arxiv_recent_papers_collection.delete_many({"research_field" : research_field})
    deleted_count = deletion.deleted_count
    return deleted_count

###############
# Main Runner #
###############

def main():
    print("This is the library for data loading utilities used in the ETL process of arxiv_as_a_newspaper. See https://github.com/paul-tqh-nguyen/arxiv_as_a_newspaper for more details.")
    return None

if __name__ == '__main__':
    main()
