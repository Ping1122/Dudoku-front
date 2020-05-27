import React, { Component } from "react";
import Clock from "../timer.png";

class Timer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      min: 0,
      sec: 0
    };
  }

  componentDidMount() {
    const startTime = Math.floor(this.props.startTime / 1000);
    const sec = startTime % 60;
    const min = Math.floor(startTime / 60);
    this.setState({
      min,
      sec
    });
    setInterval(() => {
      let { min, sec } = this.state;
      sec += 1;
      if (sec === 60) {
        min += 1;
        sec = 0;
      }
      this.setState({
        min,
        sec
      });
    }, 1000);
  }

  render() {
    const { min, sec } = this.state;
    const minute = min.toString().padStart(2, "0");
    const second = sec.toString().padStart(2, "0");
    return (
      <p>
        <img className="timer" src={Clock} alt="timer" />
        <span className="time">
          &nbsp;{minute}&nbsp;:&nbsp;{second}
        </span>
      </p>
    );
  }
}

export default Timer;
