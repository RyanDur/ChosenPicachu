export enum HTTPMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

export enum HTTPStatus {
    LOADING = 'LOADING',
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE'
}

export enum HTTPError {
    FORBIDDEN = 'FORBIDDEN',
    UNKNOWN = 'UNKNOWN',
    MALFORMED_RESPONSE = 'MALFORMED_RESPONSE',
    THROWN = 'THROWN'
}