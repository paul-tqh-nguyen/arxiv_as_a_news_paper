
import React, {Component} from 'react';

const numShownHeaderRowLinks = 6;
const numMillisecondsBetweenHeaderRowUpdates = 3000;
const numMillisecondsToWaitPriorToInitializingHeaderRowRotations = 500;

export class HeaderRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstShownResearchFieldIndex: 0,
            currentlyShownResearchFields: [],
            headerRowResearchFieldLoopingInterval: null,
            headerRowResearchFieldLoopingIntervalDelayer: null,
        };
    }

    updateCurrentlyShownResearchFields() {
        let { firstShownResearchFieldIndex } = this.state;
        let { researchFields } = this.props;
        let maxIndex = researchFields.length;
        let updatedFirstShownResearchFieldIndex = firstShownResearchFieldIndex+numShownHeaderRowLinks;
        if (updatedFirstShownResearchFieldIndex >= maxIndex) {
            updatedFirstShownResearchFieldIndex = 0;
        }
        let lastShownResearchFieldIndex = Math.min(maxIndex, updatedFirstShownResearchFieldIndex+numShownHeaderRowLinks);
        this.setState({
            firstShownResearchFieldIndex: updatedFirstShownResearchFieldIndex,
            currentlyShownResearchFields: researchFields.slice(updatedFirstShownResearchFieldIndex, lastShownResearchFieldIndex)
        });
    }
    
    initializeHeaderRowResearchFieldLoopingInterval() {
        this.headerRowResearchFieldLoopingInterval = setInterval(() => {this.updateCurrentlyShownResearchFields();}, numMillisecondsBetweenHeaderRowUpdates);
    }
    
    componentDidMount() {
        this.headerRowResearchFieldLoopingIntervalDelayer = setTimeout(() => {
            this.updateCurrentlyShownResearchFields();
            this.initializeHeaderRowResearchFieldLoopingInterval();
        }, numMillisecondsToWaitPriorToInitializingHeaderRowRotations);
    }
    
    componentWillUnmount() {
        clearInterval(this.headerRowResearchFieldLoopingInterval);
        clearInterval(this.headerRowResearchFieldLoopingIntervalDelayer);
    }
    
    render() {
        return <div id='header-row'>
                 <ul className='news-link-ul'>
                   {this.state.currentlyShownResearchFields.map(researchField => <li className='test' key={researchField}>{researchField}</li>)}
                 </ul>
               </div>;
    }
}

