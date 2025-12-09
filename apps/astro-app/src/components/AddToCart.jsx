import { addCartItem, isCartOpen } from "../stores/cartStore";

export default function AddToCart({ item }) {
    return (
        <button
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer"
            onClick={() => {
                addCartItem(item);
                isCartOpen.set(true); // Abrir carrito al añadir
            }}
        >
            Añadir al Carrito 🛒
        </button>
    );
}
