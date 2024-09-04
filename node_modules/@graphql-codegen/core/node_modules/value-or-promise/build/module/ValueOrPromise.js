function isPromiseLike(object) {
    return (object != null && typeof object.then === 'function');
}
const defaultOnRejectedFn = (reason) => {
    throw reason;
};
export class ValueOrPromise {
    constructor(executor) {
        let value;
        try {
            value = executor();
        }
        catch (reason) {
            this.state = { status: 'rejected', value: reason };
            return;
        }
        if (isPromiseLike(value)) {
            this.state = { status: 'pending', value };
            return;
        }
        this.state = { status: 'fulfilled', value };
    }
    then(onFulfilled, onRejected) {
        const state = this.state;
        if (state.status === 'pending') {
            return new ValueOrPromise(() => state.value.then(onFulfilled, onRejected));
        }
        const onRejectedFn = typeof onRejected === 'function' ? onRejected : defaultOnRejectedFn;
        if (state.status === 'rejected') {
            return new ValueOrPromise(() => onRejectedFn(state.value));
        }
        try {
            const onFulfilledFn = typeof onFulfilled === 'function' ? onFulfilled : undefined;
            return onFulfilledFn === undefined
                ? new ValueOrPromise(() => state.value)
                : new ValueOrPromise(() => onFulfilledFn(state.value));
        }
        catch (e) {
            return new ValueOrPromise(() => onRejectedFn(e));
        }
    }
    catch(onRejected) {
        return this.then(undefined, onRejected);
    }
    resolve() {
        const state = this.state;
        if (state.status === 'pending') {
            return Promise.resolve(state.value);
        }
        if (state.status === 'rejected') {
            throw state.value;
        }
        return state.value;
    }
    static all(valueOrPromises) {
        let containsPromise = false;
        const values = [];
        for (const valueOrPromise of valueOrPromises) {
            const state = valueOrPromise.state;
            if (state.status === 'rejected') {
                return new ValueOrPromise(() => {
                    throw state.value;
                });
            }
            if (state.status === 'pending') {
                containsPromise = true;
            }
            values.push(state.value);
        }
        if (containsPromise) {
            return new ValueOrPromise(() => Promise.all(values));
        }
        return new ValueOrPromise(() => values);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmFsdWVPclByb21pc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvVmFsdWVPclByb21pc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsU0FBUyxhQUFhLENBQUksTUFBZTtJQUN2QyxPQUFPLENBQ0wsTUFBTSxJQUFJLElBQUksSUFBSSxPQUFRLE1BQXlCLENBQUMsSUFBSSxLQUFLLFVBQVUsQ0FDeEUsQ0FBQztBQUNKLENBQUM7QUFtQkQsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLE1BQWUsRUFBRSxFQUFFO0lBQzlDLE1BQU0sTUFBTSxDQUFDO0FBQ2YsQ0FBQyxDQUFDO0FBRUYsTUFBTSxPQUFPLGNBQWM7SUFHekIsWUFBWSxRQUFrQztRQUM1QyxJQUFJLEtBQXlCLENBQUM7UUFFOUIsSUFBSTtZQUNGLEtBQUssR0FBRyxRQUFRLEVBQUUsQ0FBQztTQUNwQjtRQUFDLE9BQU8sTUFBTSxFQUFFO1lBQ2YsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDO1lBQ25ELE9BQU87U0FDUjtRQUVELElBQUksYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3hCLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxDQUFDO1lBQzFDLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxDQUFDO0lBQzlDLENBQUM7SUFFTSxJQUFJLENBQ1QsV0FHUSxFQUNSLFVBR1E7UUFFUixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBRXpCLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7WUFDOUIsT0FBTyxJQUFJLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FDN0IsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJ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