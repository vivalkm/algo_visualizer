/* eslint-disable react/prop-types */
import "../styles/tile.css";

/**
 * Renders a tile in a Row
 */
export default function Tile({ tileData, tilePos, handleSelectStartPos }) {
    const handleClick = () => {
        handleSelectStartPos(tilePos.row, tilePos.col);
    };
    return (
        <div className={"tile c" + tileData} onClick={handleClick}>
            {tileData}
        </div>
    );
}
