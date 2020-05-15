import React, { Component } from "react";
import ModeButton from "./modeButton";
import ModeInfo from "./modeInfo";

class SelectMode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLabel: "Easy"
    };
    this.labels = ["Easy", "Medium", "Hard", "Expert"];
    this.info = {
      Easy: "Click to start with easy mode. Around 40 cells are pre-filled",
      Medium: "Click to start with medium mode. Around 30 cells are pre-filled",
      Hard: "Click to start with hard mode. Around 25 cells are pre-filled",
      Expert: "Click to start with expert mode. Around 22 cells are pre-filled"
    };
  }

  handleMouseEnter = label => {
    this.setState({
      selectedLabel: label
    });
  };

  render() {
    const labelsLength = this.labels.length;
    const selectedLabel = this.state.selectedLabel;
    const selectInfo = this.info[selectedLabel];
    return (
      <div className="mode-form">
        <h1>Select Difficulty</h1>
        <div class="btn-group">
          {this.labels.map((label, index) => {
            let ends = "";
            if (index === 0) ends = "first-button";
            if (index === labelsLength - 1) ends = "last-button";
            if (label === selectedLabel) ends += " button-active";
            return (
              <ModeButton
                key={label}
                label={label}
                ends={ends}
                onMouseEnter={this.handleMouseEnter}
              />
            );
          })}
        </div>
        <ModeInfo label={selectedLabel} info={selectInfo} />
      </div>
    );
  }
}

export default SelectMode;
