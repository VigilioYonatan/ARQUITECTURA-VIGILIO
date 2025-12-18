import Alert from "@components/extras/alert";

export default function DemoAlert() {
    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold">Alerts</h3>
            <div className="flex flex-col gap-2">
                <Alert
                    type="success"
                    title="Success Alert"
                    message="This is a success alert message."
                />
                <Alert
                    type="error"
                    title="Error Alert"
                    message="This is an error alert message."
                />
                <Alert
                    type="warning"
                    title="Warning Alert"
                    message="This is a warning alert message."
                />
                <Alert
                    type="info"
                    title="Info Alert"
                    message="This is an info alert message."
                />
            </div>
        </div>
    );
}
