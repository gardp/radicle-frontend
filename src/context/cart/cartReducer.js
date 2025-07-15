import {
  INIT_CART,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_QUANTITY,
  CLEAR_CART,
  SET_CART_LOADING,
  SET_CART_ERROR
} from './cartTypes';

/**
 * Helper function to calculate cart totals (items count and price)
 * @param {Array} items - Cart items array
 * @returns {Object} Object containing totalItems and totalPrice
 */
const calculateCartTotals = (items) => {
  return items.reduce(
    (totals, item) => {
      return {
        totalItems: totals.totalItems + item.quantity,
        totalPrice: totals.totalPrice + (item.price * item.quantity)
      };
    },
    { totalItems: 0, totalPrice: 0 }
  );
};

/**
 * Cart reducer function that handles all state updates
 * This is a pure function that produces a new state based on the current state and action
 */
export const cartReducer = (state, action) => {
  switch (action.type) {
    case INIT_CART:
      return {
        ...state,
        items: action.payload,
        ...calculateCartTotals(action.payload),
        isLoading: false,
        error: null
      };
    
    case ADD_TO_CART: {
      const { item } = action.payload;
      
      // Check if this exact combination of track and license exists
      const existingItemIndex = state.items.findIndex(
        i => i.id === item.id && i.license === item.license
      );
      
      let updatedItems;
      
      if (existingItemIndex >= 0) {
        // Item with same ID and license exists, update quantity
        updatedItems = state.items.map((cartItem, index) => 
          index === existingItemIndex 
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity } 
            : cartItem
        );
      } else {
        // Item with this ID and license doesn't exist, add as new
        updatedItems = [...state.items, item];
      }
      
      return {
        ...state,
        items: updatedItems,
        ...calculateCartTotals(updatedItems),
        error: null
      };
    }
    
    case REMOVE_FROM_CART: {
      const { itemId } = action.payload;
      const updatedItems = state.items.filter(item => item.id !== itemId);
      
      return {
        ...state,
        items: updatedItems,
        ...calculateCartTotals(updatedItems),
        error: null
      };
    }
    
    case UPDATE_QUANTITY: {
      const { itemId, quantity } = action.payload;
      
      // Ensure quantity is valid (minimum 1)
      const safeQuantity = Math.max(1, quantity);
      
      const updatedItems = state.items.map(item => 
        item.id === itemId ? { ...item, quantity: safeQuantity } : item
      );
      
      return {
        ...state,
        items: updatedItems,
        ...calculateCartTotals(updatedItems),
        error: null
      };
    }
    
    case CLEAR_CART:
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
        error: null
      };
    
    case SET_CART_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    
    case SET_CART_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
      
    default:
      return state;
  }
};
