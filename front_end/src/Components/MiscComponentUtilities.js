
// Public Interface

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
