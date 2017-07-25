import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';
import uniqueId from 'lodash/uniqueId';
import Sortable from 'react-sortablejs';

import {actions, rootReducer, getInitialState} from './reducers.js';
import PatternizerPreview from './components/PatternizerPreview';
import RangeInput from './components/RangeInput';
import RotationInput from './components/RotationInput';
import ColorPicker from './components/ColorPicker';

import './css/index.css';
import logo from './images/logo.svg';

class App extends React.Component {

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

  onInputChange(event, idx) {
    event.stopPropagation();
    const target = event.currentTarget;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.props.stripeUpdate(idx, name, value);
  }

  stateFiltered() {
    const visibleStripes = this.props.stripes.filter(stripe => (stripe.visible === true));
    const stripesCleaned = visibleStripes.map((stripe) => {
      const clone = Object.assign({}, stripe);
      delete clone.visible;
      delete clone.id;
      return clone;
    });
    return {
      stripes: stripesCleaned,
      bg: this.props.bg,
    };
  }

  render() {
    const stripes = this.props.stripes.map((stripe, idx) => {
      return (
        <li
          key={stripe.id}
          data-idx={idx}
          onClick={() => this.props.currentStripeUpdate(idx)}
          className={this.getStripeClasses(stripe, idx)}
        >
          <label className="stripe__visible-label">
            <input className="stripe__visible-input" type="checkbox" name="visible" checked={stripe.visible} onChange={(e) => this.onInputChange(e, idx)}/>
            <div className="stripe__visible-box"></div>
          </label>
          <div className="stripes__item-color" style={{backgroundColor: stripe.color}}></div>
          <button
            className="stripes__item-delete"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              this.props.stripeRemove(idx);
            }}
          >⨉</button>
        </li>
      )
    })
    const currentStripe = this.props.stripes[this.props.currentStripeIdx];

    return (
      <div className="app">
        <header className="site-header">
          <h1 className="logo">
            <img className="logo-svg" src={logo} alt="logo"/>
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
        <main className="main">
          <section className="controls">
            <section className="stripe-settings">

              <div className="flex col-2">
                <div className="flex__col-1_2">
                  <RotationInput
                    value={currentStripe.rotation}
                    onRotationChange={(e) => this.props.stripeUpdate(this.props.currentStripeIdx, 'rotation', e.currentTarget.value)}
                    updateRotation={(degs) => this.props.stripeUpdate(this.props.currentStripeIdx, 'rotation', degs)}
                  />
                </div>
                <div className="flex__col-1_2">
                  <ColorPicker
                    name='color'
                    value={currentStripe.color}
                    onChange={(e) => this.onInputChange(e, this.props.currentStripeIdx)}
                    updateColor={(name, color) => this.props.stripeUpdate(this.props.currentStripeIdx, name, color)}
                  />
                  <label className="plaid__label controls__label" title="Stripes go vertically and horizontally">
                    Plaid
                    <input className="plaid__check" type="checkbox" name="plaid" checked={currentStripe.plaid} onChange={(e) => this.onInputChange(e, this.props.currentStripeIdx)} />
                  </label>
                </div>
              </div>

              <RangeInput
                name="opacity"
                value={currentStripe.opacity}
                min={0}
                max={100}
                onRangeChange={(e) => this.props.stripeUpdate(this.props.currentStripeIdx, e.currentTarget.name, Number(e.currentTarget.value))}
              />
              <RangeInput
                name="width"
                value={currentStripe.width}
                min={1}
                max={200}
                onRangeChange={(e) => this.props.stripeUpdate(this.props.currentStripeIdx, e.currentTarget.name, Number(e.currentTarget.value))}
              />
              <RangeInput
                name="gap"
                value={currentStripe.gap}
                min={1}
                max={200}
                onRangeChange={(e) => this.props.stripeUpdate(this.props.currentStripeIdx, e.currentTarget.name, Number(e.currentTarget.value))}
              />
              <RangeInput
                name="offset"
                value={currentStripe.offset}
                min={0}
                max={200}
                onRangeChange={(e) => this.props.stripeUpdate(this.props.currentStripeIdx, e.currentTarget.name, Number(e.currentTarget.value))}
              />

            </section>

            <section className="stripes">
              <button
                className="stripes__new-button controls__button"
                type="button"
                onClick={() => this.props.stripeDuplicate(this.props.currentStripeIdx)}
              >＋New Stripe</button>
              <Sortable
                tag="ol"
                className="stripes__list"
                onChange={(order, sortable, e) => this.props.stripeUpdateOrder(e.oldIndex, e.newIndex)}
              >
                {stripes}
              </Sortable>
            </section>

            <section className="background-settings">
              <ColorPicker
                name="Background Color"
                value={this.props.bg}
                top={true}
                onChange={(e) => this.props.bgUpdate(e.target.value)}
                updateColor={(name, color) => this.props.bgUpdate(color)}
              />
            </section>

          </section>

          <PatternizerPreview patternData={this.stateFiltered()} />
        </main>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {...state}
}

const mapDispatchToProps = dispatch => {
  return {
    stripeDuplicate: (index) => dispatch({
      type: actions.STRIPE_DUPLICATE,
      index,
    }),
    stripeUpdate: (index, name, value) => dispatch({
      type: actions.STRIPE_UPDATE,
      index,
      name,
      value
    }),
    stripeUpdateOrder: (oldIndex, newIndex) => dispatch({
      type: actions.STRIPE_UPDATE_ORDER,
      oldIndex,
      newIndex
    }),
    stripeRemove: (index) => dispatch({
      type: actions.STRIPE_REMOVE,
      index,
    }),
    bgUpdate: (color) => dispatch({
      type: actions.BG_UPDATE,
      color,
    }),
    currentStripeUpdate: (index) => dispatch({
      type: actions.CURRENT_STRIPE_UPDATE,
      index,
    }),
  }
}

const AppConnected = connect(mapStateToProps, mapDispatchToProps)(App);

ReactDOM.render(
  <Provider store={createStore(rootReducer, getInitialState(window.pattern))}>
    <AppConnected />
  </Provider>,
  document.getElementById('root')
)

