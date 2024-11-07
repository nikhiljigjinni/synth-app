
import Param from './Param';
export default function Filter({cutoff, resonance, filterType, handleInput, handleFilterType}) {
    return (

      <div className='filter'>
        <select name="filter-type" value={filterType} onChange={handleFilterType}>
          <option value="lowpass">Lowpass</option>
          <option value="highpass">Highpass</option>
          <option value="bandpass">Bandpass</option>
        </select>

        <Param labelName="cutoff" min="20" max="3000" step="20" value={cutoff} onHandleInput={(e) => handleInput(e, "cutoff")}/>
        <Param labelName="resonance" min="0" max="20" value={resonance} onHandleInput={(e) => handleInput(e, "resonance")}/>
      </div>
    )
};
