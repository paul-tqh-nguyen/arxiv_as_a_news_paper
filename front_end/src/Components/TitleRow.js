
import React, {Component} from 'react';
import {titleText} from './MiscComponentUtilities';

export class TitleRow extends Component {
    render() {
        let { sideNavigationBarOpenStateChangingMethod, goToPreviousResearchFieldMethod, goToNextResearchFieldMethod, researchFieldOfCurrentlyDisplayedArticles,
              sideNavigationBarIsOpen } = this.props;
        let toggleSideBarText = sideNavigationBarIsOpen ? "Close Side Bar" : "Navigate More Research Fields";
        return <div id='title-row'>
                  <div id='side-bar-toggle' onClick={sideNavigationBarOpenStateChangingMethod}>{toggleSideBarText}</div>
                  <div id='arxiv-title'>{titleText}</div>
                  <div id='current-research-field-display-row'>
                    <span className='move-research-field-left' onClick={goToPreviousResearchFieldMethod}>Previous Research Field</span>
                    <span className='currently-shown-research-field' onClick={sideNavigationBarOpenStateChangingMethod}>{researchFieldOfCurrentlyDisplayedArticles}</span>
                    <span className='move-research-field-right' onClick={goToNextResearchFieldMethod}>Next Research Field</span>
                  </div>
                  <hr id='title-divider'/>
               </div>;
    }
}
