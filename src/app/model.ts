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
    origin: string | google.maps.LatLng,
    destination: string | google.maps.LatLng,
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
    waylocations: string[]
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
    settings: DialogSetting,
    sourceLatLng: string,
    destinationLatLng: string,
    editmode: boolean
}

export interface ViewCityDetails {

    positionId: number,
    cityDistanceId: number,
    sourceCity: string,
    destinationCity: string,
    sourceId: string,
    destinationId: string,
    distance: string,
    autoConfig: string,
    autoupdate: boolean,
    nextUpdateDate: Date | string,
    updateProcess: string,
    sourceLatLng:string,
    destinationLatLng: string
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

export interface VdsCityDistanceTemp {

    cityDistId: number,
    systemDistance: string,
    autoConfig: string,
    nextUpdateDate: Date | string,
    updateProcess: string,
    vdsCityGeolocations: sourDistDetails[],
    destinationActualAddress: string,
    orginActualAddress: string,
}

export interface sourDistDetails {
    latitude: string,
    longtitude: string,
    locationType: string,
    formattedAddress: string,
    country: string,
    province: string,
    locality: string,
    addrType: string,
    sourceChinese:string,
    destinationChinese:string
}

export interface GeoLocationRes {

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

export interface AutoVdsCityDetails{

    cityDistanceId: string,
    sourceId: string,
    destinationId: string,
    sourceCity: string,
    destinationCity: string,
    sourceChinese: string,
    destinationChinese: string,
    sourceLatLng: string
    destinationLatLng: string,
    isCompound: string,
    nextUpdateDate: Date | string,
    autoConfig: string,
    updateProcess: string,
    distance: string
}

