function goto(e) {
    e.scrollIntoView(true);
}

let allergies = [];
let medications = [];
let diagnoses = [];

function buildPage(parserObject) {
    let number;
    let link;
    let i;

    // Add checksum
    document.getElementById('checksum').innerText = "PatientenID: " + parserObject.checksum.toString();

    // Add date
    addListElement('date', document.createTextNode(parserObject.generationDate.toString()));

    // Add phoneContact
    addListElement('emergency_contact', document.createTextNode(parserObject.phoneContact.name));
    number = parserObject.phoneContact.number.toString();
    link = createLink("tel:" + number, document.createTextNode(number));
    addListElement('emergency_contact', link);

    // Add doctors_contact
    addListElement('doctors_contact', document.createTextNode(parserObject.phoneMedical.name));
    number = parserObject.phoneMedical.number.toString();
    link = createLink("tel:" + number, document.createTextNode(number));
    addListElement('doctors_contact', link);

    // Add allergies structure
    let parser_allergies;
    parser_allergies = parserObject.allergies;
    for (i = 0; i < parser_allergies.length; i++) {
        allergies.push(addListElement('allergies_list', createSpinner()));
    }

    // Add medications structure
    let parser_medications;
    parser_medications = parserObject.medications;
    for (i = 0; i < parser_medications.length; i++) {
        medications.push(addListElement('medications_list', createSpinner()));
    }

    // Add diagnoses structure
    let parser_diagnoses;
    parser_diagnoses = parserObject.diagnoses;
    for (i = 0; i < parser_diagnoses.length; i++) {
        diagnoses.push(addListElement('diagnoses_list', createSpinner()));
    }

    // Add notes
    addListElement('notes_list', document.createTextNode(parserObject.notes.toString()));

    // update content for the first time
    updatePage(parserObject)
}

function addListElement(list_id, list_content) {
    let node = document.createElement("LI");
    node.className = "list-group-item";
    node.appendChild(list_content);
    document.getElementById(list_id).appendChild(node);
    return node
}

function updateListContent(node, content) {
    node.innerHTML = '';
    node.appendChild(content);
}

function createLink(href, text) {
    let link: HTMLElement = document.createElement('A');
    // @ts-ignore
    link.href = href;
    // @ts-ignore
    link.target = "_blank";
    link.appendChild(text);
    return link
}

function createSpinner() {
    let spinner : HTMLSpanElement= document.createElement('SPAN');
    spinner.className = "spinner-border text-secondary mb-0"
    // @ts-ignore
    spinner.role = "status"
    return spinner
}

function updatePage(parserObject) {
    let i;
    let span;
    let link;
    let icd;

    // Add allergies content
    let parser_allergies;
    parser_allergies = parserObject.allergies
    for (i = 0; i < parser_allergies.length; i++) {
        updateListContent(allergies[i], document.createTextNode(parser_allergies[i]))
    }

    // Add medications content
    let parser_medications;
    parser_medications = parserObject.medications
    for (i = 0; i < parser_medications.length; i++) {
        if (parser_medications[i].resolved) {
            span = document.createElement('SPAN');
            link = document.createTextNode(parser_medications[i].name);
            if (parser_medications[i].ref !== "") {
                link = createLink(parser_medications[i].ref, link);
            }
            span.appendChild(link);
            span.appendChild(document.createElement('BR'))
            span.appendChild(document.createTextNode(
                parser_medications[i].intervals.morning.toString() + " / " +
                parser_medications[i].intervals.lunch.toString() + " / " +
                parser_medications[i].intervals.evening.toString() + " / " +
                parser_medications[i].intervals.night.toString()));
            updateListContent(medications[i], span);
        }
    }

    // Add diagnoses content
    let parser_diagnoses;
    parser_diagnoses = parserObject.diagnoses
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
                link = createLink(parser_diagnoses[i].ref, link);
            }
            link.className = "col";
            span.appendChild(link);
            updateListContent(diagnoses[i], span);
        }
    }
}

function getAnchor() {
    return (document.URL.split('#').length > 1) ? document.URL.split('#')[1] : null;
}


import {Decoder} from "./lib/parser-js/src/decoder";
import {Resolver} from "./lib/parser-js/src/resolver";

// run parsing
var json = new Decoder(getAnchor()).decode();
// @ts-ignore
buildPage(json);

new Resolver(json).resolve();

export {json}