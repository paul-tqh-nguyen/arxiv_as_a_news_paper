
import React, {Component} from 'react';

export class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            isLoaded: false,
        };
    }

    componentDidMount() {
        fetch('https://webhooks.mongodb-stitch.com/api/client/v2.0/app/arxivnewspaperfetcher-mkmia/service/arXivNewsPaperListener/incoming_webhook/webhook0')
            .then(res => res.json())
            .then(json => {         
                console.log("json");
                console.log(json);
                this.setState({
                    items: json,
                    isLoaded: true,
                });
            });
    }

    render() {
        var {items, isLoaded} = this.state;
        if(!isLoaded){
            return(
                <div>
                  Loading arXiv papers...
                </div>
            );
        } else {
            return (
                <div className="App">
                  Data has been loaded!
                  <ul>
                    {items.map(item =>(
                        <li>
                          Page Link: {item.page_link}
                          <br/>
                          research_paper_title: {item.research_paper_title}
                          <br/>
                          primary_subject: {item.primary_subject}
                          <br/>
                        </li>
                    ))};
                  </ul>
                </div>
            );
        };
    }
}
