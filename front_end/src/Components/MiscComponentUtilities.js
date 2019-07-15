
// Public Interface

export function parseArxivWebserviceForUniqueResearchFields (json) {
    var researchFieldsNonUnique = json.map(researchPaperJSONObject => researchPaperJSONObject.research_field);
    var researchFields = uniquifyList(researchFieldsNonUnique);
    return researchFields;
}

export function noOp() { return null; }

export class DynamicInterval {
    constructor(initialIntervalTimeSegment, initialCallbackFunction) {
        this.millisecondsBetweenCallbackCalls = initialIntervalTimeSegment || 1000;
        this.running = false;
        this.timeout = false;
        this.callbackFunction = initialCallbackFunction || noOp;
    }
    
    performCallbackCall() {
        if(this.running) {
            this.callbackFunction();
            this.running = true;
        }
    }
    
    start() {
        clearInterval(this.timeout);
        this.running = true;
        this.timeout = setTimeout(this.performCallbackCall, this.millisecondsBetweenCallbackCalls);
    }
    
    stop() {
        clearInterval(this.timeout);
        this.running = false;
    }
 
    setTimeInterval(newIntervalTimeSegment){
        clearInterval(this.timeout);
        this.millisecondsBetweenCallbackCalls = newIntervalTimeSegment || 1000;
        this.start();
    }

    setCallbackFunction(newCallbackFunction){
        this.callbackFunction = newCallbackFunction || noOp;
    }
}

// Internals

function uniquifyList (nonUniqueList) {
    var uniqifiedList = nonUniqueList.filter(function(element, index){
	return nonUniqueList.indexOf(element) >= index;
    });
    return uniqifiedList;
}
