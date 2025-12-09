import { useStore } from "@nanostores/preact";
import { cartItems, isCartOpen } from "../stores/cartStore";

export default function CartFlyout() {
    const $isCartOpen = useStore(isCartOpen);
    const $cartItems = useStore(cartItems);
    const items = Object.values($cartItems);
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (!$isCartOpen) return null;

    return (
        <div className="fixed top-0 right-0 h-full w-80 bg-gray-900 border-l border-gray-700 shadow-2xl p-6 transform transition-transform z-50">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Tu Carrito</h2>
                <button
                    onClick={() => isCartOpen.set(false)}
                    className="text-gray-400 hover:text-white text-2xl"
                >
                    &times;
                </button>
            </div>

            {items.length === 0 ? (
                <p className="text-gray-500 text-center mt-10">El carrito está vacío 😢</p>
            ) : (
                <ul className="space-y-4">
                    {items.map((item) => (
                        <li
                            key={item.id}
                            className="flex justify-between items-center bg-gray-800 p-3 rounded"
                        >
                            <div>
                                <p className="font-bold text-white">{item.name}</p>
                                <p className="text-sm text-gray-400">
                                    ${item.price} x {item.quantity}
                                </p>
                            </div>
                            <span className="text-green-400 font-bold">
                                ${item.price * item.quantity}
                            </span>
                        </li>
                    ))}
                </ul>
            )}

            {items.length > 0 && (
                <div className="mt-8 pt-4 border-t border-gray-700">
                    <div className="flex justify-between text-xl font-bold text-white mb-4">
                        <span>Total:</span>
                        <span>${total}</span>
                    </div>
                    <button className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded">
                        Pagar Ahora
                    </button>
                </div>
            )}
        </div>
    );
}
