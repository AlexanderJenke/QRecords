function goto(elem) {
    elem.scrollIntoView(true);
}

var allergies = []
var medications = []
var diagnoses = []


function buildPage(parserObject) {
    // Add checksum
    document.getElementById('checksum').innerText = "PatientenID: " + parserObject.checksum.toString();

    // Add date
    addListElement('date', document.createTextNode(parserObject.generationDate.toString()));

    // Add phoneContact
    addListElement('emergency_contact', document.createTextNode(parserObject.phoneContact.name));
    var number = parserObject.phoneContact.number.toString();
    var link = createLink("tel:" + number, document.createTextNode(number));
    addListElement('emergency_contact', link);

    // Add doctors_contact
    addListElement('doctors_contact', document.createTextNode(parserObject.phoneMedical.name));
    var number = parserObject.phoneMedical.number.toString();
    var link = createLink("tel:" + number, document.createTextNode(number));
    addListElement('doctors_contact', link);

    // Add allergies structure
    parser_allergies = parserObject.allergies;
    for (var i = 0; i < parser_allergies.length; i++) {
        allergies.push(addListElement('allergies_list', createSpinner()));
    }

    // Add medications structure
    parser_medications = parserObject.medications;
    for (var i = 0; i < parser_medications.length; i++) {
        medications.push(addListElement('medications_list', createSpinner()));
    }

    // Add diagnoses structure
    parser_diagnoses = parserObject.diagnoses;
    for (var i = 0; i < parser_diagnoses.length; i++) {
        diagnoses.push(addListElement('diagnoses_list', createSpinner()));
    }

    // Add notes
    addListElement('notes_list', document.createTextNode(parserObject.notes.toString()));

    // update content for the first time
    updatePage(parserObject)
}

function addListElement(list_id, list_content) {
    var node = document.createElement("LI");
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
    var link = document.createElement('A');
    link.href = href;
    link.target = "_blank";
    link.appendChild(text);
    return link
}

function createSpinner() {
    var spinner = document.createElement('SPAN');
    spinner.className = "spinner-border text-secondary mb-0"
    spinner.role = "status"
    return spinner
}

function updatePage(parserObject) {
    // Add allergies content
    parser_allergies = parserObject.allergies
    for (var i = 0; i < parser_allergies.length; i++) {
        updateListContent(allergies[i], document.createTextNode(parser_allergies[i]))
    }

    // Add medications content
    parser_medications = parserObject.medications
    for (var i = 0; i < parser_medications.length; i++) {
        if (parser_medications[i].state === "RESOLVED") {
            var span = document.createElement('SPAN');
            var link = document.createTextNode(parser_medications[i].name);
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
    parser_diagnoses = parserObject.diagnoses
    for (var i = 0; i < parser_diagnoses.length; i++) {
        if (parser_diagnoses[i].state === "RESOLVED") {
            var span = document.createElement('SPAN');
            span.className = "row align-items-start";
            var icd = document.createElement('SPAN');
            icd.className = "col-2 mb-0";
            icd.appendChild(document.createTextNode(parser_diagnoses[i].icd.toString()));
            span.appendChild(icd);
            var link = document.createTextNode(parser_diagnoses[i].name);
            if (parser_medications[i].ref !== "") {
                link = createLink(parser_diagnoses[i].ref, link);
            }
            link.className = "col";
            span.appendChild(link);
            updateListContent(diagnoses[i], span);
        }
    }
}

// dummy json
json = {
    "checksum": 815,
    "generationDate": "ISO - 8601",
    "phoneContact": {
        "name": "Klaus Müller",
        "number": "0800 800 3 800"
    },
    "phoneMedical": {
        "name": "Dr. Klaus Müller",
        "number": "+49..."
    },
    "allergies":
        ["Erdnuss", "Paracetamol"],
    "medications":
        [
            {
                "code": 123, //Our assigned number
                "state": "LOADING",
                "pzn": 8909889,
                "name": "Aspirin",
                "ref": "https://wikipedia.org/Aspirin",
                "intervals": {"morning": 3, "lunch": 0, "evening": 0, "night": 0}
            }
        ],
    "diagnoses":
        [
            {
                "code": 123, //Our assigned number
                "state": "RESOLVED",
                "icd": "R32.0",
                "name": "Harninkontinenz",
                "ref": "https://de.wikipedia.org/wiki/Harninkontinenz"
            }
        ],
    "notes": "Sehr schwieriger Patient, nicht zu empfehlen"
}
