type Props = {
    wins: number;
    time: number;
    active: boolean;
}
function FirstPlayer({wins, time, active}: Props) {
    return(
        <div className={`players__first-player ${active ? 'active' : ''}`}>
            <h1>Player 1</h1>
            <p>Symbol: X</p>
            <p>Number of victories: {wins}</p>
            <p>Time: {`${Math.floor(time/60)}: ${String(time % 60).padStart(2, '0')}`}</p>
        </div>
    )
}

export default FirstPlayer