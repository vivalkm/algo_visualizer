/* eslint-disable react/prop-types */
import "../styles/tile.css";

/**
 * Renders a tile in a Row
 */
export default function Tile({ tileData, tilePos, status, handleSelectStartPos }) {
    const handleClick = () => {
        handleSelectStartPos(tilePos.row, tilePos.col);
    };

    const style = {
        backgroundColor: `rgba(63, 81, 181, ${tileData / status.step})`,
    };

    return (
        <div className="tile" style={style} onClick={handleClick}>
            {tileData}
        </div>
    );
}
