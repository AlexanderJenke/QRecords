export class ByteBuffer {
    data: Uint8Array;
    position: number;

    constructor(data: Uint8Array) {
        this.data = data;
        this.position = 0;
    }

    isBitSet(bit: number): boolean {
        let index = bit >> 3;
        bit %= 8;
        let mask = 0x80 >> bit;
        return (this.data[index] & mask) == mask;
    }

    setBit(bit: number, active: boolean): void {
        let index = bit >> 3;
        bit %= 8;
        let mask = 0x80 >> bit;
        if (active) {
            this.data[index] |= mask;
        } else {
            mask = ~mask;
            this.data[index] &= mask;
        }
    }

    readBit(): boolean {
        let ret = this.isBitSet(this.position);
        this.position++;
        return ret;
    }

    readUnsignedNum(bits: number): number {
        let ret = 0;
        for (let i = 0; i < bits; i++) {
            if (this.readBit()) {
                ret += 0x1 << (bits - i - 1);
            }
        }
        return ret;
    }

    readBinary(bits: number): Uint8Array {
        let ret = new Uint8Array((bits >> 3) + (bits % 8 == 0 ? 0 : 1));
        let innerOffset = (8 - (bits % 8)) % 8;
        for (let i = 0; i < bits; i++) {
            let bit = innerOffset + i;
            if (this.readBit()) {
                let index = bit >> 3;
                bit %= 8;
                let mask = 0x80 >> bit;
                ret[index] |= mask;
            }
        }
        return ret;
    }

    /**
     * Reads a string with charset
     * @param len in characters to read (7 bits per character)
     */
    readString(len: number, charset: string): string {
        let bits = Math.ceil(Math.log(charset.length) / Math.log(2));
        let ret = '';
        for (let i = 0; i < len; i++) {
            ret += charset.charAt(this.readUnsignedNum(bits));
        }
        return ret;
    }

    writeBit(set: boolean): void {
        this.setBit(this.position, set);
        this.position++;
    }

    writeUnsignedNum(num: number, bits: number): void {
        for (let i = 0; i < bits; i++) {
            let mask = 0x1 << (bits - i - 1);
            this.writeBit((mask & num) == mask);
        }
    }

    writeBinary(arr: Uint8Array, bits: number): void {
        let innerOffset = (8 - (bits % 8)) % 8;
        for (let i = 0; i < bits; i++) {
            let bit = innerOffset + i;
            let index = bit >> 3;
            bit %= 8;
            let mask = 0x80 >> bit;
            this.writeBit((arr[index] & mask) == mask);
        }
    }

    /**
     * Writes a string
     * @param str the string to encode
     */
    writeString(str: string, charset: string): void {
        let bits = Math.ceil(Math.log(charset.length) / Math.log(2));
        for (let i = 0; i < str.length; i++) {
            let code = charset.indexOf(str.charAt(i));
            if(code == -1)code = 0;
            this.writeUnsignedNum(code, bits);
        }
    }

    rewind(): void {
        this.position = 0;
    }

    getPosition(): number {
        return this.position;
    }

    finalize(): Uint8Array{
        let len = (this.position >> 3) + ((this.position%8)==0?0:1);
        let newdata = new Uint8Array(len);
        for(let i = 0; i<len; i++){
            newdata[i] = this.data[i];
        }
        this.data = newdata;
        return newdata;
    }
}