
import React, {Component} from 'react';
import {LoadingScreen} from './LoadingScreen';
import {HeaderRow}  from './HeaderRow';
import {CenterFrame} from './CenterFrame';
import {SideNavigationBar} from './SideNavigationBar';
import {titleText, arxivEndPoint, uniquifyList} from './MiscComponentUtilities';

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
        this.changeSideNavigationBarOpenState = this.changeSideNavigationBarOpenState.bind(this);
        this.state = {
            researchFields: [],
            allResearchPaperJSONObjects: [],
            dataIsLoaded: false,
        };
    }
    
    componentDidMount() {
        let title = document.getElementsByTagName('title')[0];
        title.innerText = titleText;
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
                    dataIsLoaded: true,
                    sideNavigationBarIsOpen: false,
                });
            });
    }

    changeSideNavigationBarOpenState(){
        let { sideNavigationBarIsOpen } = this.state;
        let newSideNavigationBarOpenState = sideNavigationBarIsOpen ? false : true;
        this.setState({
            sideNavigationBarIsOpen: newSideNavigationBarOpenState,
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
        let { researchFields, indexOfResearchFieldOfCurrentlyDisplayedArticles, allResearchPaperJSONObjects, dataIsLoaded, sideNavigationBarIsOpen } = this.state;
        if ( dataIsLoaded ) {
            window.location.hash = '#'.concat(indexOfResearchFieldOfCurrentlyDisplayedArticles.toString());
        }
        return (
            <div id="app">
              <LoadingScreen dataIsLoaded={dataIsLoaded}/>
              { dataIsLoaded &&
                <div id='loaded-content'>
                  <HeaderRow
                      goToResearchFieldAtIndexMethod={this.goToResearchFieldAtIndex}
                      researchFields={researchFields}/>
                  <SideNavigationBar
                      goToResearchFieldAtIndexMethod={this.goToResearchFieldAtIndex}
                      researchFields={researchFields}
                      sideNavigationBarOpenStateChangingMethod={this.changeSideNavigationBarOpenState}
                      sideNavigationBarIsOpen={sideNavigationBarIsOpen}/>
                  <CenterFrame
                      researchFields={researchFields}
                      indexOfResearchFieldOfCurrentlyDisplayedArticles={indexOfResearchFieldOfCurrentlyDisplayedArticles}
                      researchPaperJSONObjects={allResearchPaperJSONObjects}
                      goToNextResearchFieldMethod={this.goToNextResearchFieldMethod}
                      goToPreviousResearchFieldMethod={this.goToPreviousResearchFieldMethod}
                      sideNavigationBarOpenStateChangingMethod={this.changeSideNavigationBarOpenState}
                      sideNavigationBarIsOpen={sideNavigationBarIsOpen}
                  />
                </div>}
            </div>
        );
    }
}

