type Props = {
    squares: (string | null)[];
    onClick: (index: number) => void;
    gridSize: number;
}
function Field({squares, onClick, gridSize}: Props){
   return (
        <div className="field__wrapper"
        style={{display: 'grid',
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gap: '30px',}}
        >
            {squares.map((val, index) => (
                <div
                key={index}
                className="field__square"
                onClick={()=> onClick(index)}
                style={{
                    width: '100px',
                    height: '100px',
                    fontSize: '80px'
                }}>
                    <p className={val === 'X' ? 'first' : 'second'}>{val}</p>
                </div>
            ))}
        </div>
    )
}

export default Field