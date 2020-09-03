import {QRContents} from "./lib/parser-js/src/encoder";

class Page {
    json: QRContents;
    allergies: HTMLElement[];
    medications: HTMLElement[];
    diagnoses: HTMLElement[];

    constructor() {
        this.allergies = [];
        this.medications = [];
        this.diagnoses = [];
    }

    addInput(id) {
        let list: HTMLElement[];
        if (id === 'allergies_list') {
            list = this.allergies;
        }
        if (id === 'medications_list') {
            list = this.medications;
        }
        if (id === 'diagnoses_list') {
            list = this.diagnoses;
        }
        list.push(this.addSelection(id, [[1, "Test"], [2, "Name"], [3, "Drei"]]));
    }

    addSelection(id, options) {
        let div = document.createElement("DIV");
        div.className = "list-group-item";
        let select = document.createElement("SELECT");
        select.className = "form-control";
        let defaultOption;
        defaultOption = document.createElement("OPTION");
        defaultOption.appendChild(document.createTextNode("Bitte auswählen..."));
        defaultOption.value = NaN;
        select.appendChild(defaultOption);
        div.appendChild(select);
        let option;
        for (let i = 0; i < options.length; i++) {
            option = document.createElement("OPTION");
            option.appendChild(document.createTextNode(options[i][1]));
            option.value = options[i][0];
            select.appendChild(option);
        }
        document.getElementById(id).appendChild(div);
        return select;
    }

}

let page = new Page();  // build Page

export {page}
