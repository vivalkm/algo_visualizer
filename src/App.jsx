import { useEffect, useState } from "react";
import "./App.css";
import Grid from "./components/Grid";
import { copyGrid, createGrid } from "./util/helper";
import { Button, Container, Stack, TextField } from "@mui/material";

const DIM_LIMIT = 20;

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
            } else if (status.step > 1) {
                // reset step after simulation is done
                setStatus({
                    ...status,
                    step: 1,
                });
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
        let value = Math.round(event.target.value);
        if (value > 0 && value <= DIM_LIMIT) {
            let newDim = { ...status.dim, [event.target.name]: value };
            setStatus({
                ...status,
                dim: newDim,
                grid: createGrid(newDim.m, newDim.n, status.startPos.r, status.startPos.c),
            });
        } else {
            window.alert("Please enter 1 - 20.");
        }
    };

    /**
     * Change start position on grid given input value
     */
    const handleStartPosChange = (event) => {
        let value = Math.round(event.target.value);
        if (value > 0) {
            let newStartPos = { ...status.startPos, [event.target.name]: value - 1 };
            if (newStartPos.r >= status.dim.m || newStartPos.c >= status.dim.n) {
                window.alert("Start position must be within the grid.");
            } else {
                setStatus({
                    ...status,
                    startPos: newStartPos,
                    grid: createGrid(status.dim.m, status.dim.n, newStartPos.r, newStartPos.c),
                });
            }
        }
    };

    const handleSelectStartPos = (r, c) => {
        let newStartPos = { r, c };
        
        if (newStartPos.r >= status.dim.m || newStartPos.c >= status.dim.n) {
            window.alert("Start position must be within the grid.");
        } else {
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
            <Container maxWidth="sm">
                <Stack className="inputArea" direction="row" spacing={2}>
                    <TextField
                        fullWidth
                        type="number"
                        variant="standard"
                        label="Rows"
                        name="m"
                        InputProps={{ inputProps: { min: 1, max: 20 } }}
                        value={status.dim.m}
                        onChange={handleDimChange}
                    />
                    <TextField
                        fullWidth
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
                        fullWidth
                        type="number"
                        variant="standard"
                        label="Start Row"
                        name="r"
                        InputProps={{ inputProps: { min: 1, max: status.dim.m } }}
                        value={status.startPos.r + 1}
                        onChange={handleStartPosChange}
                    />
                    <TextField
                        fullWidth
                        type="number"
                        variant="standard"
                        label="Start Column"
                        name="c"
                        InputProps={{ inputProps: { min: 1, max: status.dim.n } }}
                        value={status.startPos.c + 1}
                        onChange={handleStartPosChange}
                    />
                </Stack>
                <Stack className="inputArea buttons" direction="row" spacing={1}>
                    <Button fullWidth variant="outlined" onClick={handleStart}>
                        Start
                    </Button>
                    <Button fullWidth variant="outlined" onClick={handleReset}>
                        Reset
                    </Button>
                </Stack>
            </Container>
            <Container maxWidth="sm">
                <div className="grid">
                    <Grid status={status} handleSelectStartPos={handleSelectStartPos} />
                </div>
            </Container>
        </>
    );
}

export default App;
