/* eslint-disable react/prop-types */

import Row from "./Row";

/** Renders a grid given status */
export default function Grid({ status }) {
    const grid = status.grid;
    const renderedGrid = grid.map((rowData, i) => {
        return <Row key={i} rowData={rowData} />;
    });

    return <div>{renderedGrid}</div>;
}
