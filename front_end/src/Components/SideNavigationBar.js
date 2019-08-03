
import React, {Component} from 'react';

export class SideNavigationBar extends Component {
    render() {
        let { goToResearchFieldAtIndexMethod, researchFields, sideNavigationBarOpenStateChangingMethod, sideNavigationBarIsOpen } = this.props;
        let classForRendering = sideNavigationBarIsOpen ? 'side-navigation-bar open' : 'side-navigation-bar closed';
        return <div className={classForRendering}>
                 <ul className='side-navigation-bar-ul'>
                   {researchFields.map(
                       function(researchField, indexForCurrentResearchField) {
                           let performSideNavigationBarOnClickActions = function() {
                               sideNavigationBarOpenStateChangingMethod();
                               goToResearchFieldAtIndexMethod(indexForCurrentResearchField);
                           };
                           return <li onClick={performSideNavigationBarOnClickActions} key={researchField}><a href={'#'.concat(parseInt(indexForCurrentResearchField))}>{researchField}</a></li>;
                       })}
                 </ul>
               </div>;
    }
}
