import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      imgList: [],
      numImgs: 20,
      search: ""
    };
    this.handleNumSubmit = this.handleNumSubmit.bind(this);
    this.handleNumChange = this.handleNumChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  componentDidMount() {
    fetch('/imgnum/' + this.state.numImgs)
      .then(res => res.json())
      .then(imgs => this.setState({imgList:imgs}));
  }

  handleNumSubmit(event) {
    fetch('/imgnum/' + this.state.numImgs)
      .then(res => res.json())
      .then(imgs => this.setState({imgList:imgs}));
    event.preventDefault();
  }

  handleNumChange(event) {
    this.setState({numImgs:event.target.value});
  }

  handleSearchChange(event) {
    this.setState({search:event.target.value});
  }

  handleSearchSubmit(event) {
    fetch('/imgsearch/' + this.state.search + '/' + this.state.numImgs)
    .then(res => res.json())
    .then(imgs => this.setState({imgList:imgs}));
    event.preventDefault();
  }

  render() {
    var imgJSX = [];
    if (this.state.imgList.length < 1) {
      imgJSX.push(<p></p>);
    }
    else {
      var path;
      for (var i = 0; i < this.state.imgList.length; i++) {
        path = "https://www.imgur.com/" + this.state.imgList[i].pathName + ".jpg";
        imgJSX.push(<img src={path} height="200" width="200" />);
      }
    }
    return (
      <div className="App">
        <h1 className="App-title">Rando-Imgur</h1>
        <form className="num-form" onSubmit={this.handleNumSubmit}>
          <label>
            # of imgs:
            <input type="text" value={this.state.numImgs} onChange={this.handleNumChange}/>
          </label>
          <input type="Submit" value="Submit" />
        </form>
        <form className="search-form" onSubmit={this.handleSearchSubmit}>
          <label>
            img search:
            <input type="text" value={this.state.search} onChange={this.handleSearchChange}/>
          </label>
          <input type="Submit" value="Submit" />
        </form>
        {imgJSX}
      </div>
    );
  }
}

export default App;
