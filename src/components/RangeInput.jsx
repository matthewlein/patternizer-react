import React from 'react';

const RangeInput = ({
  name,
  value,
  min,
  max,
  onRangeChange
}) => {
  return (
    <label className="controls__label">
      <span className="controls__label-text">{name}</span>
      <div className="controls__range">
        <input
          type="range"
          className="range"
          name={name}
          value={value}
          min={min}
          max={max}
          onInput={(event) => onRangeChange(event)}
          onChange={(event) => onRangeChange(event)}
        />
      </div>
      <div className="controls__range-input-wrapper">
        <input
          type="number"
          className="controls__range-input"
          name={name}
          value={value}
          min={min}
          max={max}
          onChange={(event) => onRangeChange(event)}
        />
      </div>
    </label>
  )
}

export default RangeInput;
