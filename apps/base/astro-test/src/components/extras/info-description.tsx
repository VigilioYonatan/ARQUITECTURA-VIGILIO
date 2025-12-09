interface InfoDescriptionProps {
	title: string;
	content: string;
}
function InfoDescription({ title, content }: InfoDescriptionProps) {
	return (
		<div>
			<h3 className="font-medium text-gray-700 mb-2">{title}</h3>
			<p className="text-gray-600 max-h-[300px] overflow-y-auto">{content}</p>
		</div>
	);
}
export default InfoDescription;
