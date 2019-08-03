
import React, {Component} from 'react';

const loadingBarAnimationDurationInSeconds = 4;
const numberOfLoadingBars = 10;

export class LoadingScreen extends Component {
    render() {
        let { dataIsLoaded } = this.props;
        let loadingScreenClass = dataIsLoaded ? 'loading-screen loading-finished' : 'loading-screen' ;
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
        }
        return (
            <div className={loadingScreenClass}>{loadingBars}</div>
        );
    }
}
