
// Public Interface

export function parseArxivWebserviceForUniqueResearchFields (json) {
    var researchFieldsNonUnique = json.map(researchPaperJSONObject => researchPaperJSONObject.research_field);
    var researchFields = uniquifyList(researchFieldsNonUnique);
    return researchFields;
}

// Internals

function uniquifyList (nonUniqueList) {
    var uniqifiedList = nonUniqueList.filter(function(element, index){
	return nonUniqueList.indexOf(element) >= index;
    });
    return uniqifiedList;
}
