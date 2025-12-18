import { Badge } from "@components/extras/badge";

export default function DemoBadge() {
    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold">Badges</h3>
            <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="outline">Outline</Badge>
            </div>
        </div>
    );
}
