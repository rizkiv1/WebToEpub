"use strict";

parserFactory.register("nineheavens.org", () => new NineHeavensParser());

class NineHeavensParser extends Parser{ 
    constructor() {
        super();
    }

    // returns promise with the URLs of the chapters to fetch
    // promise is used because may need to fetch the list of URLs from internet
    
    async getChapterUrls(dom) {
        // Most common implementation is to find element holding the hyperlinks to 
        // the web pages holding the chapters.  Then call util.hyperlinksToChapterList()
        // to convert the links into a list of URLs the parser will collect.
        let menu = dom.querySelector("ol.chapter-group__list");
        return util.hyperlinksToChapterList(menu);
    }
    

    // returns the element holding the story content in a chapter
    
    findContent(dom) {
        return dom.querySelector("article.chapter__article");
    }
    

    // title of the story  (not to be confused with title of each chapter)

    extractTitleImpl(dom) {
        // typical implementation is find node with the Title and return name from title
        // NOTE. Can return Title as a string, or an  HTML element
        return dom.querySelector("h1.story__identity-title");
    }

    // author of the story
    // Optional, if not provided, will default to "<unknown>"
    /*
    extractAuthor(dom) {
        // typical implementation is find node with the author's name and return name from title
        // Major points to note
        //   1. Return the Author's name as a string, not a HTML element
        //   2. If can't find Author, call the base implementation
        let authorLabel = dom.querySelector(".meta span a");
        return authorLabel?.textContent ?? super.extractAuthor(dom);
    }
    */

    // Genre of the story
    // Optional, Genre for metadata, if not provided, will default to ""
    /*
    extractSubject(dom) {
        let tags = [...dom.querySelectorAll("[property='genre']")];
        return tags.map(e => e.textContent.trim()).join(", ");
    }
    */
    extractDescription(dom) {
        return dom.querySelector("section.story__summary").textContent.trim();
    }

    removeUnwantedElementsFromContentElement(element) {
        util.removeChildElementsMatchingCss(element, "div.chapter__actions, a.chapter__story-link, em.chapter__author, footer.chapter__footer");
        super.removeUnwantedElementsFromContentElement(element);
    }

    // Optional, supply if cover image can usually be found on inital web page
    // Notes.
    //   1. If cover image is first image in content section, do not implement this function
    
    findCoverImageUrl(dom) {
        // Most common implementation is get first image in specified container. e.g. 
        return util.getFirstImgSrc(dom, "figure.story__thumbnail");
    }
    

    // Optional, supply if need to chase hyperlinks in page to get all chapter content
    
    async fetchChapter(url) {
        return (await HttpClient.wrapFetch(url)).responseXML;
    }
	
    // Optional, Return elements from page
    // that are to be shown on epub's "information" page
    
    getInformationEpubItemChildNodes(dom) {
        return [...dom.querySelectorAll("section.story__summary")];
    }
    
    // Optional, Any cleanup operations to perform on the nodes
    // returned by getInformationEpubItemChildNodes
    /*
    cleanInformationNode(node) {
        return node;
    }
    */
}
