export interface Options {
	/**
	 * Setting this to true will yield an array. In other words; instead of yielding once for every payload—we collect
	 * all complete payloads for a chunk and then yield.
	 *
	 * @default false
	 */
	multiple: boolean;
}

export type Part<Body, Fallback> =
	| { json: false; headers: Record<string, string>; body: Fallback }
	| { json: true; headers: Record<string, string>; body: Body };

export * from 'meros/browser';
export * from 'meros/node';
