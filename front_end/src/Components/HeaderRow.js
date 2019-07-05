
import React, {Component} from 'react';

export class HeaderRow extends Component {
    render() {
        let {researchFields} = this.props;
        return <div id='header-row'>
                 <h1>Header Row Component</h1>
                 <ul className='news-link-ul' key='0'>
                   {researchFields.map(researchField => <li>{researchField}</li>)}
                 </ul>
               </div>;
    }
}

