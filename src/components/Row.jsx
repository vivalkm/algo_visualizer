/* eslint-disable react/prop-types */

import Tile from "./Tile";
import "../styles/row.css";

/**
 * Renders a row in a Grid
 */
export default function Row({ rowData, rowId, status, handleSelectStartPos }) {
    const renderedRow = rowData.map((tileData, i) => {
        return (
            <Tile
                key={i}
                status={status}
                tileData={tileData}
                tilePos={{ row: rowId, col: i }}
                handleSelectStartPos={handleSelectStartPos}
            />
        );
    });
    return <div className="row">{renderedRow}</div>;
}
