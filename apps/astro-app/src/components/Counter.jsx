import { useState } from "preact/hooks";

export default function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div
            style={{
                padding: "20px",
                background: "#333",
                color: "white",
                borderRadius: "8px",
                textAlign: "center",
                marginTop: "20px",
            }}
        >
            <h3>Contador Interactivo (Preact)</h3>
            <p style={{ fontSize: "2rem", margin: "10px 0" }}>{count}</p>
            <button
                onClick={() => setCount(count + 1)}
                style={{
                    padding: "10px 20px",
                    fontSize: "1rem",
                    cursor: "pointer",
                    background: "#4f39fa",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                }}
            >
                +1
            </button>
        </div>
    );
}
