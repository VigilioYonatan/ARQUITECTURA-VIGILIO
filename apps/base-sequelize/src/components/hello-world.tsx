// import env from "astro:env/client";

import { sizeIcon } from "@infrastructure/libs/client/helpers";
import { useThemeStore } from "@stores/theme.store";
import { MoonIconSolid, SunIconSolid } from "@vigilio/react-icons";
import Button from "./extras/button";

function HelloWorld() {
    // console.log(env);
    const theme = useThemeStore();

    return (
        <div className="fixed top-2 right-2 dark:bg-red-900 bg-gray-100 p-2 rounded">
            <Button
                type="button"
                onClick={() => {
                    theme.changeThemeMode(
                        theme.value === "dark" ? "light" : "dark"
                    );
                }}
            >
                {theme.value === "dark" ? (
                    <SunIconSolid {...sizeIcon.small} />
                ) : (
                    <MoonIconSolid {...sizeIcon.small} />
                )}
            </Button>
        </div>
    );
}

export default HelloWorld;
