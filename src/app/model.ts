export interface DistanceCalcRequest {
    origins: string[] | google.maps.LatLng[] | google.maps.Place[],
    destinations: string[] | google.maps.LatLng[] | google.maps.Place[],
    travelMode: string,
    unitSystem: 0,
    avoidHighways: boolean,
    avoidTolls: boolean,
    drivingOptions: {
        departureTime: Date,
        trafficModel: string
    }
}

export interface DirectionRequest {
    origin: string,
    destination: string,
    travelMode: string,
    unitSystem: 0,
    waypoints: google.maps.DirectionsWaypoint[],
    avoidTolls: boolean,
    avoidHighways: boolean,
}


export interface DialogSetting {
    picker: string,
    avoidToll: boolean,
    avoidHighways: boolean,
    combinedMode: boolean,
    waypoints: google.maps.DirectionsWaypoint[],
}


export interface travelDeatils {
    positionId: number,
    source: string,
    destination: string,
    sourcelatlng: string,
    destinationlatlng: string,
    source_loc_type: string,
    desintation_loc_type: string,
    distance: string,
    duration: string,
    orginActualAddress: string,
    destinationActualAddress: string,
    travelMode: string
    settings: DialogSetting
}


export interface ViewMapDetails {
    positionId: number,
    source: string,
    destination: string,
    distance: string,
    duration: string,
    travelMode: string,
    settings: DialogSetting;
}

export interface ViewCityDetails {

    positionId: number,
    sourceCity: string,
    destinationCity: string,
    sourceChineseName: string,
    destinationChineseName: string,
    manualdistance: string,
    systemdistance: string,
    systemduration: string,
    travelMode: string,

}