export default function Keyboard({keyMap, onNoteDown, onNoteUp}) {

    return (
        <>
            {Object.keys(keyMap).map(key => <button name={key} onMouseDown={onNoteDown} onMouseUp={onNoteUp} onMouseLeave={onNoteUp}>{key}</button>)}
        </>
    )
}