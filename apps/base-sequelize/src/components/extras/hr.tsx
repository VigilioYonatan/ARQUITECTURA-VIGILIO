interface HrProps {
	className?: string;
}
function Hr({ className }: HrProps) {
	return <div className={`border-t border-border w-full my-1 ${className}`} />;
}

export default Hr;
