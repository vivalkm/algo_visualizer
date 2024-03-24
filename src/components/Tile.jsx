/* eslint-disable react/prop-types */
import "../styles/tile.css";

/**
 * Renders a tile in a Row
 */
export default function Tile({ tileData }) {
    return <div className={"tile c" + tileData}>{tileData}</div>;
}
