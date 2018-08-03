import React from 'react';

class DrawArea extends React.Component {
  constructor() {
    super();

    this.state = {
      lines: [],
      isDrawing: false
    };
    this.drawArea = React.createRef();
  }

  componentDidMount() {
    document.addEventListener("mouseup", this.handleMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleMouseUp);
  }

  handleMouseDown = (e) => {
    if (e.button != 0) {
      return;
    }

    const point = this.relativeCoordinatesForEvent(e);
    this.setState(prevState => {
      const nextState = prevState.lines.slice();
      nextState.push([point])
      return {
        lines: nextState,
        isDrawing: true
      }
    });
  }

  handleMouseMove = (e) => {
    if (!this.state.isDrawing) {
      return;
    }

    const point = this.relativeCoordinatesForEvent(e);
    this.setState(prevState =>  {
      const updatedLines = prevState.lines.slice();
      updatedLines[prevState.lines.length - 1].push(point)
      return {
        lines: updatedLines
      }
    });
  }

  handleMouseUp = (e) => {
    this.setState({ isDrawing: false });
  }

  relativeCoordinatesForEvent(e) {
    const boundingRect = this.drawArea.current.getBoundingClientRect();
    return ({
      x: e.clientX - boundingRect.left,
      y: e.clientY - boundingRect.top,
    });
  }

  clear = () => {
    this.setState({
      lines: []
    })
  }

  render() {
    return (
      <section>
        <div
          className="draw-area"
          ref={this.drawArea}
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
        >
          <Drawing lines={this.state.lines} />
        </div>
        <a onClick={this.clear}>clear</a>
      </section>
    );
  }
}

class Drawing extends React.Component  {
  constructor() {
    super();
    this.svg = React.createRef();
  }

  serialize = () => {
    const serializer = new XMLSerializer();
    this.serializedSVG = serializer.serializeToString(this.svg.current)
    console.log(this.serializedSVG);
  }


  render() {
    const { lines } = this.props
    return (
        <svg ref={this.svg} className="drawing">
          {lines.map((line, index) => (
            <DrawingLine key={index} line={line} />
          ))}
        </svg>
    );
  }
}
const DrawingLine = ({ line }) => {
  const pathData = "M " +
    line.map(p => {
        return `${p.x} ${p.y}`;
      }).join(" L ");

  return <path className="path" d={pathData} />;
}

export default DrawArea;
