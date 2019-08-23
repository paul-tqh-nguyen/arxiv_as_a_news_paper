
import React, {Component} from 'react';

const loadingBarAnimationDurationInSeconds = 4;
const numberOfLoadingBars = 10;

export class LoadingScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingScreenWorthShowing: true,
            shutOffDelayer: null,
        };
    }

    componentWillUnmount() {
        let { shutOffDelayer } = this.state;
        clearInterval(shutOffDelayer);
    }

    render() {
        let { dataIsLoaded } = this.props;
        let { loadingScreenWorthShowing, shutOffDelayer } = this.state;
        let renderedComponent = null; 
        if ( loadingScreenWorthShowing ) {
            let loadingScreenClass = dataIsLoaded ? 'loading-screen loading-finished' : 'loading-screen' ;
            if ( dataIsLoaded && ! shutOffDelayer ) {
                let shutOffFunction = () => { this.setState({ loadingScreenWorthShowing: false }); };
                let shutOffDelayTime = 6000;
                this.setState({
                    shutOffDelayer: setTimeout( shutOffFunction, shutOffDelayTime),
                });
            }
            let loadingBars = [];
            for(var loadingBarIndex = 0; loadingBarIndex<numberOfLoadingBars; loadingBarIndex++) {
                let loadingBarWaitTime = loadingBarIndex * loadingBarAnimationDurationInSeconds / numberOfLoadingBars;
                let style = {width: `100%`,
                             height: `100%`,
                             paddingTop: '100%',
                             animation : `loading-screen-animation ${parseInt(loadingBarAnimationDurationInSeconds)}s ease-in-out`,
                             animationDelay: `${loadingBarWaitTime}s`,
                             color: 'white',
		             fontSize: '4rem',
                             fontFamily: 'Libre Baskerville',
	                     textAlign: 'center',
                            };
                loadingBars.push(<div style={style} key={`Loading Bar ${loadingBarIndex}`}></div>);
            };
            renderedComponent = <div className={loadingScreenClass}>{loadingBars}</div>;
        }
        return renderedComponent;
    }
}
