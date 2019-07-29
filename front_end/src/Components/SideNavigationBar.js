
import React, {Component} from 'react';


export class SideNavigationBar extends Component {
    render() {
        let { goToResearchFieldAtIndexMethod, researchFields, open } = this.props;
        let classForRendering = open ? 'side-navigation-bar open' : 'side-navigation-bar closed';
        return <div className={classForRendering}>
                 <ul className='side-navigation-bar-ul'>
                   {researchFields.map(
                       function(researchField, indexForCurrentResearchField) {
                           let goToCurrentResearchFieldFunction = function() {
                               return goToResearchFieldAtIndexMethod(indexForCurrentResearchField);
                           };
                           return <li onClick={goToCurrentResearchFieldFunction} key={researchField}><a href={'#'.concat(parseInt(indexForCurrentResearchField))}>{researchField}</a></li>;
                       })}
                 </ul>
               </div>;
    }
}
