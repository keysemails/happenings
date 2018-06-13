import React from 'react';

class DrawArea extends React.Component {
  constructor() {
    super();

    this.state = {
      isDrawing: false
    };
    this.canvas = React.createRef();
  }

  componentDidMount() {
    document.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.current.width = 100;
    this.canvas.current.height = 100;
    this.ctx = this.canvas.current.getContext("2d");
    this.ctx.translate(0.5, 0.5);
  }

  componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleMouseUp);
  }

  handleMouseDown = (e) => {
    if (e.button != 0) {
      return;
    }

    const point = this.relativeCoordinatesForEvent(e);

    this.ctx.moveTo(...point);
    this.ctx.beginPath();
    this.setState({ isDrawing: true });
  }

  handleMouseMove = (e) => {
    if (!this.state.isDrawing) {
      return;
    }

    const point = this.relativeCoordinatesForEvent(e);

    this.ctx.lineTo(...point);
    this.ctx.stroke();
  }

  handleMouseUp = (e) => {
    this.setState({ isDrawing: false });
  }

  relativeCoordinatesForEvent(e) {
    const boundingRect = this.canvas.current.getBoundingClientRect();
    return [e.clientX - boundingRect.left, e.clientY - boundingRect.top];
  }

  render() {
    return (
        <canvas
          id="canvas"
          ref={this.canvas}
          width={100}
          height={100}
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
        >
        </canvas>
    );
  }
}

export default DrawArea;
