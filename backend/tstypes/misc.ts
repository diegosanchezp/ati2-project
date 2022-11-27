export interface TelephoneSerializer {
    number: string;
    country_number: number;
    ext?: string;
    ptype: "FIXED" | "MOBILE";
}

