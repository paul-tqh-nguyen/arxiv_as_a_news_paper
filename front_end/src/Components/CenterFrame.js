
import React, {Component} from 'react';
import {TitleRow} from './TitleRow';
import {ArticleColumnContainer} from './ArticleColumnContainer';

function indexResearchPaperJSONObjectsByResearchField(researchPaperJSONObjects) {
    let researchFieldToResearchPaperJSONObjectsMapping = {};
    researchPaperJSONObjects.forEach(researchPaperJSONObject => {
        let { research_field } = researchPaperJSONObject;
        let researchPaperJSONObjects = researchFieldToResearchPaperJSONObjectsMapping[research_field];
        if (!researchPaperJSONObjects) {
            researchPaperJSONObjects = [researchPaperJSONObject];
        } else {
            researchPaperJSONObjects.push(researchPaperJSONObject);
        }
        researchFieldToResearchPaperJSONObjectsMapping[research_field] = researchPaperJSONObjects;
    });
    return researchFieldToResearchPaperJSONObjectsMapping;
}

export class CenterFrame extends Component {
    constructor(props) {
        super(props);
        let {researchPaperJSONObjects} = this.props;
        this.state = {
            researchFieldToResearchPaperJSONObjectsMapping: indexResearchPaperJSONObjectsByResearchField(researchPaperJSONObjects),
        };
    }
    
    render() {
        let { researchFieldToResearchPaperJSONObjectsMapping } = this.state;
        let { researchFieldOfCurrentlyDisplayedArticles, goToNextResearchFieldMethod, goToPreviousResearchFieldMethod, sideNavigationBarOpenStateChangingMethod,
              sideNavigationBarIsOpen } = this.props;
        let closeSideNavigationBar = function() {
            if ( sideNavigationBarIsOpen ) {
                sideNavigationBarOpenStateChangingMethod();
            }
        };
        return <div id='center-frame' onClick={closeSideNavigationBar}>
                 <TitleRow
                     sideNavigationBarOpenStateChangingMethod={sideNavigationBarOpenStateChangingMethod}
                     goToPreviousResearchFieldMethod={goToPreviousResearchFieldMethod}
                     goToNextResearchFieldMethod={goToNextResearchFieldMethod}
                     researchFieldOfCurrentlyDisplayedArticles={researchFieldOfCurrentlyDisplayedArticles}
                     sideNavigationBarIsOpen={sideNavigationBarIsOpen}/>
                 <ArticleColumnContainer
                     researchFieldToResearchPaperJSONObjectsMapping={researchFieldToResearchPaperJSONObjectsMapping}
                     researchFieldOfCurrentlyDisplayedArticles={researchFieldOfCurrentlyDisplayedArticles}/>
               </div>;
    }
}

