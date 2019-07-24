
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
                <span key={author.concat(parseInt(authorIndex))}>
                  <a href={author_link}>{author}</a>{' '}
                </span>
            );
        });
    let subjects = [primary_subject].concat(secondary_subjects);
    return (
        <div key={index}>
          { research_paper_title && <a href={page_link} className='title'>{research_paper_title}</a> } {/* get this 'title' class working*/}
          <br/>
          { renderedAuthorInfo }
          <br/>
          <strong>{ primary_subject /* abstract out this styling to a css class */}</strong>
          { subjects && (', ') }
          { subjects.join(', ') }
          <br/>
          { abstract }
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
                 <h3>{researchFieldOfCurrentlyDisplayedArticles}</h3>
                 <div key={1} className='home-page-body-col'>{firstColumnRendered}</div>
                 <div key={2} className='home-page-body-col'>{secondColumnRendered}</div>
                 <div key={3} className='home-page-body-col'>{thirdColumnRendered}</div>
                 <ol>
                   {JSONObjectsForCurrentlyDisplayedArticles.map(function(researchPaperJSONObject, researcPaperIndex) {
                       let {page_link, research_paper_title, primary_subject, secondary_subjects, author_info, abstract} = researchPaperJSONObject;
                       return (
                           <li key={research_paper_title.concat(parseInt(researcPaperIndex))}>
                             <br/>
                             <h2><a href={page_link}>{research_paper_title}</a></h2>
                             <br/>
                             primary_subject: {primary_subject}
                             <br/>
                             secondary_subjects: {secondary_subjects}
                             <br/>
                             author_info: {author_info.map(function(authorInfoJSONOBject, authorIndex) {
                                 let {author, author_link} = authorInfoJSONOBject;
                                 return (
                                     <a key={author_link.concat(author.concat(parseInt(authorIndex)))} href={author_link}>{author}</a>
                                 );
                             })}
                             <br/>
                             abstract: {abstract}
                             <br/>
                           </li>
                       );
                   })}
                 </ol>
               </div>;
    }
}

