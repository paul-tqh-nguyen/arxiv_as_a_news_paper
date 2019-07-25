
import React, {Component} from 'react';
import {HeaderRow}  from './HeaderRow';
import {CenterFrame} from './CenterFrame';

var arxivEndPoint = 'https://webhooks.mongodb-stitch.com/api/client/v2.0/app/arxivnewspaperfetcher-mkmia/service/arXivNewsPaperListener/incoming_webhook/webhook0';

function uniquifyList (nonUniqueList) {
    var uniqifiedList = nonUniqueList.filter(function(element, index){
	return nonUniqueList.indexOf(element) >= index;
    });
    return uniqifiedList;
}

function parseArxivWebserviceForUniqueResearchFields(json) {
    var researchFieldsNonUnique = json.map(researchPaperJSONObject => researchPaperJSONObject.research_field);
    var researchFields = uniquifyList(researchFieldsNonUnique);
    researchFields.sort();
    return researchFields;
};

export class App extends Component {
    constructor(props) {
        super(props);
        this.goToNextResearchFieldMethod = this.goToNextResearchFieldMethod.bind(this);
        this.goToPreviousResearchFieldMethod = this.goToPreviousResearchFieldMethod.bind(this);
        this.goToResearchFieldAtIndex = this.goToResearchFieldAtIndex.bind(this);
        this.state = {
            researchFields: [],
            allResearchPaperJSONObjects: [],
            isLoaded: false,
        };
    }
    
    componentDidMount() {
        let title = document.getElementsByTagName('title')[0];
        title.innerText = `The ArXiv Archive`;
        fetch(arxivEndPoint)
            .then(res => res.json())
            .then(json => {
                let researchFieldsViaJSON = parseArxivWebserviceForUniqueResearchFields(json);
                let initialIndexOfResearchFieldOfCurrentlyDisplayedArticles = 0;
                let currentHash = window.location.hash.slice(1);
                let parsedCurrentHash = parseInt(currentHash);
                let currentHashIsInteger = Number.isInteger(parsedCurrentHash);
                if (currentHashIsInteger) {
                    let lowerBound = 0;
                    let upperBound = researchFieldsViaJSON.length-1;
                    initialIndexOfResearchFieldOfCurrentlyDisplayedArticles = Math.max(lowerBound, Math.min(parsedCurrentHash, upperBound));
                }
                this.setState({
                    researchFields: researchFieldsViaJSON,
                    indexOfResearchFieldOfCurrentlyDisplayedArticles: initialIndexOfResearchFieldOfCurrentlyDisplayedArticles,
                    allResearchPaperJSONObjects: json,
                    isLoaded: true,
                });
            });
    }
    
    goToResearchFieldAtIndex(index) {
        let { researchFields } = this.state;
        let lowerBound = 0;
        let upperBound = researchFields.length-1;
        this.setState({
            indexOfResearchFieldOfCurrentlyDisplayedArticles: Math.max(lowerBound, Math.min(index, upperBound)),
        });
    }
    
    goToNextResearchFieldMethod() {
        let { researchFields, indexOfResearchFieldOfCurrentlyDisplayedArticles } = this.state;
        let upperBound = researchFields.length-1;
        let finalIndexOfResearchFieldOfCurrentlyDisplayedArticles = Math.min(indexOfResearchFieldOfCurrentlyDisplayedArticles+1, upperBound);
        this.setState({
            indexOfResearchFieldOfCurrentlyDisplayedArticles: finalIndexOfResearchFieldOfCurrentlyDisplayedArticles,
        });
    };
    
    goToPreviousResearchFieldMethod() {
        let { indexOfResearchFieldOfCurrentlyDisplayedArticles } = this.state;
        let lowerBound = 0;
        let finalIndexOfResearchFieldOfCurrentlyDisplayedArticles = Math.max(indexOfResearchFieldOfCurrentlyDisplayedArticles-1, lowerBound);
        this.setState({
            indexOfResearchFieldOfCurrentlyDisplayedArticles: finalIndexOfResearchFieldOfCurrentlyDisplayedArticles,
        });
    };
    
    render() {
        let {researchFields, indexOfResearchFieldOfCurrentlyDisplayedArticles, allResearchPaperJSONObjects, isLoaded} = this.state;
        if(!isLoaded){
            return (
                <div>
                  Loading arXiv papers...
                </div>
            );
        } else {
            let researchFieldOfCurrentlyDisplayedArticles = researchFields[indexOfResearchFieldOfCurrentlyDisplayedArticles];
            window.location.hash = '#'.concat(indexOfResearchFieldOfCurrentlyDisplayedArticles.toString());
            return (
                <div id="App">
                  <HeaderRow goToResearchFieldAtIndexMethod={this.goToResearchFieldAtIndex} researchFields={researchFields}/>
                  <CenterFrame
                      researchFieldOfCurrentlyDisplayedArticles={researchFieldOfCurrentlyDisplayedArticles}
                      researchPaperJSONObjects={allResearchPaperJSONObjects}
                      goToNextResearchFieldMethod={this.goToNextResearchFieldMethod}
                      goToPreviousResearchFieldMethod={this.goToPreviousResearchFieldMethod}
                  />
                </div>
            );
        };
    }
}

