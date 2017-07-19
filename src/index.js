import React from 'react';
import ReactDOM from 'react-dom';
import uniqueId from 'lodash/uniqueId';
import Sortable from 'react-sortablejs';
import './css/index.css';

class Header extends React.Component {
  render() {
    return (
      <header className="site-header">
        <h1 className="logo">
          <img className="logo-svg" src="./images/logo.svg" alt="logo"/>
          Patternizer
        </h1>
        <nav className="site-nav">
          <ul className="site-nav__list">
            <li className="site-nav__item">
              <a className="button button--left" href="/">New Pattern</a>
            </li>
            <li className="site-nav__item">
              <a className="button button--right"href="/">Duplicate</a>
            </li>
            <li className="site-nav__item">
              <a className="button" href="/">Save</a>
            </li>
            <li className="site-nav__item">
              <a className="button" href="/">Code</a>
            </li>
            <li className="site-nav__item dropdown" id="account">
              <a className="button" href="/">Login</a>
              <div className="menu">
                <ul>
                  <li><a href="/">My Patterns</a></li>
                  <li><a href="/">My Account</a></li>
                  <li><a href="/">Log Out</a></li>
                </ul>
              </div>
            </li>
          </ul>
        </nav>
      </header>
    )
  }
}

class PatternizerPreview extends React.Component {
  render() {
    return (
      <section className="preview">
        <canvas className="preview__canvas" data-patternizer></canvas>
      </section>
    )
  }
}

class RangeInput extends React.Component {
  render() {
    return (
      <label className="controls__label">
        <span className="controls__label-text">{this.props.name}</span>
        <div className="controls__range">
          <input className="range" value={this.props.value} name={this.props.name} type="range" onInput={(event) => this.props.onRangeChange(event)} onChange={(event) => this.props.onRangeChange(event)} min={this.props.min} max={this.props.max} />
        </div>
        <div className="controls__range-input-wrapper">
          <input className="controls__range-input" value={this.props.value} name={this.props.name} type="number" onChange={(event) => this.props.onRangeChange(event)} min={this.props.min} max={this.props.max} />
        </div>
      </label>
    )
  }
}

class Controls extends React.Component {
  getStripeClasses(stripe, idx) {
    const classes = ['stripes__item'];
    if (idx === this.props.currentStripeIdx) {
      classes.push('stripes__item--active');
    }
    if (!this.props.stripes[idx].visible) {
      classes.push('stripes__item--hidden');
    }
    return classes.join(' ');
  }

  render() {
    const stripes = this.props.stripes.map((stripe, idx) => {
      return (
        <li
          key={stripe.id}
          data-idx={idx}
          onClick={(event) => this.props.onStripeClick(event)}
          className={this.getStripeClasses(stripe, idx)}
        >
          <label className="stripe__visible-label">
            <input className="stripe__visible-input" type="checkbox" name="visible" checked={stripe.visible} onChange={(event) => this.props.onInputChange(event, idx)}/>
            <div className="stripe__visible-box"></div>
          </label>
          <div className="stripes__item-color" style={{backgroundColor: stripe.color}}></div>
          <button className="stripes__item-delete" type="button" data-idx={idx} onClick={(event) => this.props.removeStripe(event, idx)}>⨉</button>
        </li>
      )
    })

    return (
      <section className="controls">
        <section className="stripe-settings">
          {this.props.currentStripe.color}<br/>
          {this.props.currentStripe.plaid.toString()}<br/>

          <RangeInput
            name="opacity"
            value={this.props.currentStripe.opacity}
            min={0}
            max={100}
            onRangeChange={(event) => this.props.onRangeChange(event)}
          />
          <RangeInput
            name="width"
            value={this.props.currentStripe.width}
            min={1}
            max={100}
            onRangeChange={(event) => this.props.onRangeChange(event)}
          />
          <RangeInput
            name="gap"
            value={this.props.currentStripe.gap}
            min={1}
            max={200}
            onRangeChange={(event) => this.props.onRangeChange(event)}
          />
          <RangeInput
            name="offset"
            value={this.props.currentStripe.offset}
            min={0}
            max={200}
            onRangeChange={(event) => this.props.onRangeChange(event)}
          />


          <section className="stripes">
            <button className="stripes__new-button controls__button" type="button" onClick={() => this.props.onNewStripe()}>＋New Stripe</button>
            <Sortable
              tag="ol"
              className="stripes__list"
              onChange={(order, sortable, evt) => this.props.onStripeOrderChange(order, sortable, evt)}
            >
              {stripes}
            </Sortable>
          </section>

          {this.props.bg}
        </section>
      </section>
  )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stripes: this.props.pattern.stripes,
      bg: this.props.pattern.bg,
      currentStripeIdx: 0
    };
  }

  onStripeOrderChange(stripes, sortable, event) {
    let newStripes = this.state.stripes.slice()
    const stripeToMove = newStripes.splice(event.oldIndex, 1)[0];
    newStripes.splice(event.newIndex, 0, stripeToMove);
    this.setState({
      stripes: newStripes,
      currentStripeIdx: event.newIndex,
    });
  }

  onStripeClick(event) {
    const id = Number(event.currentTarget.dataset.idx);
    this.setState({currentStripeIdx: id})
  }

  removeStripe(event, idx) {
    event.stopPropagation();
    let newIndex = idx;
    if (this.state.stripes.length === 1) {
      return;
    }
    if (this.state.currentStripeIdx === idx) {
      newIndex -= 1;
      if (newIndex <= 0) {
        newIndex = 0;
      }
    }
    let newStripes = this.state.stripes.slice();
    newStripes.splice(idx, 1);
    this.setState({
      stripes: newStripes,
      currentStripeIdx: 0,
    });
  }

  onNewStripe() {
    const newStripe = Object.assign({}, this.state.stripes[this.state.currentStripeIdx]);
    newStripe.id = uniqueId()
    let newStripes = this.state.stripes.slice();
    newStripes.unshift(newStripe);
    this.setState({
      currentStripeIdx: 0,
      stripes: newStripes
    })
  }

  onRangeChange(event) {
    const target = event.currentTarget;
    const value = Number(target.value);
    const name = target.name;
    const newStripes = this.state.stripes.slice()
    newStripes[this.state.currentStripeIdx][name] = value;
    this.setState({
      stripes: newStripes
    });
  }

  onInputChange(event, idx) {
    event.stopPropagation();
    const target = event.currentTarget;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    const newStripes = this.state.stripes.slice()
    newStripes[idx][name] = value;
    this.setState({
      stripes: newStripes
    });
  }

  render() {
    return (
      <div className="app">
        <Header/>
        <main>
          <Controls
            bg={this.state.bg}
            stripes={this.state.stripes}
            currentStripe={this.state.stripes[this.state.currentStripeIdx]}
            currentStripeIdx={this.state.currentStripeIdx}
            onStripeOrderChange={this.onStripeOrderChange.bind(this)}
            onStripeClick={this.onStripeClick.bind(this)}
            removeStripe={this.removeStripe.bind(this)}
            onInputChange={this.onInputChange.bind(this)}
            onRangeChange={this.onRangeChange.bind(this)}
            onNewStripe={this.onNewStripe.bind(this)}
          />
          <PatternizerPreview/>
        </main>
      </div>
    );
  }
}

// ========================================

function preparePatternData(data) {
  const newData = Object.assign({}, data);
  const stripes = newData.stripes.map((stripe) => {
    const clone = Object.assign({}, stripe);
    if (Object.prototype.hasOwnProperty.call(clone, 'mode')) {
      clone.plaid = clone.mode === 'plaid';
      delete clone.mode;
    }
    clone.visible = true;
    clone.id = uniqueId();
    return clone;
  });
  newData.stripes = stripes;
  return newData;
}


const data = preparePatternData(window.pattern)

ReactDOM.render(
  <App pattern={data}/>,
  document.getElementById('root')
);
