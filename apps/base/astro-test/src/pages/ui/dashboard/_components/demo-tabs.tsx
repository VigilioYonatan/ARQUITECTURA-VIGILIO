import Tabs from "@components/extras/tabs";
import { useSignal } from "@preact/signals";
import DemoAccordion from "./demo-accordion";
import DemoAlert from "./demo-alert";
import DemoAvatar from "./demo-avatar";
import DemoBadge from "./demo-badge";
import DemoBreadcrumbs from "./demo-breadcrumbs";
import DemoButtons from "./demo-buttons";
import DemoCards from "./demo-cards";
import DemoDropdown from "./demo-dropdown";
import DemoImage from "./demo-image";
import DemoLoader from "./demo-loader";
import DemoModal from "./demo-modal";
import DemoPaginator from "./demo-paginator";
import DemoProgress from "./demo-progress";
import DemoSlider from "./demo-slider";
import DemoTimeline from "./demo-timeline";
import DemoToggle from "./demo-toggle";
import DemoTooltip from "./demo-tooltip";
import DemoTypography from "./demo-typography";
import DemoVideo from "./demo-video";

type ActiveTabType =
    | "buttons"
    | "cards"
    | "feedback"
    | "data-display"
    | "navigation"
    | "inputs"
    | "overlays"
    | "media"
    | "typography";

function DemoTabs() {
    const activeTab = useSignal<ActiveTabType>("buttons");
    return (
        <Tabs
            activeTab={activeTab.value}
            onTabChange={(tab) => {
                activeTab.value = tab as ActiveTabType;
            }}
            tabs={[
                { label: "Buttons", id: "buttons", content: <DemoButtons /> },
                { label: "Cards", id: "cards", content: <DemoCards /> },
                {
                    label: "Feedback",
                    id: "feedback",
                    content: (
                        <div className="flex flex-col gap-12">
                            <DemoBadge />
                            <hr className="border-border" />
                            <DemoAlert />
                            <hr className="border-border" />
                            <DemoLoader />
                        </div>
                    ),
                },
                {
                    label: "Data Display",
                    id: "data-display",
                    content: (
                        <div className="flex flex-col gap-12">
                            <DemoAvatar />
                            <hr className="border-border" />
                            <DemoProgress />
                            <hr className="border-border" />
                            <DemoAccordion />
                            <hr className="border-border" />
                            <DemoTimeline />
                        </div>
                    ),
                },
                {
                    label: "Navigation",
                    id: "navigation",
                    content: (
                        <div className="flex flex-col gap-12">
                            <DemoBreadcrumbs />
                            <hr className="border-border" />
                            <DemoDropdown />
                            <hr className="border-border" />
                            <DemoPaginator />
                        </div>
                    ),
                },
                {
                    label: "Inputs",
                    id: "inputs",
                    content: (
                        <div className="flex flex-col gap-12">
                            <DemoToggle />
                            <hr className="border-border" />
                            <DemoSlider />
                        </div>
                    ),
                },
                {
                    label: "Overlays",
                    id: "overlays",
                    content: (
                        <div className="flex flex-col gap-12">
                            <DemoModal />
                            <hr className="border-border" />
                            <DemoTooltip />
                        </div>
                    ),
                },
                {
                    label: "Media",
                    id: "media",
                    content: (
                        <div className="flex flex-col gap-12">
                            <DemoImage />
                            <hr className="border-border" />
                            <DemoVideo />
                        </div>
                    ),
                },
                {
                    label: "Typography",
                    id: "typography",
                    content: <DemoTypography />,
                },
            ]}
        />
    );
}

export default DemoTabs;
