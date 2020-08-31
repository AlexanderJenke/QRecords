import {Diagnose, Medication, MedicationIntervals, PhoneNumber, QRContents} from "./qrcontents";
import {Encoder} from "./encoder";
import {Decoder} from "./decoder";

let contents = new QRContents();
contents.checksum = 815;
contents.generationDate = 32021;
contents.phoneContact = new PhoneNumber();
contents.phoneContact.name = "Klaus Müller";
contents.phoneContact.number = "+49 800 800 3 800";
contents.phoneMedical = new PhoneNumber();
contents.phoneMedical.name = "EinsEinsZwei - sei dabei";
contents.phoneMedical.number = "112";
contents.allergies = ["Erdnuss", "Mangomilchshake"];
let med = new Medication();
med.code = 12321;
med.intervals = new MedicationIntervals();
med.intervals.morning = 3;
med.intervals.lunch = 2;
med.intervals.evening = 1;
med.intervals.night = 0;
contents.medications = [med];
let diagnose = new Diagnose();
diagnose.code = 320;
contents.diagnoses = [diagnose];
contents.notes = "Lorem ipsum dolor sit amet!";
console.log(contents);

let encoder = new Encoder(contents);
let raw = encoder.encode();
console.log(raw);

let decoder = new Decoder(raw);
console.log(decoder.decode());