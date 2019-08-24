
import React, {Component} from 'react';
import {titleText} from './MiscComponentUtilities';

export class TitleRow extends Component {
    render() {
        let { researchFields, indexOfResearchFieldOfCurrentlyDisplayedArticles, sideNavigationBarOpenStateChangingMethod, goToPreviousResearchFieldMethod, goToNextResearchFieldMethod, 
              sideNavigationBarIsOpen } = this.props;
        let researchFieldOfCurrentlyDisplayedArticles = researchFields[indexOfResearchFieldOfCurrentlyDisplayedArticles];
        let toggleSideBarText = sideNavigationBarIsOpen ? "Navigate Fewer Research Fields" : "Navigate More Research Fields";
        let currentResearchFieldIsFirstResearchField = (0 === indexOfResearchFieldOfCurrentlyDisplayedArticles);
        let currentResearchFieldIsLastResearchField = (researchFields.length-1 === indexOfResearchFieldOfCurrentlyDisplayedArticles);
        let previousResearchFieldRendering = currentResearchFieldIsFirstResearchField ? null : <span
                                                                                                   className='move-research-field-left'
                                                                                                   onClick={goToPreviousResearchFieldMethod}>Previous Research Field</span>;
        let nextResearchFieldRendering = currentResearchFieldIsLastResearchField ? null : <span
                                                                                               className='move-research-field-right'
                                                                                               onClick={goToNextResearchFieldMethod}>Next Research Field</span>;
        return <div id='title-row'>
                  <div id='side-bar-toggle' onClick={sideNavigationBarOpenStateChangingMethod}>{toggleSideBarText}</div>
                  <div id='arxiv-title'>{titleText}</div>
                  <div id='current-research-field-display-row'>
                    { previousResearchFieldRendering }
                    <span className='currently-shown-research-field' onClick={sideNavigationBarOpenStateChangingMethod}>{researchFieldOfCurrentlyDisplayedArticles}</span>
                    { nextResearchFieldRendering }
                  </div>
                  <hr id='title-divider'/>
               </div>;
    }
}
