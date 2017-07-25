import {actions, rootReducer, getInitialState} from '../reducers.js';
import uniqueId from 'lodash/uniqueId';

describe('getInitialState', () =>{

  it('with no args creates deafult state', () => {
    const state = getInitialState();
    expect(state).not.toEqual({});
    expect(state.stripes).not.toBeUndefined();
    expect(state.bg).not.toBeUndefined();
  });

  it('args override deafult state', () => {
    const localState = {
      stripes: [],
      bg: 'abc123'
    }
    const state = getInitialState(localState);
    expect(state.stripes).toEqual(state.stripes)
    expect(state.bg).toBe(localState.bg)
  });

  it('migrates old patternizer data, adds new stripe data', () => {
    const localState = {
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
      ]
    }
    const state = getInitialState(localState);
    const stripe = state.stripes[0];
    expect(stripe.id).not.toBeUndefined();
    expect(stripe.mode).toBeUndefined();
    expect(stripe.plaid).toBe(true);
    expect(stripe.visible).toBe(true);
  });

})

describe('rootReducer', () => {

  describe('bgHandler', () => {

    it('returns default state with undefined', () => {
      const defaultState = getInitialState();
      const updatedState = rootReducer({}, {})
      expect(updatedState.bg).toEqual(defaultState.bg)
    })

    it('BG_UPDATE sets new bg value', () => {
      const action = {
        type: actions.BG_UPDATE,
        color: 'new'
      }
      const updatedState = rootReducer({ bg: 'old' }, action)
      expect(updatedState.bg).toEqual(action.color)
    })
  })

  describe('currentStripeIdxHandler', () => {

    it('returns default state with undefined', () => {
      const defaultState = getInitialState();
      const updatedState = rootReducer({}, {})
      expect(updatedState.currentStripeIdx).toEqual(defaultState.currentStripeIdx)
    })

    it('CURRENT_STRIPE_UPDATE sets new index value', () => {
      const action = {
        type: actions.CURRENT_STRIPE_UPDATE,
        index: 2
      }
      const updatedState = rootReducer({ currentStripeIdx: 0 }, action)
      expect(updatedState.currentStripeIdx).toEqual(action.index)
    })

    it('STRIPE_DUPLICATE sets index to 0', () => {
      const action = {
        type: actions.STRIPE_DUPLICATE,
      }
      const updatedState = rootReducer({ currentStripeIdx: 2 }, action)
      expect(updatedState.currentStripeIdx).toEqual(0)
    })

    describe('STRIPE_REMOVE', () => {
      it('decrements by 1 if currently selected stripe index', () => {
        const action = {
          type: actions.STRIPE_REMOVE,
          index: 2
        }
        const updatedState = rootReducer({ currentStripeIdx: 2 }, action)
        expect(updatedState.currentStripeIdx).toEqual(1)
      })
      it('doesnt change if not currently selected stripe index', () => {
        const action = {
          type: actions.STRIPE_REMOVE,
          index: 0
        }
        const updatedState = rootReducer({ currentStripeIdx: 2 }, action)
        expect(updatedState.currentStripeIdx).toEqual(2)
      })
      it('wont go below 0', () => {
        const action = {
          type: actions.STRIPE_REMOVE,
          index: 0
        }
        const updatedState = rootReducer({ currentStripeIdx: 0 }, action)
        expect(updatedState.currentStripeIdx).toEqual(0)
      })
    })
  })

  describe('stripesHandler', () => {

    it('STRIPE_UPDATE_ORDER reorders stripes', () => {
      const action = {
        type: actions.STRIPE_UPDATE_ORDER,
        newIndex: 0,
        oldIndex: 1,
      }
      const updatedState = rootReducer({ stripes: [0, 1] }, action)
      expect(updatedState.stripes).toEqual([1, 0])
    })

    it('STRIPE_DUPLICATE duplicates a stripe, added to the beginning', () => {
      const action = {
        type: actions.STRIPE_DUPLICATE,
        index: 0
      }
      const startingStripe = {id: uniqueId()}
      const updatedState = rootReducer({ stripes: [startingStripe] }, action)
      expect(updatedState.stripes.length).toEqual(2)
      expect(updatedState.stripes[1]).toEqual(startingStripe)
      expect(updatedState.stripes[0].id).not.toEqual(startingStripe.id)
    })

    it('STRIPE_UPDATE updates a stripe property', () => {
      const action = {
        type: actions.STRIPE_UPDATE,
        index: 0,
        name: 'opacity',
        value: 10
      }
      const startingStripe = {opacity: 0}
      const updatedState = rootReducer({ stripes: [startingStripe] }, action)
      expect(updatedState.stripes[0].opacity).toBe(10)
    })

    describe('STRIPE_REMOVE', () => {
      it('removes a stripe at index', () => {
        const action = {
          type: actions.STRIPE_REMOVE,
          index: 2
        }
        const updatedState = rootReducer({ stripes: [0,1,2,3] }, action)
        expect(updatedState.stripes).toEqual([0,1,3])
      })

      it('doesnt remove the last stripe', () => {
        const action = {
          type: actions.STRIPE_REMOVE,
          index: 0
        }
        const updatedState = rootReducer({ stripes: [0] }, action)
        expect(updatedState.stripes).toEqual([0])
      })

    })

  })

})

describe('actions', () => {
  it('has some properties', ()=> {
    expect(actions).not.toBeUndefined()
    expect(Object.keys(actions).length).not.toBe(0)
  })
})
