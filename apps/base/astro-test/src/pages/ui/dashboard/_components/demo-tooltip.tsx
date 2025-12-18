import Button from "@components/extras/button";
import Tooltip from "@components/extras/tooltip";

export default function DemoTooltip() {
    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold">Tooltips</h3>
            <div className="flex flex-wrap gap-8 items-center pt-8 justify-center">
                <Tooltip content="Tooltip on Top" position="top">
                    <Button variant="outline">Top</Button>
                </Tooltip>
                <Tooltip content="Tooltip on Bottom" position="bottom">
                    <Button variant="outline">Bottom</Button>
                </Tooltip>
                <Tooltip content="Tooltip on Left" position="left">
                    <Button variant="outline">Left</Button>
                </Tooltip>
                <Tooltip content="Tooltip on Right" position="right">
                    <Button variant="outline">Right</Button>
                </Tooltip>
            </div>
        </div>
    );
}
