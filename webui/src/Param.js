export default function Param({labelName, min, max, step, value, onHandleInput}) {
    
    return (
        <>
            <label htmlFor={labelName}>{labelName}</label>
            <input type="range" name={labelName} min={min} max={max} value={value} step={step} onInput={onHandleInput}></input>
        </>
        
    )
}