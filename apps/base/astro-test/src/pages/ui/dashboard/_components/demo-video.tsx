import Video from "@components/extras/video";

export default function DemoVideo() {
    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold">Video Player</h3>
            <div className="max-w-2xl bg-black rounded-xl overflow-hidden shadow-lg">
                <Video
                    src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
                    title="Sintel Trailer"
                />
            </div>
        </div>
    );
}
