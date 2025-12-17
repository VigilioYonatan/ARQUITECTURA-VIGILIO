import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

function Cargando() {
	const dots = useSignal("");

	useEffect(() => {
		const interval = setInterval(() => {
			dots.value = dots.value.length === 3 ? "" : `${dots.value}.`;
		}, 500);

		return () => clearInterval(interval);
	}, []);

	return (
		<div class="h-full flex flex-col items-center justify-center gap-1">
			{/* {empresaContext.empresa.logo_loading && (
                    <Image
                        src={
                            printFileWithDimension(
                                empresaContext.empresa.logo_loading,
                                100
                            )[0]
                        }
                        alt="Logo"
                        title="Logo"
                        size="xl"
                        className="opacity-70"
                    />
                )} */}

			<div class="flex items-center gap-2">
				<p class="text-lg font-semibold text-foreground  animate-pulse">
					Cargando
				</p>
				<span class="w-12 text-left text-gray-500 font-mono animate-pulse">
					{dots}
				</span>
			</div>
		</div>
	);
}

export default Cargando;
