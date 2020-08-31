function goto(elem) {
    elem.scrollIntoView(true);
}

var e = []
var f = []
var g = []

var x = function (w) {
    return document.createTextNode(w)
}
var y = function (w) {
    return document.getElementById(w)
}
var z = function (w) {
    return document.createElement(w)
}

function buildPage(parserObject) {
    y('checksum').innerText = "PatientenID: " + parserObject.checksum;
    a('date', x(parserObject.generationDate.toString()));
    var o = parserObject.phoneContact;
    a('emergency_contact', x(o.name));
    var n = o.number;
    a('emergency_contact', c("tel:" + n, x(n)));
    o = parserObject.phoneMedical;
    a('doctors_contact', x(o.name));
    a('doctors_contact', c("tel:" + n, x(o.number)));
    for (var i = 0; i < parserObject.allergies.length; i++) {
        e.push(a('allergies_list', d()));
    }
    for (i = 0; i < parserObject.medications.length; i++) {
        f.push(a('medications_list', d()));
    }
    for (i = 0; i < parserObject.diagnoses.length; i++) {
        g.push(a('diagnoses_list', d()));
    }
    a('notes_list', x(parserObject.notes.toString()));
    updatePage(parserObject)
}

function a(list_id, list_content) {
    var node = z("LI");
    node.className = "list-group-item";
    node.appendChild(list_content);
    y(list_id).appendChild(node);
    return node
}

function b(node, content) {
    node.innerHTML = '';
    node.appendChild(content);
}

function c(href, text) {
    var link = z('A');
    link.href = href;
    link.target = "_blank";
    link.appendChild(text);
    return link
}

function d() {
    var spinner = z('SPAN');
    spinner.className = "spinner-border text-secondary mb-0"
    spinner.role = "status"
    return spinner
}

function updatePage(parserObject) {
    h = parserObject.allergies
    for (var i = 0; i < h.length; i++) {
        b(e[i], x(h[i]))
    }
    h = parserObject.medications
    for (i = 0; i < h.length; i++) {
        if (h[i].state === "RESOLVED") {
            var k = z('SPAN');
            var l = x(h[i].name);
            if (h[i].ref !== "") {
                l = c(h[i].ref, l);
            }
            k.appendChild(l);
            k.appendChild(z('BR'))
            j = h[i].intervals
            k.appendChild(x(
                j.morning.toString() + " / " +
                j.lunch.toString() + " / " +
                j.evening.toString() + " / " +
                j.night.toString()));
            b(f[i], k);
        }
    }
    h = parserObject.diagnoses
    for (i = 0; i < h.length; i++) {
        if (h[i].state === "RESOLVED") {
            var k = z('SPAN');
            k.className = "row align-items-start";
            var l = z('SPAN');
            l.className = "col-2 mb-0";
            l.appendChild(x(h[i].icd.toString()));
            k.appendChild(l);
            var m = x(h[i].name);
            if (h[i].ref !== "") {
                m = c(h[i].ref, m);
            }
            m.className = "col";
            k.appendChild(m);
            b(g[i], k);
        }
    }
}