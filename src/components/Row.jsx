/* eslint-disable react/prop-types */

import Tile from "./Tile";
import "../styles/row.css";

export default function Row({ rowData }) {
    const renderedRow = rowData.map((tileData, i) => {
        return <Tile key={i} tileData={tileData} />;
    });
    return <div className="row">{renderedRow}</div>;
}
