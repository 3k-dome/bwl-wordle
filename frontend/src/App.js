import {Component} from "react";
import Raster from "./Raster";
import Keyboard from "./Keyboard";
import Header from "./Header";

class App extends Component {
    render() {
        return (
            <>
                <Header/>
                <Raster/>
                <Keyboard/>
                </>

        );
    }
}

export default App;
