import {Component} from "react";
import Square from "./Square";

class Raster extends Component {
    render() {
        return(
            <div className={"raster"}>
                <div className="raster-row">
                    <Square/>
                    <Square/>
                    <Square/>
                    <Square/>
                    <Square/>
                </div>
                <div className="raster-row">
                    <Square/>
                    <Square/>
                    <Square/>
                    <Square/>
                    <Square/>
                </div>
                <div className="raster-row">
                    <Square/>
                    <Square/>
                    <Square/>
                    <Square/>
                    <Square/>
                </div>
                <div className="raster-row">
                    <Square/>
                    <Square/>
                    <Square/>
                    <Square/>
                    <Square/>
                </div>
                <div className="raster-row">
                    <Square/>
                    <Square/>
                    <Square/>
                    <Square/>
                    <Square/>
                </div>
                <div className="raster-row">
                    <Square/>
                    <Square/>
                    <Square/>
                    <Square/>
                    <Square/>
                </div>

            </div>
        )
    }
}

export default Raster