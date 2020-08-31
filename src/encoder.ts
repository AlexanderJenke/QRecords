import {Diagnose, Medication, PhoneNumber, QRContents} from "./qrcontents";
import {ByteBuffer} from "./buffer";
import {NAME_CHARSET, PHONE_CHARSET, VARTEXT_CHARSET} from "./charsets";
import {fromByteArray} from "./base64";

export class Encoder {
    input: QRContents;
    anchor: string;

    constructor(input: QRContents) {
        this.input = input;
    }

    getResult(): string {
        return this.anchor;
    }

    encode(): string {
        let buffer = new ByteBuffer(new Uint8Array(4096));

        buffer.writeUnsignedNum(this.input.checksum, 14);
        buffer.writeUnsignedNum(this.input.generationDate, 16);

        buffer.writeUnsignedNum(this.input.phoneContact.name.length, 6);
        buffer.writeString(this.input.phoneContact.name, NAME_CHARSET);
        buffer.writeUnsignedNum(this.input.phoneContact.number.length, 6);
        buffer.writeString(this.input.phoneContact.number, PHONE_CHARSET);

        buffer.writeUnsignedNum(this.input.phoneMedical.name.length, 6);
        buffer.writeString(this.input.phoneMedical.name, NAME_CHARSET);
        buffer.writeUnsignedNum(this.input.phoneMedical.number.length, 6);
        buffer.writeString(this.input.phoneMedical.number, PHONE_CHARSET);

        buffer.writeUnsignedNum(this.input.allergies.length, 6);
        this.input.allergies.forEach(function (allergy) {
            buffer.writeUnsignedNum(allergy.length, 6);
            buffer.writeString(allergy, NAME_CHARSET);
        });

        buffer.writeUnsignedNum(this.input.medications.length, 6);
        this.input.medications.forEach(function (medication) {
            buffer.writeUnsignedNum(medication.code, 24);
            buffer.writeUnsignedNum(medication.intervals.morning, 4);
            buffer.writeUnsignedNum(medication.intervals.lunch, 4);
            buffer.writeUnsignedNum(medication.intervals.evening, 4);
            buffer.writeUnsignedNum(medication.intervals.night, 4);
        });

        buffer.writeUnsignedNum(this.input.diagnoses.length, 6);
        this.input.diagnoses.forEach(function (diagnose) {
            buffer.writeUnsignedNum(diagnose.code, 14);
        });

        buffer.writeUnsignedNum(this.input.notes.length, 12);
        buffer.writeString(this.input.notes, VARTEXT_CHARSET);

        this.anchor = fromByteArray(buffer.finalize());
        return this.anchor;
    }
}