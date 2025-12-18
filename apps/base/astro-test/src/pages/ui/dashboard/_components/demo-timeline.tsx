import Timeline from "@components/extras/timeline";

export default function DemoTimeline() {
    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold">Timeline</h3>
            <div className="max-w-md">
                <Timeline
                    items={[
                        {
                            id: "1",
                            title: "Order Placed",
                            description: "We have received your order.",
                            date: "June 01, 2024",
                            status: "completed",
                        },
                        {
                            id: "2",
                            title: "Order Shipped",
                            description: "Your order has been shipped.",
                            date: "June 02, 2024",
                            status: "completed",
                        },
                        {
                            id: "3",
                            title: "Out for Delivery",
                            description: "The courier is on the way.",
                            date: "June 03, 2024",
                            status: "current",
                        },
                        {
                            id: "4",
                            title: "Delivered",
                            description: "Order delivered to customer.",
                            date: "Pending",
                            status: "pending",
                        },
                    ]}
                />
            </div>
        </div>
    );
}
