/* eslint-disable react/prop-types */

import Row from "./Row";

/** Renders a grid based on status */
export default function Grid({ status, handleSelectStartPos }) {
    const grid = status.grid;
    const renderedGrid = grid.map((rowData, i) => {
        return (
            <Row
                key={i}
                rowData={rowData}
                status={status}
                rowId={i}
                handleSelectStartPos={handleSelectStartPos}
            />
        );
    });

    return <div>{renderedGrid}</div>;
}
