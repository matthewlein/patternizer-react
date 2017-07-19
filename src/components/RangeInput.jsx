import React from 'react';

export default class RangeInput extends React.Component {
  render() {
    return (
      <label className="controls__label">
        <span className="controls__label-text">{this.props.name}</span>
        <div className="controls__range">
          <input className="range" value={this.props.value} name={this.props.name} type="range" onInput={(event) => this.props.onRangeChange(event)} onChange={(event) => this.props.onRangeChange(event)} min={this.props.min} max={this.props.max} />
        </div>
        <div className="controls__range-input-wrapper">
          <input className="controls__range-input" value={this.props.value} name={this.props.name} type="number" onChange={(event) => this.props.onRangeChange(event)} min={this.props.min} max={this.props.max} />
        </div>
      </label>
    )
  }
}
