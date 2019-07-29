
import React, {Component} from 'react';

const numMillisecondsBetweenHeaderRowUpdates = 8000;
const headerRowFontSizeEstimateInPixels = 10;

export class HeaderRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstShownResearchFieldIndex: 0,
            numberOfResearchFieldsShownMostRecently: 0,
            currentlyShownResearchFields: [],
            headerRowResearchFieldLoopingInterval: null,
        };
    }
    
    updateCurrentlyShownResearchFields() {
        let { firstShownResearchFieldIndex, numberOfResearchFieldsShownMostRecently } = this.state;
        let { researchFields } = this.props;
        let updatedFirstShownResearchFieldIndex = firstShownResearchFieldIndex+numberOfResearchFieldsShownMostRecently;
        let estimatedNumberOfHeaderRowCharactersAvailable = window.innerWidth / headerRowFontSizeEstimateInPixels;
        let nextResearchFieldsToShow = [];
        let nextResearchField = researchFields[updatedFirstShownResearchFieldIndex];
        while (estimatedNumberOfHeaderRowCharactersAvailable-nextResearchField.length > 0 || nextResearchFieldsToShow.legnth == 0 ) {
            updatedFirstShownResearchFieldIndex += 1;
            if ( nextResearchField ) {
                nextResearchFieldsToShow.push(nextResearchField);
                estimatedNumberOfHeaderRowCharactersAvailable -= nextResearchField.length;
            }
            nextResearchField = researchFields[updatedFirstShownResearchFieldIndex];
        }
        this.setState({
            firstShownResearchFieldIndex: updatedFirstShownResearchFieldIndex,
            currentlyShownResearchFields: nextResearchFieldsToShow,
        });
    }
    
    initializeHeaderRowResearchFieldLoopingInterval() {
        this.updateCurrentlyShownResearchFields();
        this.headerRowResearchFieldLoopingInterval = setInterval(() => {this.updateCurrentlyShownResearchFields();}, numMillisecondsBetweenHeaderRowUpdates);
    }
    
    componentDidMount() {
        this.initializeHeaderRowResearchFieldLoopingInterval();
    }
    
    componentWillUnmount() {
        clearInterval(this.headerRowResearchFieldLoopingInterval);
    }
    
    render() {
        let { firstShownResearchFieldIndex } = this.state;
        let { goToResearchFieldAtIndexMethod } = this.props;
        return <div id='header-row'>
                 <ul className='news-link-ul'>
                   {this.state.currentlyShownResearchFields.map(
                       function(researchField, index) {
                           let indexForCurrentResearchField = index+firstShownResearchFieldIndex;
                           let goToCurrentResearchFieldFunction = function() {
                               return goToResearchFieldAtIndexMethod(indexForCurrentResearchField);
                           };
                           return <li onClick={goToCurrentResearchFieldFunction} key={researchField}><a href={'#'.concat(parseInt(indexForCurrentResearchField))}>{researchField}</a></li>;
                       })}
                 </ul>
               </div>;
    }
}

