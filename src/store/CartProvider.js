import { useReducer } from "react";

import CartContext from "./cart-context";

const defaultCartState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  if (action.type === "ADD") {
    const updatedTotalAmount =
      state.totalAmount + action.item.price * action.item.amount; //final amount $$$

    const existingCartItemIndex = state.items.findIndex(
      //returns index of first item in cart with matching id or -1 if not found
      (item) => item.id === action.item.id
    );

    const exisitingCartItem = state.items[existingCartItemIndex]; //finds exisiting item in state.items arrays and save in a new const
    // let updatedItem;
    let updatedItems;

    if (exisitingCartItem) {
      //if true, spread data for existing item into a new object and then add action amount(1-5) to current amount.
      const updatedItem = {
        ...exisitingCartItem,
        amount: exisitingCartItem.amount + action.item.amount,
      };
      updatedItems = [...state.items]; //new array that doesn't change state.items array in memory.  will be used to put updatedItem
      updatedItems[existingCartItemIndex] = updatedItem; //OVERWRITE old item with new item
    } else {
      //if added for first time...
      updatedItems = state.items.concat(action.item); //returns a new array with new item added.  doesn't mutate current state.
    }
    return { items: updatedItems, totalAmount: updatedTotalAmount }; //return new object to state
  }

  if (action.type === "REMOVE") {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    ); //returns index of first item in cart with matching id or -1 if not found.  amount is total added.

    const existingItem = state.items[existingCartItemIndex]; //finds item in state.items
    const updatedTotalAmount = state.totalAmount - existingItem.price; //final amount $$$

    let updatedItems;
    if (existingItem.amount === 1) {
      //if only one of an item, remove from updatedItems
      updatedItems = state.items.filter((item) => item.id !== action.id);
    } else {
      //if > one
      const updatedItem = { ...existingItem, amount: existingItem.amount - 1 }; //create new item and subtract 1 from amount
      updatedItems = [...state.items]; //create a new snapshot of state
      updatedItems[existingCartItemIndex] = updatedItem; //replace old object at index with new object
    }
    return { items: updatedItems, totalAmount: updatedTotalAmount }; //return new object to state
  }

  if (action.type === "CLEAR") {
    return defaultCartState;
  }
  return defaultCartState;
};

const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState //initial state
  );

  const addItemToCartHandler = (item) => {
    dispatchCartAction({ type: "ADD", item: item });
  };

  const removeItemFromCartHandler = (id) => {
    dispatchCartAction({ type: "REMOVE", id: id });
  };

  const clearCartHandler = () => {
    dispatchCartAction({ type: "CLEAR" });
  };

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
    clearCart: clearCartHandler,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
