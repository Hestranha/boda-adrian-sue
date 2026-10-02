import type { JSX } from "preact";

interface Props extends JSX.HTMLAttributes<HTMLTextAreaElement> {
	className?: string;
	isValid?: boolean;
	name?: string;
	placeholder?: string;
	value?: string;
}

export default function TextArea({ className = "", isValid = true, onInput, ...rest }: Props) {
	return (
		<textarea
			className={`w-full h-28 resize-none border py-2 px-4 hover:bg-input-hover hover:border-input-border-focus text-sm rounded-md focus:outline-none focus:bg-input-bg placeholder-primary focus:border-input-border-focus transition-colors ${
				isValid ? "bg-input-bg border-transparent" : "bg-status-error-bg border-status-error"
			} ${className}`}
			onInput={onInput}
			{...rest}
		></textarea>
	);
}
