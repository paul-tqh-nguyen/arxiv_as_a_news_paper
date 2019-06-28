#!/usr/bin/python3

"""

Utilities for the Extract & Transform parts of our ETL process.

These utilities scrape info about recent research made in several fields from  https://arxiv.org/

Owner : paul-tqh-nguyen

Created : 06/23/2019

File Name : extract_transform_utilities.py

File Organization:
* Imports
* arXiv Scraping Utilities for General Use
* arXiv Scraping Utilities for Main Page
* arXiv Scraping Utilities for "Recent" Pages
* Transformation Utilities
* Main Runner

"""

###########
# Imports #
###########

from functools import lru_cache
import re
import requests
from bs4 import BeautifulSoup
import urllib.parse
import functools
import itertools
import time
import random

############################################
# arXiv Scraping Utilities for General Use #
############################################

ARXIV_URL = "https://arxiv.org/"
ARXIV_URL_CHINA_MIRROR = "http://cn.arxiv.org/"
ARXIV_URL_GERMANY_MIRROR = "http://de.arxiv.org/"
ARXIV_URL_INDIA_MIRROR = "http://in.arxiv.org/"

def _remove_urls_likely_to_block_us_for_scraping(urls):
    urls.remove(ARXIV_URL)
    return urls

def _arxiv_base_url():
    all_arxiv_urls = [ARXIV_URL, ARXIV_URL_CHINA_MIRROR, ARXIV_URL_GERMANY_MIRROR, ARXIV_URL_INDIA_MIRROR]
    arxiv_urls_that_will_not_block_us = _remove_urls_likely_to_block_us_for_scraping(all_arxiv_urls)
    arbitrary_arxiv_url_that_will_not_block_us = random.choice(arxiv_urls_that_will_not_block_us)
    return arbitrary_arxiv_url_that_will_not_block_us

SECONDS_TO_SLEEP_PRIOR_TO_HITTING_URL = 5

@lru_cache(maxsize=8192)
def _safe_get_text_at_url(url):
    text = ""
    number_of_attempts = 0
    max_number_of_attempts = 5
    while number_of_attempts < max_number_of_attempts and text == "":
        try:
            time.sleep(SECONDS_TO_SLEEP_PRIOR_TO_HITTING_URL)
            get_response = requests.get(url)
            text = get_response.text
        except requests.exceptions.ConnectionError as err:
            number_of_attempts += 1
            number_of_seconds_to_sleep = number_of_attempts * 10
            if number_of_attempts < max_number_of_attempts:
                print("Could not reach {url}; sleeping {number_of_seconds_to_sleep} seconds before attempting again.".format(url=url, number_of_seconds_to_sleep=number_of_seconds_to_sleep))
                time.sleep(number_of_seconds_to_sleep)
            else:
                print("Could not reach {url} after {max_number_of_attempts} attempts; giving up.".format(url=url, max_number_of_attempts=max_number_of_attempts))
    return text

def _concatenate_relative_link_to_arxiv_base_url(relative_link):
    arxiv_base_url = _arxiv_base_url()
    return urllib.parse.urljoin(arxiv_base_url, relative_link)

##########################################
# arXiv Scraping Utilities for Main Page #
##########################################

def _arxiv_main_page_text():
    arxiv_base_url = _arxiv_base_url()
    arxiv_main_page_text = _safe_get_text_at_url(arxiv_base_url)
    return arxiv_main_page_text

def _arxiv_recent_page_title_and_page_link_string_iterator():
    '''
    Returns an iterator that yields tuples of the form (RESEARCH_FIELD_NAME, ARXIV_LINK_TO_RECENT_PAPERS_PAGE_RELEVANT_TO_FIELD), e.g. ('General Economics', 'https://arxiv.org/list/econ.GN/recent').
    '''
    text = _arxiv_main_page_text()
    soup = BeautifulSoup(text, features="lxml")
    anchor_links = soup.find_all("a")
    arxiv_recent_page_relevant_anchor_link_iterator = filter(_anchor_link_is_arxiv_recent_page_link_with_research_field_denoting_text, anchor_links)
    arxiv_recent_page_title_and_page_link_string_iterator = map(_extract_text_and_link_string_from_arxiv_anchor_link, arxiv_recent_page_relevant_anchor_link_iterator)
    return arxiv_recent_page_title_and_page_link_string_iterator

def _extract_text_and_link_string_from_arxiv_anchor_link(anchor_link):
    link_text = anchor_link.text
    relative_link_string = anchor_link.get("href")
    absolute_relative_link_string = _concatenate_relative_link_to_arxiv_base_url(relative_link_string)
    return (link_text, absolute_relative_link_string)

def _anchor_link_is_arxiv_recent_page_link_with_research_field_denoting_text(anchor_link):
    href_attribute = anchor_link.get("href")
    link_text = anchor_link.text
    anchor_link_is_arxiv_recent_page_link = _is_arxiv_recent_page_link(href_attribute)
    anchor_link_is_arxiv_recent_page_link_with_research_field_denoting_text = None
    if anchor_link_is_arxiv_recent_page_link:
        anchor_link_has_research_field_denoting_text = not (link_text == "recent") # @todo expand as needed
        anchor_link_is_arxiv_recent_page_link_with_research_field_denoting_text = anchor_link_has_research_field_denoting_text
    else:
        anchor_link_is_arxiv_recent_page_link_with_research_field_denoting_text = False
    assert anchor_link_is_arxiv_recent_page_link_with_research_field_denoting_text is not None, "{function} logic is flawed.".format(function=_anchor_link_is_arxiv_recent_page_link_with_research_field_denoting_text)
    return anchor_link_is_arxiv_recent_page_link_with_research_field_denoting_text

arxiv_recent_page_link_reg_ex = re.compile("/list/.+/recent")

def _is_arxiv_recent_page_link(link_string):
    string_pattern_match_result = arxiv_recent_page_link_reg_ex.match(link_string)
    is_arxiv_recent_page_link = (string_pattern_match_result is not None)
    return is_arxiv_recent_page_link

###############################################
# arXiv Scraping Utilities for "Recent" Pages #
###############################################

def _extract_info_from_recent_page_url_as_dicts(recent_page_url):
    '''
    Returns an iterator of dictionaries intended to look like JSON. 
    Each dict looks something like this:
    {"page_link": "https://arxiv.org/abs/1906.08550",
    "research_paper_title": "Chemical Compositions of Field and Globular Cluster RR~Lyrae Stars: II.  omega Centauri", 
    "author_info": [{"author": "D. Magurno", "author_link": "https://arxiv.org/search/astro-ph?searchtype=author&query=Magurno%2C+D"}, 
                    {"author": "C. Sneden", "author_link": "https://arxiv.org/search/astro-ph?searchtype=author&query=Sneden%2C+C"}, 
                    {"author": "G. Bono", "author_link": "https://arxiv.org/search/astro-ph?searchtype=author&query=Bono%2C+G"}, 
                    {"author": "V. F. Braga", "author_link": "https://arxiv.org/search/astro-ph?searchtype=author&query=Braga%2C+V+F"}, 
                    {"author": "M. Mateo", "author_link": "https://arxiv.org/search/astro-ph?searchtype=author&query=Mateo%2C+M"}, 
                    {"author": "S. E. Persson", "author_link": "https://arxiv.org/search/astro-ph?searchtype=author&query=Persson%2C+S+E"}, 
                    {"author": "G. Preston", "author_link": "https://arxiv.org/search/astro-ph?searchtype=author&query=Preston%2C+G"},
                    {"author": "F. Thevenin", "author_link": "https://arxiv.org/search/astro-ph?searchtype=author&query=Thevenin%2C+F"},
                    {"author": "R. da Silva", "author_link": "https://arxiv.org/search/astro-ph?searchtype=author&query=da+Silva%2C+R"},
                    {"author": "M. Dall\'Ora", "author_link": "https://arxiv.org/search/astro-ph?searchtype=author&query=Dall%27Ora%2C+M"},
                    {"author": "M. Fabrizio", "author_link": "https://arxiv.org/search/astro-ph?searchtype=author&query=Fabrizio%2C+M"},
                    {"author": "I. Ferraro", "author_link": "https://arxiv.org/search/astro-ph?searchtype=author&query=Ferraro%2C+I"},
                    {"author": "G. Fiorentino", "author_link": "https://arxiv.org/search/astro-ph?searchtype=author&query=Fiorentino%2C+G"},
                    {"author": "G. Iannicola", "author_link": "https://arxiv.org/search/astro-ph?searchtype=author&query=Iannicola%2C+G"},
                    {"author": "L. Inno", "author_link": "https://arxiv.org/search/astro-ph?searchtype=author&query=Inno%2C+L"},
                    {"author": "M. Marengo", "author_link": "https://arxiv.org/search/astro-ph?searchtype=author&query=Marengo%2C+M"},
                    {"author": "S. Marinoni", "author_link": "https://arxiv.org/search/astro-ph?searchtype=author&query=Marinoni%2C+S"},
                    {"author": "P. M. Marrese", "author_link": "https://arxiv.org/search/astro-ph?searchtype=author&query=Marrese%2C+P+M"},
                    {"author": "C. E. Martinez-Vazquez", "author_link": "https://arxiv.org/search/astro-ph?searchtype=author&query=Martinez-Vazquez%2C+C+E"},
                    {"author": "N. Matsunaga", "author_link": "https://arxiv.org/search/astro-ph?searchtype=author&query=Matsunaga%2C+N"},
                    {"author": "M. Monelli", "author_link": "https://arxiv.org/search/astro-ph?searchtype=author&query=Monelli%2C+M"},
                    {"author": "J. R. Neeley", "author_link": "https://arxiv.org/search/astro-ph?searchtype=author&query=Neeley%2C+J+R"},
                    {"author": "M. Nonino", "author_link": "https://arxiv.org/search/astro-ph?searchtype=author&query=Nonino%2C+M"},
                    {"author": "A. R. Walker", "author_link": "https://arxiv.org/search/astro-ph?searchtype=author&query=Walker%2C+A+R"}],
    "primary_subject": "Solar and Stellar Astrophysics (astro-ph.SR)",
    "secondary_subjects": ["Astrophysics of Galaxies (astro-ph.GA)"],
    "abstract": "We present a detailed spectroscopic analysis of RR Lyrae (RRL) variables in the globular cluster NGC 5139 (omega Cen). We collected optical (4580-5330 A), high resolution (R = 34,000), high signal-to-noise ratio (200) spectra for 113 RRLs with the multi-fiber spectrograph M2FS at the Magellan/Clay Telescope at Las Campanas Observatory. We also analysed high resolution (R = 26,000) spectra for 122 RRLs collected with FLAMES/GIRAFFE at the VLT, available in the ESO archive. The current sample doubles the literature abundances of cluster and field RRLs in the Milky Way based on high resolution spectra. Equivalent width measurements were used to estimate atmospheric parameters, iron, and abundance ratios for alpha (Mg, Ca, Ti), iron peak (Sc, Cr, Ni, Zn), and s-process (Y) elements. We confirm that omega Cen is a complex cluster, characterised by a large spread in the iron content: -2.58 < [Fe/H] < -0.85. We estimated the average cluster abundance as [Fe/H] = -1.80 +- 0.03, with sigma = 0.33 dex. Our findings also suggest that two different RRL populations coexist in the cluster. The former is more metal-poor ([Fe/H] < -1.5), with almost solar abundance of Y. The latter is less numerous, more metal-rich, and yttrium enhanced ([Y/Fe] > 0.4). This peculiar bimodal enrichment only shows up in the s-process element, and it is not observed among lighter elements, whose [X/Fe] ratios are typical for Galactic globular clusters."}
    '''
    info_tuples = _extract_info_from_recent_page_url(recent_page_url)
    iterator = map(_recent_page_url_info_tuple_to_dict, info_tuples)
    return iterator

def _dwim_arxiv_mirror_link_to_main_site_link(link):
    dwimmed_link = link.replace(ARXIV_URL_CHINA_MIRROR, ARXIV_URL)
    dwimmed_link = dwimmed_link.replace(ARXIV_URL_GERMANY_MIRROR, ARXIV_URL)
    dwimmed_link = dwimmed_link.replace(ARXIV_URL_INDIA_MIRROR, ARXIV_URL)
    return dwimmed_link

def _dwim_author_to_author_link_dictionaries_wrt_mirror_link(author_to_author_link_dictionaries):
    dwimmed_author_to_author_link_dictionaries = []
    for author_to_author_link_dictionary in author_to_author_link_dictionaries:
        for author in author_to_author_link_dictionary.keys():
            author_link = author_to_author_link_dictionary[author]
            dwimmed_author_link = _dwim_arxiv_mirror_link_to_main_site_link(author_link)
            author_to_author_link_dictionary[author] = dwimmed_author_link
        dwimmed_author_to_author_link_dictionaries.append(author_to_author_link_dictionary)
    return dwimmed_author_to_author_link_dictionaries

def _recent_page_url_info_tuple_to_dict(info_tuple):
    link_to_paper_page, title, author_to_author_link_dictionaries, primary_subject, secondary_subjects_iterator, abstract = info_tuple
    secondary_subjects = secondary_subjects_iterator
    link_to_paper_page = _dwim_arxiv_mirror_link_to_main_site_link(link_to_paper_page)
    author_to_author_link_dictionaries = _dwim_author_to_author_link_dictionaries_wrt_mirror_link(author_to_author_link_dictionaries)
    json_dict = {"page_link" : link_to_paper_page,
                 "research_paper_title" : title,
                 "author_info" : author_to_author_link_dictionaries, 
                 "primary_subject" : primary_subject, 
                 "secondary_subjects" : secondary_subjects,
                 "abstract" : abstract}
    return json_dict

def _extract_info_from_recent_page_url(recent_page_url):
    tuple_without_abstract_iterator = _extract_info_without_abstract_from_recent_page_url(recent_page_url)
    result_iterator = map(_append_abstract_to_info_extracted_from_recent_page_url, tuple_without_abstract_iterator)
    valid_result_iterator = filter(lambda info_tuple: info_tuple is not None, result_iterator)
    return valid_result_iterator

def _append_abstract_to_info_extracted_from_recent_page_url(info_tuple):
    link_to_paper_page, title, author_to_author_link_dictionaries, primary_subject, secondary_subjects = info_tuple
    print("link_to_paper_page")
    print(link_to_paper_page)
    abstract = _abstract_text_from_arxiv_paper_url(link_to_paper_page)
    info_tuple = None
    if abstract is not None:
        info_tuple = (link_to_paper_page, title, author_to_author_link_dictionaries, primary_subject, secondary_subjects, abstract)
    return info_tuple

def _text_claims_article_does_not_exist(text):
    reg_ex_match_result = re.search("Article [0-9]*\.[0-9]* doesn't exist", text)
    text_claims_article_does_not_exist = reg_ex_match_result is not None
    return text_claims_article_does_not_exist

def _abstract_text_from_arxiv_paper_url(paper_url):
    text = _safe_get_text_at_url(paper_url)
    url_points_to_non_existant_article = _text_claims_article_does_not_exist(text) 
    abstract_text = None
    if not url_points_to_non_existant_article:
        soup = BeautifulSoup(text, features="lxml")
        abstract_block_quote = soup.find("blockquote", {"class": "abstract mathjax"})
        abstract_span = abstract_block_quote.find("span", {"class": "descriptor"})
        abstract_text_raw = abstract_span.next_sibling
        abstract_text = abstract_text_raw.replace("\n", " ").strip()
    return abstract_text

def _extract_info_without_abstract_from_recent_page_url(recent_page_url):
    '''
    The "Recent" page includes a bunch of papers. We return an iterator yielding tuples. The tuples are of the form (LINK_TO_PAPER_PAGE, TITLE, AUTHOR_TO_AUTHOR_LINK_DICTIONARIES, PRIMARY_SUBJECT, SECONDARY_SUBJECTS).
    '''
    text = _safe_get_text_at_url(recent_page_url)
    soup = BeautifulSoup(text, features="lxml")
    definition_lists = soup.find_all('dl')
    info_tuple_iterators = map(_extract_info_tuple_iterator_from_recent_pages_definition_list, definition_lists)
    result_iterator = functools.reduce(itertools.chain, info_tuple_iterators)
    return result_iterator

def _extract_info_tuple_iterator_from_recent_pages_definition_list(definition_list):
    info_tuple_iterator = None
    definition_terms = definition_list.find_all("dt")
    definition_descriptions = definition_list.find_all("dd")
    if not len(definition_terms) == len(definition_descriptions):
        print("{definition_list} could not be parsed properly".format(definition_list=definition_list))
    else:
        term_description_doubles = zip(definition_terms, definition_descriptions)
        info_tuple_iterator = _extract_info_tuple_iterator_from_definition_term_description_doubles(term_description_doubles)
    return info_tuple_iterator

def _extract_info_tuple_iterator_from_definition_term_description_doubles(term_description_doubles):
    result = map(_extract_info_tuple_from_definition_term_description_double, term_description_doubles)
    return result

def _extract_info_tuple_from_definition_term_description_double(term_description_double):
    definition_term, definition_description = term_description_double
    
    anchor_with_relative_link_to_paper_page = definition_term.find("a", title="Abstract")
    relative_link_to_paper_page = anchor_with_relative_link_to_paper_page.get("href")
    link_to_paper_page = _concatenate_relative_link_to_arxiv_base_url(relative_link_to_paper_page)
    
    title_division = definition_description.find("div", attrs={"class":"list-title"})
    title_header_span = title_division.find("span", text="Title:", attrs={"class":"descriptor"})
    title_text_untrimmed = title_header_span.next_sibling
    title = title_text_untrimmed.strip()
    
    authors_division = definition_description.find("div", attrs={"class":"list-authors"})
    authors_division_anchors = authors_division.find_all("a")
    authors = map(lambda link: link.text, authors_division_anchors)
    author_relative_links = map(lambda link: link.get("href"), authors_division_anchors)
    author_links = map(_concatenate_relative_link_to_arxiv_base_url, author_relative_links)
    author_to_author_link_doubles = zip(authors, author_links)
    author_to_author_link_dictionary_iterator = map(_author_to_author_link_double_to_author_to_author_link_dictionary, author_to_author_link_doubles)
    author_to_author_link_dictionaries = list(author_to_author_link_dictionary_iterator)
    
    subjects_division = definition_description.find("div", attrs={"class":"list-subjects"})
    primary_subject_span = subjects_division.find("span", attrs={"class":"primary-subject"})
    primary_subject = primary_subject_span.text

    secondary_subjects_unprocessed = primary_subject_span.next_sibling
    secondary_subjects = list(filter(bool, (map(lambda string : string.strip(), secondary_subjects_unprocessed.split(";")))))
    
    result = (link_to_paper_page, title, author_to_author_link_dictionaries, primary_subject, secondary_subjects)
    return result

def _author_to_author_link_double_to_author_to_author_link_dictionary(author_to_author_link_double):
    author, author_link = author_to_author_link_double
    author_to_author_link_dictionary = {"author" : author,
                                        "author_link" : author_link}
    return author_to_author_link_dictionary

############################
# Transformation Utilities #
############################

def _expand_dicts_to_store_with_research_field(dicts_to_store, research_field):
    for dict_to_store in dicts_to_store:
        dict_to_store["research_field"] = research_field
        yield dict_to_store
 

def research_field_and_dicts_to_store_in_db_pairs_iterator():
    arxiv_recent_page_title_and_page_link_string_iterator = _arxiv_recent_page_title_and_page_link_string_iterator()
    for research_field, research_field_recent_page_link in arxiv_recent_page_title_and_page_link_string_iterator:
        print("Currently extracting information for research papers relevant to {research_field}.".format(research_field=research_field))
        dicts_to_store_incomplete = _extract_info_from_recent_page_url_as_dicts(research_field_recent_page_link)
        dicts_to_store = _expand_dicts_to_store_with_research_field(dicts_to_store_incomplete, research_field)
        research_field_and_dicts_to_store_in_db_pair = (research_field, dicts_to_store)
        yield research_field_and_dicts_to_store_in_db_pair

###############
# Main Runner #
###############

def main():
    print("This is the library for extraction & transformation utilities used in the ETL process of arxiv_as_a_newspaper. See https://github.com/paul-tqh-nguyen/arxiv_as_a_newspaper for more details.")
    # @todo remove all of the below once stability is reached.
    link_to_paper_page = "http://in.arxiv.org/abs/1906.08163"
    print("link_to_paper_page")
    print(link_to_paper_page)
    abstract = _abstract_text_from_arxiv_paper_url(link_to_paper_page)
    return None

if __name__ == '__main__':
    main()
