import {Decoder} from "./decoder";
import {Resolver} from "./resolver";


function getAnchor() {
    return (document.URL.split('#').length > 1) ? document.URL.split('#')[1] : null;
}

// run parsing
var json = new Decoder(getAnchor()).decode()
// @ts-ignore
buildPage(json)
new Resolver(json).resolve()

export {json}