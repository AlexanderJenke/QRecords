function goto(e) {
    e.scrollIntoView(true);
}

let allergies = [];
let medications = [];
let diagnoses = [];


function getAnchor() {
    return (document.URL.split('#').length > 1) ? document.URL.split('#')[1] : null;
}


import {Decoder, QRContents} from "./lib/parser-js/src/decoder";
import {Resolver} from "./lib/parser-js/src/resolver";

class Page {
    json: QRContents;

    constructor(json: QRContents) {
        this.json = json;
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
        let parser_allergies;
        parser_allergies = this.json.allergies;
        for (i = 0; i < parser_allergies.length; i++) {
            allergies.push(this.addListElement('allergies_list', this.createSpinner()));
        }

        // Add medications structure
        let parser_medications;
        parser_medications = this.json.medications;
        for (i = 0; i < parser_medications.length; i++) {
            medications.push(this.addListElement('medications_list', this.createSpinner()));
        }

        // Add diagnoses structure
        let parser_diagnoses;
        parser_diagnoses = this.json.diagnoses;
        for (i = 0; i < parser_diagnoses.length; i++) {
            diagnoses.push(this.addListElement('diagnoses_list', this.createSpinner()));
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
        let parser_allergies;
        parser_allergies = this.json.allergies
        for (i = 0; i < parser_allergies.length; i++) {
            this.updateListContent(allergies[i], document.createTextNode(parser_allergies[i]))
        }

        // Add medications content
        let parser_medications;
        parser_medications = this.json.medications
        for (i = 0; i < parser_medications.length; i++) {
            if (parser_medications[i].resolved) {
                span = document.createElement('SPAN');
                link = document.createTextNode(parser_medications[i].name);
                if (parser_medications[i].ref !== "") {
                    link = this.createLink(parser_medications[i].ref, link);
                }
                span.appendChild(link);
                span.appendChild(document.createElement('BR'))
                span.appendChild(document.createTextNode(
                    parser_medications[i].intervals.morning.toString() + " / " +
                    parser_medications[i].intervals.lunch.toString() + " / " +
                    parser_medications[i].intervals.evening.toString() + " / " +
                    parser_medications[i].intervals.night.toString()));
                this.updateListContent(medications[i], span);
            }
        }

        // Add diagnoses content
        let parser_diagnoses;
        parser_diagnoses = this.json.diagnoses
        for (i = 0; i < parser_diagnoses.length; i++) {
            if (parser_diagnoses[i].resolved) {
                span = document.createElement('SPAN');
                span.className = "row align-items-start";
                icd = document.createElement('SPAN');
                icd.className = "col-2 mb-0";
                icd.appendChild(document.createTextNode(parser_diagnoses[i].icd.toString()));
                span.appendChild(icd);
                link = document.createTextNode(parser_diagnoses[i].name);
                if (parser_diagnoses[i].ref !== "") {
                    link = this.createLink(parser_diagnoses[i].ref, link);
                }
                link.className = "col";
                span.appendChild(link);
                this.updateListContent(diagnoses[i], span);
            }
        }
    }
}

let json = new Decoder(getAnchor()).decode();  // parse
let page = new Page(json)  // build Page
new Resolver(json, page.update).resolve();  // resolve and fill page

//TODO remove
export {json}