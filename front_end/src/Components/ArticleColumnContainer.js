
import React, {Component} from 'react';

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
            { (secondary_subjects.length > 0) && (', ') }
            { secondary_subjects.join(', ') }
          </div>
          <div className='article-abstract'>
            { abstract }
          </div>
        </div>
    );
}

export class ArticleColumnContainer extends Component {
    render() {
        let { researchFieldToResearchPaperJSONObjectsMapping, researchFieldOfCurrentlyDisplayedArticles } = this.props;
        let JSONObjectsForCurrentlyDisplayedArticles = researchFieldToResearchPaperJSONObjectsMapping[researchFieldOfCurrentlyDisplayedArticles];
        let firstColumnArticleJSONObjects = [];
        let secondColumnArticleJSONObjects = [];
        let thirdColumnArticleJSONObjects = [];
        let firstColumnHeightEstimation = 0;
        let secondColumnHeightEstimation = 0;
        let thirdColumnHeightEstimation = 0;
        JSONObjectsForCurrentlyDisplayedArticles.forEach(function(JSONObject) {
            let smallestCount = Math.min(firstColumnHeightEstimation, secondColumnHeightEstimation, thirdColumnHeightEstimation);
            let { abstract, research_paper_title } = JSONObject;
            let articleHeightEstimation = abstract.length + research_paper_title.length * 8 + 20;
            switch (smallestCount) {
            case firstColumnHeightEstimation:
                firstColumnArticleJSONObjects.push(JSONObject);
                firstColumnHeightEstimation += articleHeightEstimation;
                break;
            case secondColumnHeightEstimation:
                secondColumnArticleJSONObjects.push(JSONObject);
                secondColumnHeightEstimation += articleHeightEstimation;
                break;
            case thirdColumnHeightEstimation:
                thirdColumnArticleJSONObjects.push(JSONObject);
                thirdColumnHeightEstimation += articleHeightEstimation;
                break;
            default: console.warn("Could not render main article columns correctly."); break;
            }
        });
        let firstColumnRendered = firstColumnArticleJSONObjects.map(renderResearchPaperJSONObjectForDisplay);
        let secondColumnRendered = secondColumnArticleJSONObjects.map(renderResearchPaperJSONObjectForDisplay);
        let thirdColumnRendered = thirdColumnArticleJSONObjects.map(renderResearchPaperJSONObjectForDisplay);
        return <div id='article-column-container'>
                 <div key={1} className='article-column'>{firstColumnRendered}</div>
                 <div key={2} className='article-column'>{secondColumnRendered}</div>
                 <div key={3} className='article-column'>{thirdColumnRendered}</div>
               </div>;
    }
}
