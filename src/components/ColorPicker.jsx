import React from 'react';
import $ from 'jquery';
window.jQuery = $;
$.browser = { msie: false };
require('../vendor/farbtastic');

export default class ColorPicker extends React.Component {
  constructor(props) {
    super(props)
    this.handleRef = this.handleRef.bind(this);
    this.handleInputRef = this.handleInputRef.bind(this);
  }
  handleRef(el) {
    this.wrapper = el;
  }
  handleInputRef(el) {
    this.input = el;
  }
  componentDidMount() {
    const name = this.props.name;
    const updateColor = this.props.updateColor
    $.farbtastic(this.wrapper, {
      callback: this.input,
      width: 200,
      height: 200,
    }).setColor(this.props.value);
    $(this.input).on('change', function(event) {
      updateColor(name, event.target.value);
    });
  }
  componentWillUnmount() {
    $(this.input).off('change')
  }
  componentDidUpdate() {
    $.farbtastic(this.wrapper).setColor(this.props.value);
  }

  render() {
    let pickerClasses = ['color-picker__picker']
    if (this.props.top) { pickerClasses.push('color-picker__picker--top') }

    return (
      <div className="color-picker">
        <label className="color-picker__label">
          <span className="color-picker__label-text">{this.props.name}</span>
          <div className="color-picker__input-wrapper">
            <input type="text" className="color-picker__input" name={this.props.name} ref={this.handleInputRef} onChange={this.props.onChange} value={this.props.value} />
            <div className={pickerClasses.join(' ')} ref={this.handleRef}></div>
          </div>
        </label>
      </div>
    )
  }
}
