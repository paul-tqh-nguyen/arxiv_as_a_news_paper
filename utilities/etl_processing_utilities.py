#!/usr/bin/python3

"""

Utilities for running our ETL process.

This file is mostly an interface to the ETL process; no low-level details here. 

Owner : paul-tqh-nguyen

Created : 06/25/2019

File Name : etl_processing_utilities.py

File Organization:
* Imports
* ETL Interface
* Main Runner

"""

###########
# Imports #
###########

import utilities.load_utilities as load_utilities
import utilities.extract_transform_utilities as extract_transform_utilities

#################
# ETL Interface #
#################

def run_etl_process():
    print("Starting scraping process.")
    print()
    dicts_to_store_in_db_iterator = extract_transform_utilities.dicts_to_store_in_db_iterator()
    dicts_to_store_in_db = list(dicts_to_store_in_db_iterator)
    print("Clearing the external DB.")
    load_utilities.clear_arxiv_recent_papers_collection_of_all_documents()
    num_documents_to_be_stored = len(dicts_to_store_in_db)
    print("Number of documents to be stored: {num_documents_to_be_stored}".format(num_documents_to_be_stored=num_documents_to_be_stored))
    load_utilities.write_write_documents_as_dicts_to_arxiv_recent_papers_collection(dicts_to_store_in_db)
    print("ETL Process has completed.")
    return None

###############
# Main Runner #
###############

def main():
    print("This is the library for initializing the ETL processes of arxiv_as_a_newspaper. See https://github.com/paul-tqh-nguyen/arxiv_as_a_newspaper for more details.")
    # @todo remove all of the below once stability is reached.
    run_etl_process()
    return None

if __name__ == '__main__':
    main()
