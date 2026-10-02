import type { JSX } from "preact";

interface Props extends JSX.HTMLAttributes<HTMLInputElement> {
	id?: string;
	name: string;
	placeholder?: string;
	value?: string;
	isValid?: boolean;
	maxLength?: number;
	numeric?: boolean;
	className?: string;
}

export default function TextInput({ id, name, placeholder = "", value = "", isValid = true, maxLength, numeric, className = "", onInput, ...rest }: Props) {
	const handleInput = (e: JSX.TargetedEvent<HTMLInputElement, InputEvent>) => {
		const target = e.currentTarget;
		if (numeric) {
			target.value = target.value.replace(/\D/g, "");
		}
		if (onInput) {
			onInput(e);
		}
	};

	return (
		<input
			id={id}
			name={name}
			type='text'
			inputMode={numeric ? "numeric" : "text"}
			pattern={numeric ? "[0-9]*" : undefined}
			placeholder={placeholder}
			value={value}
			autoComplete='off'
			maxLength={maxLength}
			onInput={handleInput}
			className={`w-full border py-1.5 px-4 hover:bg-input-hover hover:border-input-border-focus text-sm rounded-md focus:outline-none focus:bg-input-bg placeholder-primary focus:border-input-border-focus ${
				isValid ? "bg-input-bg border-transparent" : "bg-status-error-bg border-status-error"
			} ${className}`}
			{...rest}
		/>
	);
}
