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
    sourceAddress: sourDistDetails,
    destinationAddress: sourDistDetails
    distance: string,
    duration: string,
    orginActualAddress: string,
    destinationActualAddress: string,
    travelMode: string,
    settings: DialogSetting
}

export interface addressComponent {
    country: string,
    province: string,
    locality: string
}

export interface geometryDetails {
    latlng: string,
    loc_type: string,
    formattedaddr: string,
    addrcmp: addressComponent
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

export interface postReqTemp {
    source: string,
    destination: string,
    distance: string,
    duration: string,
    travelMode: string,
    geometricDetails: sourDistDetails[],
    autoCitySettings: DialogSetting
    destinationActualAddress: string,
    orginActualAddress: string,
    positionId: number
}

export interface sourDistDetails {
        latitude: string,
        longtitude: string,
        locationType: string,
        formattedAddress: string,
        country: string,
        province: string,
        locality: string,
        addrType: string        
}

