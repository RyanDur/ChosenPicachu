export interface RIJKArtObject {
    id: string;
    objectNumber: string;
    title: string;
    principalOrFirstMaker: string;
    longTitle: string;
    webImage: RIJKImageResponse;
}

export interface RIJKArtObjectResponse {
    artObject: RIJKArtObject;
}

export interface RIJKImageResponse {
    url: string;
}

export interface RIJKAllArtResponse {
    count: number;
    artObjects: RIJKArtObject[]
}

export interface RIJKAllPieceResponse {
    artObject: RIJKArtObject;
}