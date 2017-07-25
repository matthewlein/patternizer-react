import {combineReducers} from 'redux';
import uniqueId from 'lodash/uniqueId';

const STRIPE_UPDATE_ORDER = 'STRIPE_UPDATE_ORDER';
const STRIPE_UPDATE = 'STRIPE_UPDATE';
const STRIPE_DUPLICATE = 'STRIPE_DUPLICATE';
const STRIPE_REMOVE = 'STRIPE_REMOVE';
const BG_UPDATE = 'BG_UPDATE';
const CURRENT_STRIPE_UPDATE = 'CURRENT_STRIPE_UPDATE';

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

const preparePatternData = (data) => {
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

const getInitialState = (pattern) => {
  const patternData = Object.assign({}, PATTERN_DEFAULT, pattern);
  const patternDataPrepared = preparePatternData(patternData);
  return Object.assign({}, STATE_DEFAULT, patternDataPrepared);
};

const initialState = getInitialState();

const stripesHandler = (stripes = initialState.stripes, action) => {
  let newStripes;
  switch (action.type) {
    case STRIPE_UPDATE_ORDER:
      newStripes = stripes.slice();
      const stripeToMove = newStripes.splice(action.oldIndex, 1)[0];
      newStripes.splice(action.newIndex, 0, stripeToMove);
      return newStripes;

    case STRIPE_DUPLICATE:
      newStripes = stripes.slice();
      const newStripe = Object.assign({}, newStripes[action.index]);
      newStripe.id = uniqueId();
      newStripes.unshift(newStripe);
      return newStripes;

    case STRIPE_UPDATE:
      newStripes = stripes.slice();
      newStripes[action.index][action.name] = action.value;
      return newStripes;

    case STRIPE_REMOVE:
      newStripes = stripes.slice();
      if (newStripes.length > 1) {
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

const actions = {
  STRIPE_UPDATE_ORDER,
  STRIPE_UPDATE,
  STRIPE_DUPLICATE,
  STRIPE_REMOVE,
  BG_UPDATE,
  CURRENT_STRIPE_UPDATE,
};

export {
  rootReducer,
  actions,
  getInitialState,
};
