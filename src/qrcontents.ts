export class QRContents {
    checksum: number;
    generationDate: number;
    phoneContact: PhoneNumber;
    phoneMedical: PhoneNumber;
    allergies: string[];
    medications: Medication[];
    diagnoses: Diagnose[];
    notes: string;

    getGenerationDateText(): string {
        return new Date(this.generationDate * 24 * 60 * 60 * 1000).toDateString();
    }
}

export class PhoneNumber {
    name: string;
    number: string;
}

export class Medication {
    code: number;
    resolved: boolean;
    pzn: number;
    name: string;
    desc: string;
    ref: string;
    intervals: MedicationIntervals;
}

export class MedicationIntervals {
    morning: number;
    lunch: number;
    evening: number;
    night: number;

    toString(){
        return this.morning.toString() + " / " +
            this.lunch.toString() + " / " +
            this.evening.toString() + " / " +
            this.night.toString();
    }
}

export class Diagnose {
    code: number;
    resolved: boolean;
    icd: string;
    name: string;
    desc: string;
    ref: string;
}