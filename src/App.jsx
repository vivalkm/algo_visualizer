import { useEffect, useState } from "react";
import "./App.css";
import Grid from "./components/Grid";
import { copyGrid, createGrid } from "./util/helper";
import { Stack, TextField } from "@mui/material";

function App() {
    const [status, setStatus] = useState({
        // initial grid is 1x1 and start pos is [0,0]
        grid: createGrid(1, 1, 0, 0),
        q: [],
        step: 1,
        dim: { m: 1, n: 1 },

        // startPos is 0-indexed
        startPos: { r: 0, c: 0 },
    });

    useEffect(() => {
        setTimeout(() => {
            if (status.q.length > 0) {
                const offsets = [
                    [1, 0],
                    [0, 1],
                    [-1, 0],
                    [0, -1],
                ];

                let nexts = [];
                let size = status.q.length;
                if (size > 0) {
                    let newGrid = copyGrid(status.grid);
                    while (size-- > 0) {
                        let pos = status.q.shift();
                        for (let offset of offsets) {
                            let next = [pos[0] + offset[0], pos[1] + offset[1]];
                            if (
                                next[0] >= 0 &&
                                next[0] < status.dim.m &&
                                next[1] >= 0 &&
                                next[1] < status.dim.n
                            ) {
                                if (newGrid[next[0]][next[1]] == 0) {
                                    nexts.push(next);
                                    newGrid[next[0]][next[1]] = status.step + 1;
                                }
                            }
                        }
                    }
                    let newStatus = { ...status, grid: newGrid, q: nexts, step: status.step + 1 };
                    setStatus(newStatus);
                }
            }
        }, 300);
    }, [status]);

    /**
     * Start visualizer
     */
    const handleStart = () => {
        // push start pos to q to trigger simulation
        setStatus({ ...status, q: [[status.startPos.r, status.startPos.c]] });
    };

    /**
     * Change dim of grid given input value
     */
    const handleDimChange = (event) => {
        if (event.target.value > 0) {
            let newDim = { ...status.dim, [event.target.name]: event.target.value };
            setStatus({
                ...status,
                dim: newDim,
                grid: createGrid(newDim.m, newDim.n, status.startPos.r, status.startPos.c),
            });
        }
    };

    /**
     * Change start position on grid given input value
     */
    const handleStartPosChange = (event) => {
        if (event.target.value > 0) {
            let newStartPos = { ...status.startPos, [event.target.name]: event.target.value - 1 };
            setStatus({
                ...status,
                startPos: newStartPos,
                grid: createGrid(status.dim.m, status.dim.n, newStartPos.r, newStartPos.c),
            });
        }
    };

    /**
     * Reset grid and start pos to default
     */
    const handleReset = () => {
        setStatus({
            grid: createGrid(1, 1, 0, 0),
            q: [],
            step: 1,
            dim: { m: 1, n: 1 },
            startPos: { r: 0, c: 0 },
        });
    };

    return (
        <>
            <Stack className="inputArea" direction="row" spacing={1}>
                <TextField
                    type="number"
                    variant="standard"
                    label="Rows"
                    name="m"
                    InputProps={{ inputProps: { min: 1, max: 20 } }}
                    value={status.dim.m}
                    onChange={handleDimChange}
                />
                <TextField
                    type="number"
                    variant="standard"
                    label="Columns"
                    name="n"
                    InputProps={{ inputProps: { min: 1, max: 20 } }}
                    value={status.dim.n}
                    onChange={handleDimChange}
                />
            </Stack>

            <Stack className="inputArea" direction="row" spacing={1}>
                <TextField
                    type="number"
                    variant="standard"
                    label="Start Row"
                    name="r"
                    InputProps={{ inputProps: { min: 1, max: status.dim.m } }}
                    value={status.startPos.r + 1}
                    onChange={handleStartPosChange}
                />
                <TextField
                    type="number"
                    variant="standard"
                    label="Start Column"
                    name="c"
                    InputProps={{ inputProps: { min: 1, max: status.dim.n } }}
                    value={status.startPos.c + 1}
                    onChange={handleStartPosChange}
                />
                <button onClick={handleStart}>Start</button>
                <button onClick={handleReset}>Reset</button>
            </Stack>

            <Grid status={status} />
        </>
    );
}

export default App;
