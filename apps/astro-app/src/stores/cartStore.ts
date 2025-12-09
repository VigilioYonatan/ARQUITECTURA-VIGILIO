import { atom, map } from "nanostores";

// Estado simple: ¿Está abierto el carrito?
export const isCartOpen = atom(false);

// Estado complejo: Items del carrito
// map() es mejor para objetos que cambian propiedades
export const cartItems = map({});

export function addCartItem(item) {
    const existingEntry = cartItems.get()[item.id];
    if (existingEntry) {
        cartItems.setKey(item.id, {
            ...existingEntry,
            quantity: existingEntry.quantity + 1,
        });
    } else {
        cartItems.setKey(item.id, {
            ...item,
            quantity: 1,
        });
    }
}
