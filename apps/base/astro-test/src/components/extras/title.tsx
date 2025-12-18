interface TitleProps {
    title: string;
    subtitle?: string;
    isPrimary?: boolean;
}
function Title({ title, subtitle, isPrimary = false }: TitleProps) {
    const isPrimaryTitle = isPrimary
        ? "text-xl sm:text-2xl md:text-3xl font-bold relative text-gradient-animated bg-gradient-to-r from-primary to-white/5 bg-clip-text text-transparent"
        : "text-xl sm:text-2xl md:text-3xl font-bold text-foreground";
    return (
        <div className="flex flex-col gap-1">
            <h3 className={isPrimaryTitle}>{title}</h3>
            {subtitle && (
                <p className="text-muted-foreground text-sm">{subtitle}</p>
            )}
        </div>
    );
}
export default Title;
