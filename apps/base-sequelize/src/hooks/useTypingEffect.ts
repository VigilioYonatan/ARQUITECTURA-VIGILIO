import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

function useTypingEffect(text: string, speed = 100) {
	const typedText = useSignal<string>("");

	useEffect(() => {
		let index = 0;
		typedText.value = "";
		const interval = setInterval(() => {
			typedText.value = typedText.value + text[index];
			index++;
			if (index === text.length) {
				clearInterval(interval);
			}
		}, speed);
		return () => clearInterval(interval);
	}, [text, speed]);

	return typedText.value;
}

export default useTypingEffect;
