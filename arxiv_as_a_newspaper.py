#!/usr/bin/python3

"""

Top Level Interface for arxiv_as_a_newspaper

See https://github.com/paul-tqh-nguyen/arxiv_as_a_newspaper for more details wrt use.

Owner : paul-tqh-nguyen

Created : 06/23/2019

File Name : arxiv_as_a_news_paper.py

File Organization:
* Imports
* Main Runner

"""

###########
# Imports #
###########

import argparse
import sys
import utilities.etl_processing_utilities as etl_processing_utilities
import subprocess


###############
# Main Runner #
###############

def run_etl_process():
    etl_processing_utilities.run_etl_process()
    return None

def write_etl_results_to_file(json_file):
    raise NotImplementedError("Support for write_etl_results_to_file is not yet implemented.")
    return None

def start_front_end_server():
    print()
    print("Please use a keyboard interrupt at anytime to exit.")
    print()
    try:
        print("Installing libraries necessary for front end...")
        subprocess.check_call("cd front_end/ && npm start", shell=True)
        print("Starting front end server...")
        subprocess.check_call("cd front_end/ && npm install", shell=True)
    except KeyboardInterrupt as err:
        print("\n\n")
        print("Exiting front end interface.")
    return None

def end_to_end():
    print("Starting out End-To-End Process (i.e. performing the ETL then starting the front end server.")
    print()
    try:
        print("Starting out ETL processing...")
        run_etl_process()
        print("Starting our front end interface...")
        start_front_end_server()
    except KeyboardInterrupt as err:
        print("\n\n")
        print("Exiting our End-To-End due to an interrupt.")
    return None

VALID_SPECIFIABLE_PROCESSES = ["run_etl_process", "write_etl_results_to_file", "start_front_end_server", "end_to_end"]

def _determine_all_processes_specified_by_script_args(args):
    arg_to_value_map = vars(args)
    processes_specified = []
    for arg, value in arg_to_value_map.items():
        if (arg == "run_etl_process" and value == True) or \
           (arg == "write_etl_results_to_file" and isinstance(value,str)) or \
           (arg == "start_front_end_server" and value == True) or \
           (arg == "end_to_end" and value == True):
            processes_specified.append(arg)
        elif not arg in VALID_SPECIFIABLE_PROCESSES:
            raise SystemExit("Cannot handle input arg {bad_arg}.".format(bad_arg=arg))
    return processes_specified

def _determine_single_process_specified_by_args(args):
    processes_specified = _determine_all_processes_specified_by_script_args(args)
    number_of_processes_specified = len(processes_specified)
    single_process_specified_by_args = None
    if number_of_processes_specified > 1:
        first_processes_string = ", ".join(processes_specified[:-1])
        last_process_string = ", or {last_process}".format(last_process=processes_specified[-1])
        processes_string = "{first_processes_string}{last_process_string}".format(first_processes_string=first_processes_string, last_process_string=last_process_string)
        raise SystemExit("The input args specified multiple conflicting processes. Please select only one of {processes_string}.".format(processes_string=processes_string))
    elif number_of_processes_specified == 0:
        all_possible_processes = VALID_SPECIFIABLE_PROCESSES
        first_processes_string = ", ".join(all_possible_processes[:-1])
        last_process_string = ", or {last_process}".format(last_process=all_possible_processes[-1])
        string_for_all_possible_processes = "{first_processes_string}{last_process_string}".format(first_processes_string=first_processes_string, last_process_string=last_process_string)
        raise SystemExit("No process was specified. Please specify one of {string_for_all_possible_processes}.".format(string_for_all_possible_processes=string_for_all_possible_processes))
    elif number_of_processes_specified == 1:
        single_process_specified_by_args = processes_specified[0]
    else:
        raise SystemExit("Unexpected case reached. Please report an issue to https://github.com/paul-tqh-nguyen/arxiv_as_a_newspaper stating that _determine_single_process_specified_by_args({args}) reached an unexpected case.".format(args=args))
    return single_process_specified_by_args

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('-run-etl-process', action='store_true', help="To execute our ETL entire process (i.e. scraping https://arxiv.org/ and storing the results into our DB). You will be prompted for credentials to write to our DB.")
    parser.add_argument('-write-etl-results-to-file',default=None, type=str, metavar=("DESTINATION_JSON_FILE"),
                        help="To execute our ETL process and write the results to a .json file rather than writing to our DB.")
    parser.add_argument('-start-front-end-server', action='store_true', help="To simply use our front end interface (the info for the papers shown will be from our latest scrape of https://arxiv.org/).")
    parser.add_argument('-end-to-end', action='store_true', help="To run our entire end-to-end process (which is simply running our ETL process, writing the results to our DB, and then starting the front end server).")
    args = parser.parse_args()
    try:
        process = _determine_single_process_specified_by_args(args)
    except SystemExit as error:
        print(error)
        print()
        parser.print_help()
        sys.exit(1)
    if process is None:
        raise SystemExit("Input args to arxiv_as_a_news_paper.py are invalid.")
    elif process == "run_etl_process":
        run_etl_process()
    elif process == "write_etl_results_to_file":
        json_file = vars(args)["write_etl_results_to_file"]
        write_etl_results_to_file(json_file)
    elif process == "start_front_end_server":
        start_front_end_server()
    elif process == "end_to_end":
        end_to_end()
    else:
        raise SystemExit("Unexpected case reached. Please report an issue to https://github.com/paul-tqh-nguyen/arxiv_as_a_newspaper stating that arxiv_as_a_news_paper.py could not handle the args specified by {args}.".format(args=args))
    return None

if __name__ == '__main__':
    main()
