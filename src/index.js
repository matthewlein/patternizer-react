import React from 'react';
import ReactDOM from 'react-dom';
import uniqueId from 'lodash/uniqueId';
import Sortable from 'react-sortablejs';

import './css/index.css';
import PatternizerPreview from './components/PatternizerPreview'
import RangeInput from './components/RangeInput'
import RotationInput from './components/RotationInput'
import ColorPicker from './components/ColorPicker'
import Header from './components/Header'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stripes: this.props.pattern.stripes,
      bg: this.props.pattern.bg,
      currentStripeIdx: 0
    };
  }

  getStripeClasses(stripe, idx) {
    const classes = ['stripes__item'];
    if (idx === this.state.currentStripeIdx) {
      classes.push('stripes__item--active');
    }
    if (!this.state.stripes[idx].visible) {
      classes.push('stripes__item--hidden');
    }
    return classes.join(' ');
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

  updateRotation(degrees) {
    const newStripes = this.state.stripes.slice()
    newStripes[this.state.currentStripeIdx].rotation = degrees;
    this.setState({
      stripes: newStripes
    });
  }

  updateBackgroundColor(event, color) {
    let value;
    if (event) {
      value = event.target.value;
    } else {
      value = color;
    }
    this.setState({
      bg: value
    })
  }

  updateColor(name, color, idx) {
    const newStripes = this.state.stripes.slice()
    newStripes[idx][name] = color;
    this.setState({
      stripes: newStripes
    });
  }

  onRotationChange(event) {
    const target = event.currentTarget;
    const value = Number(target.value);
    const newStripes = this.state.stripes.slice()
    newStripes[this.state.currentStripeIdx].rotation = value;
    this.setState({
      stripes: newStripes
    });
  }

  stateFiltered() {
    const visibleStripes = this.state.stripes.filter(stripe => (stripe.visible === true));
    const stripesCleaned = visibleStripes.map((stripe) => {
      const clone = Object.assign({}, stripe);
      delete clone.visible;
      delete clone.id;
      return clone;
    });
    return {
      stripes: stripesCleaned,
      bg: this.state.bg,
    };
  }

  render() {
    const stripes = this.state.stripes.map((stripe, idx) => {
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
    const currentStripe = this.state.stripes[this.state.currentStripeIdx];

    return (
      <div className="app">
        <Header/>
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
                    onChange={(e) => this.onInputChange(e, this.state.currentStripeIdx)}
                    updateColor={(name, color) => this.updateColor(name, color, this.state.currentStripeIdx)}
                  />
                  <label className="plaid__label controls__label" title="Stripes go vertically and horizontally">
                    Plaid
                    <input className="plaid__check" type="checkbox" name="plaid" checked={currentStripe.plaid} onChange={(e) => this.onInputChange(e, this.state.currentStripeIdx)} />
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
                value={this.state.bg}
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
