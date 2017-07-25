import React from 'react';
import ReactDOM from 'react-dom';
import {combineReducers, createStore} from 'redux';
import {Provider, connect} from 'react-redux';
import uniqueId from 'lodash/uniqueId';
import Sortable from 'react-sortablejs';

import './css/index.css';
import logo from './images/logo.svg'

import PatternizerPreview from './components/PatternizerPreview'
import RangeInput from './components/RangeInput'
import RotationInput from './components/RotationInput'
import ColorPicker from './components/ColorPicker'

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

  onStripeOrderChange(stripes, sortable, event) {
    const oldIndex = event.oldIndex;
    const newIndex = event.newIndex;
    this.props.stripeUpdateOrder(oldIndex, newIndex);
  }

  onStripeClick(event) {
    const idx = Number(event.currentTarget.dataset.idx);
    this.props.currentStripeUpdate(idx);
  }

  removeStripe(event, idx) {
    event.stopPropagation();
    this.props.stripeRemove(idx);
  }

  onNewStripe() {
    this.props.stripeDuplicate(this.props.currentStripeIdx)
  }

  onRangeChange(event) {
    const target = event.currentTarget;
    const value = Number(target.value);
    const name = target.name;
    this.props.stripeUpdate(this.props.currentStripeIdx, name, value);
  }

  onInputChange(event, idx) {
    event.stopPropagation();
    const target = event.currentTarget;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.props.stripeUpdate(idx, name, value);
  }

  updateRotation(degrees) {
    this.props.stripeUpdate(this.props.currentStripeIdx, 'rotation', degrees);
  }

  updateBackgroundColor(event, color) {
    let value;
    if (event) {
      value = event.target.value;
    } else {
      value = color;
    }
    this.props.bgUpdate(value);
  }

  updateColor(name, color, idx) {
    this.props.stripeUpdate(idx, name, color);
  }

  onRotationChange(event) {
    const target = event.currentTarget;
    const value = Number(target.value);
    this.props.stripeUpdate(this.props.currentStripeIdx, 'rotation', value);
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
          onClick={(e) => this.onStripeClick(e)}
          className={this.getStripeClasses(stripe, idx)}
        >
          <label className="stripe__visible-label">
            <input className="stripe__visible-input" type="checkbox" name="visible" checked={stripe.visible} onChange={(e) => this.onInputChange(e, idx)}/>
            <div className="stripe__visible-box"></div>
          </label>
          <div className="stripes__item-color" style={{backgroundColor: stripe.color}}></div>
          <button className="stripes__item-delete" type="button" data-idx={idx} onClick={(e) => this.removeStripe(e, idx)}>⨉</button>
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
                    onRotationChange={(e) => this.onRotationChange(e)}
                    updateRotation={(e) => this.updateRotation(e)}
                  />
                </div>
                <div className="flex__col-1_2">
                  <ColorPicker
                    name='color'
                    value={currentStripe.color}
                    onChange={(e) => this.onInputChange(e, this.props.currentStripeIdx)}
                    updateColor={(name, color) => this.updateColor(name, color, this.props.currentStripeIdx)}
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
                onRangeChange={(e) => this.onRangeChange(e)}
              />
              <RangeInput
                name="width"
                value={currentStripe.width}
                min={1}
                max={200}
                onRangeChange={(e) => this.onRangeChange(e)}
              />
              <RangeInput
                name="gap"
                value={currentStripe.gap}
                min={1}
                max={200}
                onRangeChange={(e) => this.onRangeChange(e)}
              />
              <RangeInput
                name="offset"
                value={currentStripe.offset}
                min={0}
                max={200}
                onRangeChange={(e) => this.onRangeChange(e)}
              />

            </section>

            <section className="stripes">
              <button className="stripes__new-button controls__button" type="button" onClick={() => this.onNewStripe()}>＋New Stripe</button>
              <Sortable
                tag="ol"
                className="stripes__list"
                onChange={(order, sortable, evt) => this.onStripeOrderChange(order, sortable, evt)}
              >
                {stripes}
              </Sortable>
            </section>

            <section className="background-settings">
              <ColorPicker
                name="Background Color"
                value={this.props.bg}
                top={true}
                onChange={(e) => this.updateBackgroundColor(e)}
                updateColor={(name, color) => this.updateBackgroundColor(null, color)}
              />
            </section>

          </section>

          <PatternizerPreview patternData={this.stateFiltered()} />
        </main>
      </div>
    );
  }
}

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

const PATTERN_DEFAULT = {
  stripes: [
    {
      color: '#a03ad6',
      rotation: 200,
      opacity: 50,
      mode: 'plaid',
      width: 10,
      gap: 10,
      offset: 0,
    },
    {
      color: '#FFB4D6',
      rotation: 45,
      opacity: 80,
      mode: 'normal',
      width: 30,
      gap: 10,
      offset: 0,
    },
  ],
  bg: '#ffffff',
};
const STATE_DEFAULT = {
  currentStripeIdx: 0,
};

const patternData = window.pattern || PATTERN_DEFAULT;
const patternDataPrepared = preparePatternData(patternData);
const initialState = Object.assign({}, STATE_DEFAULT, patternDataPrepared);

const STRIPE_UPDATE_ORDER = 'STRIPE_UPDATE_ORDER';
const STRIPE_UPDATE = 'STRIPE_UPDATE';
const STRIPE_DUPLICATE = 'STRIPE_DUPLICATE';
const STRIPE_REMOVE = 'STRIPE_REMOVE';
const BG_UPDATE = 'BG_UPDATE';
const CURRENT_STRIPE_UPDATE = 'CURRENT_STRIPE_UPDATE';

const stripesHandler = (stripes = initialState.stripes, action) => {
  let newStripes;
  let newStripe;
  switch (action.type) {
    case STRIPE_UPDATE_ORDER:
      newStripes = stripes.slice();
      const stripeToMove = newStripes.splice(action.oldIndex, 1)[0];
      newStripes.splice(action.newIndex, 0, stripeToMove);
      return newStripes;

    case STRIPE_DUPLICATE:
      newStripes = stripes.slice();
      newStripe = Object.assign({}, newStripes[action.index]);
      newStripe.id = uniqueId();
      newStripes.unshift(newStripe);
      return newStripes;

    case STRIPE_UPDATE:
      newStripes = stripes.slice();
      newStripes[action.index][action.name] = action.value;
      return newStripes;

    case STRIPE_REMOVE:
      newStripes = stripes.slice();
      if (newStripes.length >= 1) {
        newStripes.splice(action.index, 1);
      }
      return newStripes;

    default:
      return stripes;
  }
}
const bgHandler = (bg = initialState.bg, action) => {
  switch (action.type) {
    case BG_UPDATE:
      return action.color;
    default:
      return bg;
  }
}
const currentStripeIdxHandler = (currentStripeIdx = initialState.currentStripeIdx, action) => {
  switch (action.type) {
    case CURRENT_STRIPE_UPDATE:
      return action.index;
    case STRIPE_DUPLICATE:
      return 0;
    case STRIPE_REMOVE:
      if (currentStripeIdx === action.index) {
        currentStripeIdx -= 1;
        if (currentStripeIdx < 0) {
          currentStripeIdx = 0;
        }
      }
      return currentStripeIdx;
    default:
      return currentStripeIdx;
  }
}

const rootReducer = combineReducers({
  stripes: stripesHandler,
  bg: bgHandler,
  currentStripeIdx: currentStripeIdxHandler
});



const mapStateToProps = state => {
  return {...state}
}

const mapDispatchToProps = dispatch => {
  return {
    stripeDuplicate: (index) => dispatch({
      type: STRIPE_DUPLICATE,
      index,
    }),
    stripeUpdate: (index, name, value) => dispatch({
      type: STRIPE_UPDATE,
      index,
      name,
      value
    }),
    stripeUpdateOrder: (oldIndex, newIndex) => dispatch({
      type: STRIPE_UPDATE_ORDER,
      oldIndex,
      newIndex
    }),
    stripeRemove: (index) => dispatch({
      type: STRIPE_REMOVE,
      index,
    }),
    bgUpdate: (color) => dispatch({
      type: BG_UPDATE,
      color,
    }),
    currentStripeUpdate: (index) => dispatch({
      type: CURRENT_STRIPE_UPDATE,
      index,
    }),
  }
}

const AppConnected = connect(mapStateToProps, mapDispatchToProps)(App);

ReactDOM.render(
  <Provider store={createStore(rootReducer, initialState)}>
    <AppConnected />
  </Provider>,
  document.getElementById('root')
)

