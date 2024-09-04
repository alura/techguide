import { Observable } from "../../../utilities/index.js";
import type { FetchResult, Operation } from "../../../link/core/index.js";
import { ApolloLink } from "../../../link/core/index.js";
export interface MockedSubscription {
    request: Operation;
}
export interface MockedSubscriptionResult {
    result?: FetchResult;
    error?: Error;
    delay?: number;
}
export declare class MockSubscriptionLink extends ApolloLink {
    unsubscribers: any[];
    setups: any[];
    operation?: Operation;
    private observers;
    constructor();
    request(operation: Operation): Observable<FetchResult>;
    simulateResult(result: MockedSubscriptionResult, complete?: boolean): void;
    simulateComplete(): void;
    onSetup(listener: any): void;
    onUnsubscribe(listener: any): void;
}
export declare function mockObservableLink(): MockSubscriptionLink;
//# sourceMappingURL=mockSubscriptionLink.d.ts.map