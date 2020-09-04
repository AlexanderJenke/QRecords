import {Diagnose, Encoder, Medication, MedicationIntervals, PhoneNumber, QRContents} from "./lib/parser-js/src/encoder";
import QRCode = require('qrcode');

class Page {
    json: QRContents;
    allergies: HTMLElement[];
    medications: HTMLElement[][];
    diagnoses: HTMLElement[];

    constructor() {
        this.allergies = [];
        this.medications = [];
        this.diagnoses = [];
    }

    addAllergie() {
        let input = document.createElement("input");
        input.className = "list-group-item form-control";
        input.type = "text";
        input.placeholder = "Allergie";
        document.getElementById('allergies_list').appendChild(input);
        this.allergies.push(input);
    }

    addDiagnose() {
        // @ts-ignore
        let keys = Object.keys(icds);

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
        for (let i = 0; i < keys.length; i++) {
            option = document.createElement("OPTION");
            // @ts-ignore
            option.appendChild(document.createTextNode(icds[keys[i]].icd + "  " +icds[keys[i]].name));
            option.value = keys[i];
            select.appendChild(option);
        }

        document.getElementById('diagnoses_list').appendChild(div);
        this.diagnoses.push(select);
    }

    addMedication() {
        // @ts-ignore
        let keys = Object.keys(pzns);

        let div = document.createElement("DIV");
        div.className = "list-group-item";
        let row = document.createElement("DIV");
        row.className = "container-fluid row";
        div.appendChild(row);
        document.getElementById('medications_list').appendChild(div);

        let select = document.createElement("SELECT");
        select.className = "col form-control";
        let defaultOption;
        defaultOption = document.createElement("OPTION");
        defaultOption.appendChild(document.createTextNode("Bitte auswählen..."));
        defaultOption.value = NaN;
        select.appendChild(defaultOption);
        row.appendChild(select);

        let option;
        for (let i = 0; i < keys.length; i++) {
            option = document.createElement("OPTION");
            // @ts-ignore
            option.appendChild(document.createTextNode(pzns[keys[i]].name));
            option.value = keys[i];
            select.appendChild(option);
        }

        let mo = document.createElement("input");
        mo.className = "col-1 form-control";
        mo.type = "number";
        mo.placeholder = "Mo";
        mo.max = "15";
        mo.min = "0";
        row.appendChild(mo);

        let mi = document.createElement("input");
        mi.className = "col-1 form-control";
        mi.type = "number";
        mi.placeholder = "Mi";
        mi.max = "15";
        mi.min = "0";
        row.appendChild(mi);

        let ab = document.createElement("input");
        ab.className = "col-1 form-control";
        ab.type = "number";
        ab.placeholder = "Ab";
        ab.max = "15";
        ab.min = "0";
        row.appendChild(ab);

        let na = document.createElement("input");
        na.className = "col-1 form-control";
        na.type = "number";
        na.placeholder = "Na";
        na.max = "15";
        na .min = "0";
        row.appendChild(na);

        this.medications.push([select, mo, mi, ab, na]);
    }

    parseInterval(s) {
        let i = parseInt(s) | 0;
        if (i < 0) {
            i = 0;
        }
        if (i > 15) {
            i = 15;
        }
        return i;
    }

    generateAnchor() {
        let contents = new QRContents();
        contents.generationDate = Math.floor(new Date().getTime() / (24 * 60 * 60 * 1000))

        contents.phoneMedical = new PhoneNumber();
        // @ts-ignore
        contents.phoneMedical.name = document.getElementById("doctor_name").value;
        // @ts-ignore
        contents.phoneMedical.number = document.getElementById("doctor_number").value.replace(/[^0-9+]*/g, '');

        contents.phoneContact = new PhoneNumber();
        // @ts-ignore
        contents.phoneContact.name = document.getElementById("emergency_name").value;
        // @ts-ignore
        contents.phoneContact.number = document.getElementById("emergency_number").value.replace(/[^0-9+]*/g, '');

        // @ts-ignore
        contents.notes = document.getElementById('notes').value;

        contents.allergies = [];
        for (let i = 0; i < this.allergies.length; i++) {
            // @ts-ignore
            if (this.allergies[i].value !== "") {
                // @ts-ignore
                contents.allergies.push(this.allergies[i].value);
            }
        }

        contents.medications = [];
        for (let i = 0; i < this.medications.length; i++) {
            // @ts-ignore
            let select = this.medications[i][0].value;
            // @ts-ignore
            let mo = this.parseInterval(this.medications[i][1].value);
            // @ts-ignore
            let mi = this.parseInterval(this.medications[i][2].value);
            // @ts-ignore
            let ab = this.parseInterval(this.medications[i][3].value);
            // @ts-ignore
            let na = this.parseInterval(this.medications[i][4].value);

            if (select !== "NaN") {
                let medication = new Medication();
                // @ts-ignore
                medication.code = select;
                medication.intervals = new MedicationIntervals();
                medication.intervals.morning = mo;
                medication.intervals.lunch = mi;
                medication.intervals.evening = ab;
                medication.intervals.night = na;
                contents.medications.push(medication);
            }
        }

        contents.diagnoses = [];
        for (let i = 0; i < this.diagnoses.length; i++) {
            // @ts-ignore
            if (this.diagnoses[i].value !== "NaN") {
                let diagnose = new Diagnose();
                // @ts-ignore
                diagnose.code = this.diagnoses[i].value;
                contents.diagnoses.push(diagnose);
            }
        }

        let encoder = new Encoder(contents);
        let anchor = encoder.encode();
        console.log("Data JSON: ");
        console.log(contents);
        console.log("Checksum: " + contents.checksum);
        console.log("Anchor: " + anchor);

        QRCode.toDataURL("http://qrecords.de/1#"+anchor, {errorCorrectionLevel: "H"}).then(function (val){
            let img = document.createElement('IMG');
            // @ts-ignore
            img.src = val;
            img.id="qrcode_img";
            // @ts-ignore
            document.getElementById('qrcode').innerHTML = '';
            document.getElementById('qrcode').appendChild(img);

            let text = document.createElement("DIV");
            text.id = "qrcode_text";

            let name = document.createElement('B');
            // @ts-ignore
            name.appendChild(document.createTextNode(document.getElementById('name').value));
            text.appendChild(name)

            // @ts-ignore
            text.appendChild(document.createTextNode(", " + document.getElementById('firstname').value));
            text.appendChild(document.createElement('BR'))
            // @ts-ignore
            text.appendChild(document.createTextNode(document.getElementById('birthdate').value.toString()));
            text.appendChild(document.createElement('BR'))
            // @ts-ignore
            let checksum = document.createElement('span');
            // @ts-ignore
            checksum.appendChild(document.createTextNode("CodeID: " + contents.checksum.toString()))
            checksum.id = 'qrcode_checksum'
            text.appendChild(checksum);



            document.getElementById('qrcode').appendChild(text);

            // @ts-ignore
            $('#qrcodeModal').modal('toggle');
        })

    }

}

let page = new Page();  // build Page

export {page, QRContents, QRCode}
