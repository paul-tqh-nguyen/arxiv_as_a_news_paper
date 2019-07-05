
import React, {Component} from 'react';
import {parseArxivWebserviceForUniqueResearchFields} from './MiscComponentUtilities';
import {HeaderRow}  from './HeaderRow';
import {CenterFrame} from './CenterFrame';

var arxivEndPoint = 'https://webhooks.mongodb-stitch.com/api/client/v2.0/app/arxivnewspaperfetcher-mkmia/service/arXivNewsPaperListener/incoming_webhook/webhook0';

export class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            researchFields: [],
            allResearchPaperJSONObjects: [],
            isLoaded: false,
        };
    }

    componentDidMount() {
        let title = document.getElementsByTagName('title')[0];
        title.innerText = `Recent Research as of ${(new Date()).toLocaleDateString()}`;
        fetch(arxivEndPoint)
            .then(res => res.json())
            .then(json => {
                var researchFieldsViaJSON = parseArxivWebserviceForUniqueResearchFields(json);
                this.setState({
                    researchFields: researchFieldsViaJSON,
                    allResearchPaperJSONObjects: json,
                    isLoaded: true,
                });
            });
    }

    render() {
        let {researchFields, allResearchPaperJSONObjects, isLoaded} = this.state;
        if(!isLoaded){
            return (
                <div>
                  Loading arXiv papers...
                </div>
            );
        } else {
            return (
                <div className="App">
                  Data has been loaded!
                  <br/>
                  <HeaderRow researchFields={researchFields}/>
                  <br/>
                  <CenterFrame researchPaperJSONObjects={allResearchPaperJSONObjects}/> {/* @todo make this only pass the current ones we want to display*/}
                </div>
            );
        };
    }
}
