import React from 'react';

export default class RotationInput extends React.Component {
  constructor(props) {
    super(props)
    this.handleCanvasRef = this.handleCanvasRef.bind(this);
  }
  handleCanvasRef(el) {
    this.rotator = el;
    this.ctx = el.getContext('2d');
    this.rCenter = this.rotator.width / 2;
    this.rCtx = this.rotator.getContext('2d');
  }
  componentDidMount() {
    this.rCtx.translate(this.rCenter, this.rCenter);
    this.setRotation(this.props.value);
    this.rotator.addEventListener('mousedown', this.onPress.bind(this), false);
  }
  componentWillUnmount() {
    this.rotator.removeEventListener('mousedown', this.onPress, false);
    document.removeEventListener('mousemove', this.dragRotation, false);
    // I think this is not working
    document.removeEventListener('mouseup', this.onRelease, false);
  }
  componentDidUpdate() {
    this.setRotation(this.props.value);
  }
  deg_rad(deg) {
    return Math.PI / 180 * deg;
  }
  rad_deg(rad) {
    return rad * (180 / Math.PI);
  }
  onPress(event) {
    event.preventDefault();
    const dragRotation = this.dragRotation.bind(this)
    document.addEventListener('mousemove', dragRotation, false);
    document.addEventListener('mouseup', this.onRelease.bind(this, dragRotation), false);
    this.dragRotation(event);
  }
  dragRotation(event) {
    const degrees = this.getRotationDegrees(event);
    this.props.updateRotation(degrees);
  }
  onRelease(fn) {
    document.removeEventListener('mousemove', fn, false);
  }
  getRotationDegrees(event) {
    const coords = this.getNormalizedCoordinates(event);
    const x = coords.x;
    const y = coords.y;
    let degrees = Math.round(this.rad_deg(Math.atan(y / x)));

    if ((x >= 0 && y <= 0) || (x >= 0 && y >= 0)) {
      // top right
      degrees += 90;
    } else {
      // bottom left
      degrees += 270;
    }
    return degrees;
  }
  getNormalizedCoordinates(event) {
    const rotatorRect = this.rotator.getBoundingClientRect();
    const rotatorOffset = {
      top: rotatorRect.top + document.body.scrollTop,
      left: rotatorRect.left + document.body.scrollLeft
    }
    let x = event.pageX - (rotatorRect.left + this.rCenter);
    let y = event.pageY - (rotatorRect.top + this.rCenter);
    const hyp = Math.sqrt((x * x) + (y * y));
    const mult = this.rCenter / hyp;

    // normalize to circle size
    x = Math.round(x * mult);
    y = Math.round(y * mult);
    return {
      x,
      y,
    };
  }
  setRotation(angle) {
    const hyp = this.rCenter;
    const degrees = angle || 0;
    const rads = this.deg_rad(degrees);
    const adj = -Math.round(hyp * Math.cos(rads));
    const opp = Math.round(hyp * Math.sin(rads));

    this.drawShapes(opp, adj);
  }
  drawShapes(x, y) {
    this.rCtx.clearRect(-this.rCenter, -this.rCenter, this.rotator.width, this.rotator.height);
    // angle line
    this.rCtx.strokeStyle = '#666';
    this.rCtx.lineWidth = 3;
    this.rCtx.beginPath();
    this.rCtx.moveTo(0, 0);
    this.rCtx.lineTo(x, y);
    this.rCtx.closePath();
    this.rCtx.stroke();
  }
  render() {
    return (
      <label className="rotation__label">
        Rotationº
        <canvas id='rotator' width='49' height='49' className='rotation__canvas rotator' ref={this.handleCanvasRef}></canvas>
        <div className="rotation__input-wrapper">
          <input className="rotation__input" type='number' value={this.props.value} onChange={(e) => this.props.onRotationChange(e)}/>
        </div>
      </label>
    )
  }
}
