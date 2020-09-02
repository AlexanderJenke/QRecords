import {Diagnose, Medication, MedicationIntervals, PhoneNumber, QRContents} from "./qrcontents";
import {ByteBuffer} from "./buffer";
import {NAME_CHARSET, PHONE_CHARSET, VARTEXT_CHARSET} from "./charsets";
import {toByteArray} from "./base64";

export class Decoder {
    anchor: string;
    result: QRContents;

    constructor(anchor: string) {
        this.anchor = anchor;
    }

    getResult(): QRContents {
        return this.result;
    }

    decode(): QRContents {
        let binaryData = toByteArray(this.anchor);
        let buffer = new ByteBuffer(binaryData);
        this.result = new QRContents();

        this.result.checksum = buffer.generateChecksum();
        this.result.generationDate = buffer.readUnsignedNum(16);

        this.result.phoneContact = new PhoneNumber();
        let len = buffer.readUnsignedNum(6);
        this.result.phoneContact.name = buffer.readString(len, NAME_CHARSET);
        len = buffer.readUnsignedNum(6);
        this.result.phoneContact.number = buffer.readString(len, PHONE_CHARSET);

        this.result.phoneMedical = new PhoneNumber();
        len = buffer.readUnsignedNum(6);
        this.result.phoneMedical.name = buffer.readString(len, NAME_CHARSET);
        len = buffer.readUnsignedNum(6);
        this.result.phoneMedical.number = buffer.readString(len, PHONE_CHARSET);

        let count = buffer.readUnsignedNum(6);
        this.result.allergies = [];
        for(let i = 0; i<count; i++){
            len = buffer.readUnsignedNum(6);
            this.result.allergies = this.result.allergies.concat(buffer.readString(len, NAME_CHARSET));
        }

        count = buffer.readUnsignedNum(6);
        this.result.medications = [];
        for(let i = 0; i<count; i++){
            let med = new Medication();
            med.code = buffer.readUnsignedNum(24);
            med.intervals = new MedicationIntervals();
            med.intervals.morning = buffer.readUnsignedNum(4);
            med.intervals.lunch = buffer.readUnsignedNum(4);
            med.intervals.evening = buffer.readUnsignedNum(4);
            med.intervals.night = buffer.readUnsignedNum(4);
            med.resolved = false;
            this.result.medications = this.result.medications.concat(med);
        }

        count = buffer.readUnsignedNum(6);
        this.result.diagnoses = [];
        for(let i = 0; i<count; i++){
            let dia = new Diagnose();
            dia.code = buffer.readUnsignedNum(14);
            dia.resolved = false;
            this.result.diagnoses = this.result.diagnoses.concat(dia);
        }

        len = buffer.readUnsignedNum(12);
        this.result.notes = buffer.readString(len, VARTEXT_CHARSET);

        return this.result;
    }
}

export {Diagnose, Medication, MedicationIntervals, PhoneNumber, QRContents}