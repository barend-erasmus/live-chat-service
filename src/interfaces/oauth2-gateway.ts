export interface IOAuth2Gateway {
    getUserInfo(authorizationHeader: string): Promise<any>;
}
