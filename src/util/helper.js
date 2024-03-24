export function copyGrid(grid) {
    let newGrid = [];

    for (let i = 0; i < grid.length; i++) {
        let row = [];
        for (let j = 0; j < grid[i].length; j++) {
            row.push(grid[i][j]);
        }
        newGrid.push(row);
    }
    return newGrid;
}

export function createGrid(m, n, r, c) {
    let grid = [];
    for (let i = 0; i < m; i++) {
        let row = [];
        for (let j = 0; j < n; j++) {
            row.push(0);
        }
        grid.push(row);
    }
    grid[r][c] = 1;
    return grid;
}
