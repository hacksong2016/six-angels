import React from 'react';
import ReactDOM from 'react-dom';
import { StaggeredMotion, spring } from 'react-motion';
import range from 'lodash.range';
import presets from './presets';

const Demo = React.createClass({
  getInitialState() {
    return {x: 250, y: 300, starX: 50, starY: 50, point: 0, time: 0};
  },

  componentDidMount() {
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('touchmove', this.handleTouchMove);

    const clientWidth = document.body.scrollWidth;
    const clientHeight = document.body.scrollHeight;

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    letsChange = () => {
      const starX = getRandomInt(25, clientWidth-100);
      const starY = getRandomInt(25, clientHeight-100);

      this.setState({starX, starY, time: this.state.time + 1});
    }

    Meteor.setInterval(letsChange, 800);
  },

  handleMouseMove({pageX: x, pageY: y}) {
    this.setState({x, y});
    const { starX, starY } = this.state;
    if (starX < x && x < starX + 50 && starY < y && y < starY + 50) {
      if (this.state.time % 5) {
        letsChange()
        this.setState({point: this.state.point + 1});
      } else {
        swal({
          title: `因为你的努力，孙总将有机会向森林天使公益组织捐赠${this.state.point}元！`,
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "必须捐！",
          cancelButtonText: "算了，心疼南哥",
          closeOnConfirm: false,
          closeOnCancel: false
        }, (isConfirm) => {
          if (isConfirm) {
            swal({title: "逼捐成功!", text: "<img src='/boss.jpg' width='200' >", type: "success", html: true});
          } else {
            swal("我替南哥谢谢您~", "", "success");
          }
          this.setState({point: 0})
        });
      }
    }
  },

  handleTouchMove({touches}) {
    this.handleMouseMove(touches[0]);
  },

  getStyles(prevStyles) {
    // `prevStyles` is the interpolated value of the last tick
    const endValue = prevStyles.map((_, i) => {
      return i === 0
        ? this.state
        : {
            x: spring(prevStyles[i - 1].x, presets.gentle),
            y: spring(prevStyles[i - 1].y, presets.gentle),
          };
    });
    return endValue;
  },

  render() {
    // thank you react-motion & chenglou
    // https://github.com/chenglou/react-motion/tree/master/demos/demo1-chat-heads
    return (
      <div>
        <StaggeredMotion
          defaultStyles={range(6).map(() => ({x: 0, y: 0}))}
          styles={this.getStyles}>
          {balls =>
            <div className="demo1">
              {balls.map(({x, y}, i) =>
                <div
                  key={i}
                  className={`demo1-ball ball-${i}`}
                  style={{
                    WebkitTransform: `translate3d(${x - 25}px, ${y - 25}px, 0)`,
                    transform: `translate3d(${x - 25}px, ${y - 25}px, 0)`,
                    zIndex: balls.length - i,
                  }} />
              )}
            </div>
          }
        </StaggeredMotion>

        {this.state.time % 5 ? <Star x={this.state.starX} y={this.state.starY} /> : <Boss x={this.state.starX} y={this.state.starY} />}

        <Point point={this.state.point} />
      </div>
    );
  },
});

function Star({ x, y }) {
  const style = {
    left: x,
    top: y,
    border: '3px solid green',
    position: 'absolute',
    width: '50px',
    height: '50px',
    backgroundImage: 'url("/forest-angel.jpg")',
    backgroundSize: '50px',
    borderRadius: '99px',
    transition: '0.1s ease-in-out'
  }

  return <div style={style} />
}

function Boss({ x, y }) {
  const style = {
    left: x,
    top: y,
    border: '3px solid red',
    position: 'absolute',
    width: '50px',
    height: '50px',
    backgroundImage: 'url("/boss-alert.jpg")',
    backgroundSize: '50px',
    borderRadius: '99px',
    transition: '0.1s ease-in-out'
  }

  return <div style={style} />
}

function Point({ point }) {
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;
  const flex = {
    width,
    height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
  const number = {
    fontSize: '100px',
    color: 'white',
    zIndex: '0'
  }

  return (
    <div style={flex}>
      <div style={number}>{point.toString()}</div>
    </div>
  )
}

Meteor.startup(() => {
  ReactDOM.render(<Demo />, document.getElementById('content'));
});
