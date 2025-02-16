export declare class MoviesService {
    private updates;
    getUpdates(): import("rxjs").Observable<any>;
    notifyUpdate(queryType: string, queryText: string, querySenderID: number): void;
}
