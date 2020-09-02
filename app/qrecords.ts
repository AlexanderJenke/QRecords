import {Decoder, QRContents} from "./lib/parser-js/src/decoder";
import {Resolver} from "./lib/parser-js/src/resolver";

class Page {
    json: QRContents;
    allergies: HTMLElement[];
    medications: HTMLElement[];
    diagnoses: HTMLElement[];

    constructor(json: QRContents) {
        this.json = json;
        this.allergies = [];
        this.medications = [];
        this.diagnoses = [];
        this.build();
    }

    build() {
        let number;
        let link;
        let i;

        // Add checksum
        document.getElementById('checksum').innerText = "PatientenID: " + this.json.checksum.toString();

        // Add date
        this.addListElement('date', document.createTextNode(this.json.getGenerationDateText()));

        // Add phoneContact
        this.addListElement('emergency_contact', document.createTextNode(this.json.phoneContact.name));
        number = this.json.phoneContact.number.toString();
        link = this.createLink("tel:" + number, document.createTextNode(number));
        this.addListElement('emergency_contact', link);

        // Add doctors_contact
        this.addListElement('doctors_contact', document.createTextNode(this.json.phoneMedical.name));
        number = this.json.phoneMedical.number.toString();
        link = this.createLink("tel:" + number, document.createTextNode(number));
        this.addListElement('doctors_contact', link);

        // Add allergies structure
        for (i = 0; i < this.json.allergies.length; i++) {
            this.allergies.push(this.addListElement('allergies_list', this.createSpinner()));
        }

        // Add medications structure
        for (i = 0; i < this.json.medications.length; i++) {
            this.medications.push(this.addListElement('medications_list', this.createSpinner()));
        }

        // Add diagnoses structure
        for (i = 0; i < this.json.diagnoses.length; i++) {
            this.diagnoses.push(this.addListElement('diagnoses_list', this.createSpinner()));
        }

        // Add notes
        this.addListElement('notes_list', document.createTextNode(this.json.notes.toString()));

        // update content for the first time
        this.update();
    }

    addListElement(list_id, list_content) {
        let node = document.createElement("LI");
        node.className = "list-group-item";
        node.appendChild(list_content);
        document.getElementById(list_id).appendChild(node);
        return node
    }

    updateListContent(node, content) {
        node.innerHTML = '';
        node.appendChild(content);
    }

    createLink(href, text) {
        let link: HTMLElement = document.createElement('A');
        // @ts-ignore
        link.href = href;
        // @ts-ignore
        link.target = "_blank";
        link.appendChild(text);
        return link
    }

    createSpinner() {
        let spinner: HTMLSpanElement = document.createElement('SPAN');
        spinner.className = "spinner-border text-secondary mb-0"
        // @ts-ignore
        spinner.role = "status"
        return spinner
    }

    update() {
        let i;
        let span;
        let link;
        let icd;

        // Add allergies content
        for (i = 0; i < this.json.allergies.length; i++) {
            this.updateListContent(this.allergies[i], document.createTextNode(this.json.allergies[i]))
        }

        // Add medications content
        let medications = this.json.medications;
        for (i = 0; i < medications.length; i++) {
            if (medications[i].resolved) {
                span = document.createElement('SPAN');
                link = document.createTextNode(medications[i].name);
                if (medications[i].ref !== "") {
                    link = this.createLink(medications[i].ref, link);
                }
                span.appendChild(link);
                span.appendChild(document.createElement('BR'))
                span.appendChild(document.createTextNode(medications[i].intervals.toString()));
                this.updateListContent(this.medications[i], span);
            }
        }

        // Add diagnoses content
        let diagnoses = this.json.diagnoses;
        for (i = 0; i < diagnoses.length; i++) {
            if (diagnoses[i].resolved) {
                span = document.createElement('SPAN');
                span.className = "row align-items-start";
                icd = document.createElement('SPAN');
                icd.className = "col-2 mb-0";
                icd.appendChild(document.createTextNode(diagnoses[i].icd.toString()));
                span.appendChild(icd);
                link = document.createTextNode(diagnoses[i].name);
                if (diagnoses[i].ref !== "") {
                    link = this.createLink(diagnoses[i].ref, link);
                }
                link.className = "col";
                span.appendChild(link);
                this.updateListContent(this.diagnoses[i], span);
            }
        }
    }
}

function goto(e) {
    e.scrollIntoView(true);
}

function getAnchor() {
    return (document.URL.split('#').length > 1) ? document.URL.split('#')[1] : null;
}

function run() {
    let json = new Decoder(getAnchor()).decode();  // parse
    let page = new Page(json);  // build Page
    new Resolver(json, page.update.bind(page)).resolve();  // resolve and fill page
}

export {run, goto}
