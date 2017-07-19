import React from 'react';
import '../vendor/patternizer.js';

export default class PatternizerPreview extends React.Component {
  constructor(props) {
    super(props)
    this.handleCanvasRef = this.handleCanvasRef.bind(this);
    this.handleWrapperRef = this.handleWrapperRef.bind(this);
  }
  handleCanvasRef(el) {
    this.canvas = el;
    this.ctx = el.getContext('2d');
  }
  handleWrapperRef(el) {
    this.wrapper = el;
  }
  componentDidMount() {
    this.renderPattern();
    this.onResize();
    window.addEventListener('resize', this.onResize.bind(this));
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize.bind(this));
  }
  componentDidUpdate() {
    this.renderPattern();
  }
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  renderPattern() {
    this.clearCanvas();
    this.canvas.patternizer(this.props.patternData);
  }
  onResize() {
    this.canvas.width = this.wrapper.offsetWidth;
    this.canvas.height = this.wrapper.offsetHeight;
    this.renderPattern();
  }
  render() {
    return (
      <section className="preview" ref={this.handleWrapperRef}>
        <canvas className="preview__canvas" ref={this.handleCanvasRef}></canvas>
      </section>
    )
  }
}
