
import React, {Component} from 'react';

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

function renderResearchPaperJSONObjectForDisplay(researchPaperJSONObject, index) {
    let {page_link, research_paper_title, primary_subject, secondary_subjects, author_info, abstract} = researchPaperJSONObject;
    let renderedAuthorInfo = author_info.map(
        function(authorInfoJSONOBject, authorIndex) {
            let {author, author_link} = authorInfoJSONOBject;
            return (
                <span className='article-author' key={author.concat(parseInt(authorIndex))}>
                  <a href={author_link}>{author}</a>{' '}
                </span>
            );
        });
    return (
        <div className='article' key={index}>
          { research_paper_title && <span className='article-title'><a href={page_link} className='title'>{research_paper_title}</a></span> }
          <br/>
          <span className='article-author'>By: </span>{ renderedAuthorInfo }
          <div className='article-subjects'>
            Subjects: <span>{ primary_subject }</span>
            { (secondary_subjects.length !== 0) && (', ') }
            { secondary_subjects.join(', ') }
          </div>
          <div className='article-abstract'>
            { abstract }
          </div>
        </div>
    );
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
        let { researchFieldOfCurrentlyDisplayedArticles } = this.props;
        let JSONObjectsForCurrentlyDisplayedArticles = researchFieldToResearchPaperJSONObjectsMapping[researchFieldOfCurrentlyDisplayedArticles];
        let firstColumnArticleJSONObjects = [];
        let secondColumnArticleJSONObjects = [];
        let thirdColumnArticleJSONObjects = [];
        JSONObjectsForCurrentlyDisplayedArticles.forEach(function(JSONObject, index) {
            let indexForColumnToContainArticle = index % 3;
            switch (indexForColumnToContainArticle) {
            case 0: firstColumnArticleJSONObjects.push(JSONObject); break;
            case 1: secondColumnArticleJSONObjects.push(JSONObject); break;
            case 2: thirdColumnArticleJSONObjects.push(JSONObject); break;
            default: console.warn("Could not render main article columns correctly."); break;
            }
        });
        let firstColumnRendered = firstColumnArticleJSONObjects.map(renderResearchPaperJSONObjectForDisplay);
        let secondColumnRendered = secondColumnArticleJSONObjects.map(renderResearchPaperJSONObjectForDisplay);
        let thirdColumnRendered = thirdColumnArticleJSONObjects.map(renderResearchPaperJSONObjectForDisplay);
        return <div id='center-frame'>
                 <div id='arxiv-title'>{'The ArXiv Archive'}</div>
                 <div id='research-field-row'>
                   <span className='move-research-field-left-link'>{'Previous Research Field'}</span>
                   <span className='currently-shown-research-field'>{researchFieldOfCurrentlyDisplayedArticles}</span>
                   <span className='move-research-field-right-link'>{'Next Research Field'}</span>
                 </div>
                 <hr id='title-divider'/>
                 <div id='center-frame-column-container'>
                   <div key={1} className='center-frame-column'>{firstColumnRendered}</div>
                   <div key={2} className='center-frame-column'>{secondColumnRendered}</div>
                   <div key={3} className='center-frame-column'>{thirdColumnRendered}</div>
                 </div>
               </div>;
    }
}

