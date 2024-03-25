/**
 *
 * @param {Array} grid A 2D array to copy from
 * @returns {Array} A new array that copied from grid
 */
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

/**
 *
 * @param {number} m Number of rows of grid
 * @param {number} n Number of columns of grid
 * @param {number} r Row of the starting position
 * @param {number} c Column of the starting position
 * @returns {Array} A new grid of size m * n filled with 0, and grid[r][c] is set to 1
 */
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
