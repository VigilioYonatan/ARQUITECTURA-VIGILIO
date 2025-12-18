import Button from "@components/extras/button";
import ConfirmModal from "@components/extras/confirm-modal";
import Modal from "@components/extras/modal";
import { useSignal } from "@preact/signals";

export default function DemoModal() {
    const isOpen = useSignal(false);
    const isConfirmOpen = useSignal(false);

    return (
        <div className="flex flex-col gap-8">
            <h3 className="text-xl font-bold">Modals</h3>
            <div className="flex gap-4">
                <div className="space-y-2">
                    <p className="font-medium">Standard Modal</p>
                    <Button
                        onClick={() => {
                            isOpen.value = true;
                        }}
                    >
                        Open Modal
                    </Button>
                    <Modal
                        isOpen={isOpen.value}
                        onClose={() => {
                            isOpen.value = false;
                        }}
                    >
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold">Hello World</h2>
                            <p className="text-muted-foreground">
                                This is a standard modal with custom content.
                            </p>
                            <div className="flex justify-end pt-4">
                                <Button
                                    onClick={() => {
                                        isOpen.value = false;
                                    }}
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    </Modal>
                </div>

                <div className="space-y-2">
                    <p className="font-medium">Confirm Modal</p>
                    <Button
                        variant="danger"
                        onClick={() => {
                            isConfirmOpen.value = true;
                        }}
                    >
                        Delete Item
                    </Button>
                    <ConfirmModal
                        isOpen={isConfirmOpen.value}
                        onClose={() => {
                            isConfirmOpen.value = false;
                        }}
                        onConfirm={() => {
                            alert("Confirmed!");
                            isConfirmOpen.value = false;
                        }}
                        title="Are you sure?"
                        message="This action cannot be undone. This will permanently delete the item."
                        type="danger"
                        confirmText="Delete"
                    />
                </div>
            </div>
        </div>
    );
}
