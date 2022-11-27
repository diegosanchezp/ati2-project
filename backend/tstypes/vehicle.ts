export interface VehicleBrandSerializer {
    id?: number;
    name: string;
}

export interface VehicleModelSerializer {
    id?: number;
    name: string;
}

export interface VehicleSerializer {
    id?: number;
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
    location_zone?: string;
    exact_location?: string;
    rental_price?: number | null;
    sale_price?: number | null;
    contact_first_name?: string;
    contact_last_name?: string;
    contact_email?: string;
    location_city?: number | string | null;
    owner: number | string;
    model: number | string;
    brand: number | string;
    currency?: number | string | null;
}

export interface VehicleImageSerializer {
    id?: number;
    image: any;
    vehicle: number | string;
}

export interface VehicleGetSerializer {
    vehicle: VehicleSerializer;
    images: VehicleImageSerializer[];
    videos: VehicleImageSerializer[];
    countries: any;
    states: any;
    cities: any;
}

