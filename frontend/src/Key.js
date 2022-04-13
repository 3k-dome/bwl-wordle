import React, {Component} from "react";

class Key extends Component {
    render() {
        return (
            <div className={"key"}>{this.props.letter}</div>
        );
    }
}

export default Key