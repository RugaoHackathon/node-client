export interface Property {
    degreeX: Number;
    degreeZ: Number;
    faceImg: string;
    position: Number[];    // x1 y1 x2 y2
}

export interface Service {
    motormove: (degreeX: Number, degreeZ: Number) => void
}
