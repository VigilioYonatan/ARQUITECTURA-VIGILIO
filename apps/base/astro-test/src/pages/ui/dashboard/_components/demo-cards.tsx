import Button from "@components/extras/button";
import Card from "@components/extras/card";

export function DemoCards() {
    return (
        <div className="flex flex-col gap-6">
            <h3 className="text-lg font-bold">Card Variants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <Card.header>
                        <Card.title>Default Card</Card.title>
                    </Card.header>
                    <Card.content>
                        <p>
                            This is a default card component with header,
                            content, and footer.
                        </p>
                    </Card.content>
                    <Card.footer>
                        <Button size="sm">Action</Button>
                    </Card.footer>
                </Card>

                <Card variant="elevated">
                    <Card.header>
                        <Card.title>Elevated Card</Card.title>
                    </Card.header>
                    <Card.content>
                        <p>This card has an elevation shadow for prominence.</p>
                    </Card.content>
                    <Card.footer>
                        <Button size="sm" variant="secondary">
                            Action
                        </Button>
                    </Card.footer>
                </Card>

                <Card variant="outlined">
                    <Card.header>
                        <Card.title>Outlined Card</Card.title>
                    </Card.header>
                    <Card.content>
                        <p>
                            This card has a stronger border and no background
                            color by default.
                        </p>
                    </Card.content>
                    <Card.footer>
                        <Button size="sm" variant="outline">
                            Action
                        </Button>
                    </Card.footer>
                </Card>

                <Card variant="glass">
                    <Card.header>
                        <Card.title>Glass Card</Card.title>
                    </Card.header>
                    <Card.content>
                        <p>This card simulates a glassmorphism effect.</p>
                    </Card.content>
                    <Card.footer>
                        <Button size="sm" variant="ghost">
                            Action
                        </Button>
                    </Card.footer>
                </Card>
            </div>
        </div>
    );
}

export default DemoCards;
