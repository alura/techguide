export class ClusterNotFound extends Error {
    constructor(name) {
        super(`Cluster '${name}' is neither a known shared cluster nor defined in your global .prismarc.`);
    }
}
