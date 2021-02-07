class GraphBuilder {

    constructor(grid) {

        this._gridBackup = grid;
        this._reloadGridFromBackup();

    }

    build() {

        const graph = {};

        this._findNodes()
        .forEach(node => {

            const [key, x, y] = node;

            graph[key] = this._findAdjacentNodes(x, y);
            this._reloadGridFromBackup();

        });

        return graph;

    }

    _findNodes() {

        const nodes = [];

        this.grid.forEach((row, rowInd) => {

            row.forEach((v, colInd) => {

                if (['.', '#'].includes(v)) {
                    return false;
                }

                nodes.push([v, rowInd, colInd]);

            })

        });

        return nodes;

    }

    _findAdjacentNodes(startX, startY) {

        const pending = [[startX, startY, 0]];
        const result  = {};
        let depth = 0;

        while(pending.length > 0) {

            let [x, y, depth] = pending.shift();
            const cell = this.grid[x] && this.grid[x][y];

            if (!cell || cell === '#' || cell === '$') {
                continue;
            }

            this.grid[x][y] = '$';
            if (cell != '.' && depth > 0) {
                result[cell] = depth;
                continue;
            }

            depth++;
            pending.push([x-1, y, depth]);
            pending.push([x+1, y, depth]);
            pending.push([x, y-1, depth]);
            pending.push([x, y+1, depth]);

        }

        return result;

    }


    _reloadGridFromBackup() {

        this.grid = this._gridBackup.map(row => [...row]);

    }
   
}

module.exports = GraphBuilder;