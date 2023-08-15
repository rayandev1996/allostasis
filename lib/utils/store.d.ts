export declare class Store {
    /** Type of storage we want to use: 'localStorage' or 'AsyncStorage' */
    type: any;
    storeAsync: boolean;
    /** Initialize storage with one of the supported options */
    constructor();
    /** Function to set an item storage */
    setItem(key: string, value: string): Promise<boolean>;
    /** Function to retrieve an item storage */
    getItem(key: string): Promise<any>;
    /** Function to remove an item from the local storage */
    removeItem(key: string): Promise<boolean>;
}
