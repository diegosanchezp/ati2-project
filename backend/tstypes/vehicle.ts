export interface TelephoneSerializer {
    number: string;
    country_number: number;
    ext?: string;
    ptype: "FIXED" | "MOBILE";
}

export interface VehicleBrandSerializer {
    id?: number;
    name: string;
}

export interface VehicleModelSerializer {
    id?: number;
    name: string;
}

export interface CityNestedSerializer {
    id?: number;
    name: string;
    state?: any;
}

export interface VechicleModelNested {
    id?: number;
    name: string;
    brand?: any;
}

export interface VehicleVideosSerializer {

}

export interface VehicleImageSerializer {
    id?: number;
    image: any;
    vehicle: number | string;
}

export interface VehicleSerializer {
    id?: number;
    location_city: CityNestedSerializer;
    model: VechicleModelNested;
    images: VehicleImageSerializer[];
    videos: VehicleVideosSerializer[];
    contact_phone_numbers: TelephoneSerializer[];
    type_vehicle?: "TRUCK" | "CAR" | "VAN";
    contact_days: any;
    contact_hour_from: string;
    contact_hour_to: string;
    year: string;
    contract_type: "RENTAL" | "SALE" | "RENTAL_SALE";
    status: "NEW" | "USED";
    details?: string;
    accessories?: string;
    services?: string;
    publication_enabled?: boolean;
    init_publication_date?: string;
    finish_publication_date?: string;
    location_zone?: string;
    exact_location?: string;
    rental_price?: number | null;
    sale_price?: number | null;
    contact_first_name?: string;
    contact_last_name?: string;
    contact_email?: string;
    currency?: any;
}

export interface VehicleGetSerializer {
    vehicle: VehicleSerializer;
    images: VehicleImageSerializer[];
    videos: VehicleImageSerializer[];
    countries: any;
    states: any;
    cities: any;
}

