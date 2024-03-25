import { useEffect, useState } from "react";
import "./App.css";
import Grid from "./components/Grid";
import { copyGrid, createGrid } from "./util/helper";
import {
    Button,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
} from "@mui/material";

const DIM_LIMIT = 20;
const DEFAULT_DIM = { m: 5, n: 5 };
// startPos is 0-indexed
const DEFAULT_START_POS = { r: 0, c: 0 };
const INIT_STEP = 1;
const PAUSE_BETWEEN_STEP = 300;
const PAUSE_BETWEEN_SKIP = 0;
const OFFSETS = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
];

function App() {
    const [status, setStatus] = useState({
        // initial grid is 10x10 and start pos is [0,0]
        grid: createGrid(DEFAULT_DIM.m, DEFAULT_DIM.n, DEFAULT_START_POS.r, DEFAULT_START_POS.c),
        frontier: [],
        step: INIT_STEP,
        dim: DEFAULT_DIM,
        startPos: DEFAULT_START_POS,
        algo: "bfs",
    });

    useEffect(() => {
        const isValidPos = (pos) => {
            return pos[0] >= 0 && pos[0] < status.dim.m && pos[1] >= 0 && pos[1] < status.dim.n;
        };

        const getNextPos = (pos, offset) => {
            return [pos[0] + offset[0], pos[1] + offset[1]];
        };

        if (status.frontier.length > 0) {
            if (status.algo === "bfs") {
                let nexts = [];
                let size = status.frontier.length;
                if (size > 0) {
                    let newGrid = copyGrid(status.grid);
                    while (size-- > 0) {
                        let pos = status.frontier.shift();
                        for (let offset of OFFSETS) {
                            let next = getNextPos(pos, offset);
                            if (isValidPos(next)) {
                                if (newGrid[next[0]][next[1]] == 0) {
                                    nexts.push(next);
                                    newGrid[next[0]][next[1]] = status.step + 1;
                                }
                            }
                        }
                    }
                    if (nexts.length > 0) {
                        let newStatus = {
                            ...status,
                            grid: newGrid,
                            frontier: nexts,
                            step: status.step + 1,
                        };
                        setTimeout(() => {
                            setStatus(newStatus);
                        }, PAUSE_BETWEEN_STEP);
                    }
                }
            } else if (status.algo === "dfs") {
                let nexts = [];
                let size = status.frontier.length;
                if (size > 0) {
                    let newGrid = copyGrid(status.grid);
                    let pos = status.frontier[status.frontier.length - 1];
                    for (let offset of OFFSETS) {
                        let next = getNextPos(pos, offset);
                        if (isValidPos(next)) {
                            if (newGrid[next[0]][next[1]] == 0) {
                                nexts.push(next);
                                newGrid[next[0]][next[1]] = status.step + 1;
                                break;
                            }
                        }
                    }
                    let newStatus = {
                        ...status,
                        grid: newGrid,
                    };
                    if (nexts.length === 0) {
                        // nothing to visit from current node, pop the node from stack and
                        // skip to next iteration immediately
                        newStatus = {
                            ...newStatus,
                            frontier: status.frontier.slice(0, -1),
                        };
                        setTimeout(() => {
                            setStatus(newStatus);
                        }, PAUSE_BETWEEN_SKIP);
                    } else {
                        newStatus = {
                            ...newStatus,
                            frontier: [...status.frontier, ...nexts],
                            step: status.step + 1,
                        };
                        setTimeout(() => {
                            setStatus(newStatus);
                        }, PAUSE_BETWEEN_STEP);
                    }
                }
            }
        }
    }, [status]);

    /**
     * Start visualizer
     */
    const handleStart = () => {
        // push start pos to frontier queue to trigger simulation
        setStatus({
            ...status,
            frontier: [[status.startPos.r, status.startPos.c]],
            step: INIT_STEP,
        });
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
            window.alert(`Please enter a number between 1 - ${DIM_LIMIT}.`);
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

    /**
     * Change algorithm for simulation
     */
    const handleAlgoChange = (event) => {
        setStatus({
            ...status,
            algo: event.target.value,
        });
    };

    /**
     * Set the starting position based on the given position [r, c]
     * @param {number} r row of the starting position
     * @param {number} c colume of the starting position
     */
    const handleSelectStartPos = (r, c) => {
        let newStartPos = { r, c };
        if (newStartPos.r >= status.dim.m || newStartPos.c >= status.dim.n) {
            window.alert("Start position must be within the grid.");
        } else {
            setStatus({
                ...status,
                startPos: newStartPos,
                grid: createGrid(status.dim.m, status.dim.n, newStartPos.r, newStartPos.c),
                step: 1,
            });
        }
    };

    /**
     * Reset grid and start pos to default
     */
    const handleReset = () => {
        setStatus({
            grid: createGrid(
                DEFAULT_DIM.m,
                DEFAULT_DIM.n,
                DEFAULT_START_POS.r,
                DEFAULT_START_POS.c
            ),
            frontier: [],
            step: INIT_STEP,
            dim: DEFAULT_DIM,
            startPos: DEFAULT_START_POS,
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
                <Stack className="inputArea" direction="row" spacing={1}>
                    <FormControl fullWidth>
                        <InputLabel id="algo-select-label">Algorithm</InputLabel>
                        <Select
                            labelId="algo-select-label"
                            id="algo-select"
                            value={status.algo}
                            label="Algorithm"
                            onChange={handleAlgoChange}
                        >
                            <MenuItem value={"bfs"}>BFS</MenuItem>
                            <MenuItem value={"dfs"}>DFS</MenuItem>
                        </Select>
                    </FormControl>
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
