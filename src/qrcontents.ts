export class QRContents {
    checksum: number;
    generationDate: number;
    phoneContact: PhoneNumber;
    phoneMedical: PhoneNumber;
    allergies: string[];
    medications: Medication[];
    diagnoses: Diagnose[];
    notes: string;
}

export class PhoneNumber {
    name: string;
    number: string;
}

export class Medication {
    code: number;
    state: string;
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
}

export class Diagnose {
    code: number;
    state: string;
    icd: string;
    name: string;
    desc: string;
    ref: string;
}