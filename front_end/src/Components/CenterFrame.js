
import React, {Component} from 'react';

export class CenterFrame extends Component {
    render() {
        let {researchPaperJSONObjects} = this.props;
        return <div id='center-frame'>
                 <ol>
                   {researchPaperJSONObjects.map(function(researchPaperJSONObject) {
                       let {page_link, research_paper_title, research_field, primary_subject, secondary_subjects, author_info, abstract} = researchPaperJSONObject;
                       return (
                           <li>
                             Page Link: {page_link}
                             <br/>
                             research_paper_title: {research_paper_title}
                             <br/>
                             research_field: {research_field}
                             <br/>
                             primary_subject: {primary_subject}
                             <br/>
                             secondary_subjects: {secondary_subjects}
                             <br/>
                             author_info: {author_info.map(function(authorInfoJSONOBject) {
                                 let {author, author_link} = authorInfoJSONOBject;
                                 return (
                                     <div className="author-link">
                                       <a href={author_link}>{author}</a>
                                     </div>
                                 );
                             })}
                             <br/>
                             abstract: {abstract}
                             <br/>
                           </li>
                       );
                   })};
                 </ol>
               </div>;
    }
}

