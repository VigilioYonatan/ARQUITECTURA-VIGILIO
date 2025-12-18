import Accordion from "@components/extras/accordion";

export default function DemoAccordion() {
    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold">Accordion</h3>
            <div className="max-w-md">
                <Accordion
                    items={[
                        {
                            id: "item-1",
                            title: "Is it accessible?",
                            content:
                                "Yes. It adheres to the WAI-ARIA design pattern.",
                        },
                        {
                            id: "item-2",
                            title: "Is it styled?",
                            content:
                                "Yes. It comes with default styles that matches the other components' aesthetic.",
                        },
                        {
                            id: "item-3",
                            title: "Is it animated?",
                            content:
                                "Yes. It uses transitions for smooth open/close animations.",
                        },
                    ]}
                />
            </div>
        </div>
    );
}
