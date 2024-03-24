/* eslint-disable react/prop-types */
import "../styles/tile.css";

export default function Tile({ tileData }) {
    return <div className={"tile c" + tileData}>{tileData}</div>;
}
