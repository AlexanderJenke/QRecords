import {Decoder} from "./decoder";
import {Resolver} from "./resolver";


function getAnchor() {
    return (document.URL.split('#').length > 1) ? document.URL.split('#')[1] : null;
}

// run parsing
new Resolver(new Decoder(getAnchor()).decode()).resolve()