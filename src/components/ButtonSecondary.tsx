import type { ComponentChildren, JSX } from "preact";

interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
	label?: string;
	className?: string;
	variant?: "primary" | "secondary";
	type?: "button" | "submit" | "reset";
	children?: ComponentChildren;
	text?: string;
	disabled?: boolean;
}

export default function ButtonSecondary({ label, className = "", variant = "primary", type = "button", children, text, disabled, ...rest }: Props) {
	const baseStyles =
		"text-xs px-10 lg:text-sm font-semibold rounded-[0.4rem] border py-[0.8rem] lg:py-[0.7rem] transition-colors duration-300 ease-in-out flex justify-center items-center select-none shadow-md cursor-pointer tracking-wider";

	const variantStyles = {
		primary: "bg-white hover:bg-primary border-secondary text-primary hover:text-white",
		secondary: "bg-primary text-white border-primary hover:bg-white hover:text-primary",
	};

	const content = children || label || text;

	return (
		<button
			type={type}
			disabled={disabled}
			className={`${baseStyles} ${variantStyles[variant]} ${className}`}
			{...rest}
		>
			{content}
		</button>
	);
}
