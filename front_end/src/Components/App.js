
import React, {Component} from 'react';
import {HeaderRow}  from './HeaderRow';
import {CenterFrame} from './CenterFrame';

var arxivEndPoint = 'https://webhooks.mongodb-stitch.com/api/client/v2.0/app/arxivnewspaperfetcher-mkmia/service/arXivNewsPaperListener/incoming_webhook/webhook0';

function uniquifyList (nonUniqueList) {
    var uniqifiedList = nonUniqueList.filter(function(element, index){
	return nonUniqueList.indexOf(element) >= index;
    });
    return uniqifiedList;
}

function parseArxivWebserviceForUniqueResearchFields(json) {
    var researchFieldsNonUnique = json.map(researchPaperJSONObject => researchPaperJSONObject.research_field);
    var researchFields = uniquifyList(researchFieldsNonUnique);
    researchFields.sort();
    return researchFields;
};

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
        title.innerText = `The ArXiv Archive`;
        fetch(arxivEndPoint)
            .then(res => res.json())
            .then(json => {
                var researchFieldsViaJSON = parseArxivWebserviceForUniqueResearchFields(json);
                this.setState({
                    researchFields: researchFieldsViaJSON,
                    researchFieldOfCurrentlyDisplayedArticles: researchFieldsViaJSON[0],
                    allResearchPaperJSONObjects: json,
                    isLoaded: true,
                });
            });
    }

    render() {
        let {researchFields, researchFieldOfCurrentlyDisplayedArticles, allResearchPaperJSONObjects, isLoaded} = this.state;
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
                  <CenterFrame researchFieldOfCurrentlyDisplayedArticles={researchFieldOfCurrentlyDisplayedArticles} researchPaperJSONObjects={allResearchPaperJSONObjects}/>
                </div>
            );
        };
    }
}
