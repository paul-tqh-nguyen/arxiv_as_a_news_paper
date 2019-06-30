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
    research_field_and_dicts_to_store_in_db_pairs_iterator = extract_transform_utilities.research_field_and_dicts_to_store_in_db_pairs_iterator()
    for research_field, dicts_to_store in research_field_and_dicts_to_store_in_db_pairs_iterator:
        print("Clearing the external DB of data relevant to the field that is {research_field}.".format(research_field=research_field))
        load_utilities.clear_arxiv_recent_papers_collection_of_all_documents_in_research_field(research_field)
        number_of_documents_stored = load_utilities.write_documents_as_dicts_to_arxiv_recent_papers_collection(dicts_to_store)
        print("Number of documents to be stored: {number_of_documents_stored}".format(number_of_documents_stored=number_of_documents_stored))
    print("ETL Process has completed.")
    return None

###############
# Main Runner #
###############

def main():
    print("This is the library for initializing the ETL processes of arxiv_as_a_newspaper. See https://github.com/paul-tqh-nguyen/arxiv_as_a_newspaper for more details.")
    return None

if __name__ == '__main__':
    main()
