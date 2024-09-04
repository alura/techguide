function defaultDispose() { }
export class StrongCache {
    constructor(max = Infinity, dispose = defaultDispose) {
        this.max = max;
        this.dispose = dispose;
        this.map = new Map();
        this.newest = null;
        this.oldest = null;
    }
    has(key) {
        return this.map.has(key);
    }
    get(key) {
        const node = this.getNode(key);
        return node && node.value;
    }
    get size() {
        return this.map.size;
    }
    getNode(key) {
        const node = this.map.get(key);
        if (node && node !== this.newest) {
            const { older, newer } = node;
            if (newer) {
                newer.older = older;
            }
            if (older) {
                older.newer = newer;
            }
            node.older = this.newest;
            node.older.newer = node;
            node.newer = null;
            this.newest = node;
            if (node === this.oldest) {
                this.oldest = newer;
            }
        }
        return node;
    }
    set(key, value) {
        let node = this.getNode(key);
        if (node) {
            return node.value = value;
        }
        node = {
            key,
            value,
            newer: null,
            older: this.newest
        };
        if (this.newest) {
            this.newest.newer = node;
        }
        this.newest = node;
        this.oldest = this.oldest || node;
        this.map.set(key, node);
        return node.value;
    }
    clean() {
        while (this.oldest && this.map.size > this.max) {
            this.delete(this.oldest.key);
        }
    }
    delete(key) {
        const node = this.map.get(key);
        if (node) {
            if (node === this.newest) {
                this.newest = node.older;
            }
            if (node === this.oldest) {
                this.oldest = node.newer;
            }
            if (node.newer) {
                node.newer.older = node.older;
            }
            if (node.older) {
                node.older.newer = node.newer;
            }
            this.map.delete(key);
            this.dispose(node.value, key);
            return true;
        }
        return false;
    }
}
//# sourceMappingURL=strong.js.map