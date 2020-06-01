import React, { Component } from "react";
import emitter from "../service/emitter";
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
    const startTime = Math.floor(this.props.startTime / 1000) + 1;
    const sec = startTime % 60;
    const min = Math.floor(startTime / 60);
    this.setState({
      min,
      sec
    });
    this.timeIncrementIntervalTicket = setInterval(() => {
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
    emitter.on("Game Ended", () => {
      clearInterval(this.timeIncrementIntervalTicket);
      emitter.off("Game Ended");
    });
  }

  render() {
    const { min, sec } = this.state;
    const minute = min.toString().padStart(2, "0");
    const second = sec.toString().padStart(2, "0");
    const { ended } = this.props;
    if (ended) {
      return <p>&nbsp;</p>;
    }
    return (
      <p>
        <img className="timer" src={Clock} alt="timer" />
        <span className="time">
          &nbsp;&nbsp;{minute}&nbsp;:&nbsp;{second}
        </span>
      </p>
    );
  }
}

export default Timer;
