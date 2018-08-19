export interface Property {
    degreeX: Number;
    degreeZ: Number;
    position: Number[];    // x1 y1 x2 y2
    sleep: Number;
    operating: Number;
}

export interface Service {
    motormove: (degreeX: Number, degreeZ: Number) => void
}

export interface RedisSub {
    type: string;
    from: string;
    data: any;
}

export interface MotormoveReq {
    degreeX: Number;
    degreeZ: Number;
}