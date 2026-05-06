import { Children } from 'react';

export default function Input({
	name,
	defaultValue,
	value,
	onChange,
	type = 'text',
	placeholder = '',
	className = '',
	children,
	icon,
}) {
	const baseStyles =
		'group flex w-full flex-row gap-2 items-center bg-white border border-brand-200 rounded-lg shadow-sm transition-all duration-200 focus-within:ring-4 focus-within:ring-brand-600/10 focus-within:border-brand-600';
	const childArray = Children.toArray(children);
	const hasTwoChildren = childArray.length >= 2;

	return (
		<div className={`${baseStyles} ${className}`}>
			{hasTwoChildren ? childArray[1] : childArray[0]}
			<input
				type={type}
				name={name}
				defaultValue={defaultValue}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				className={`w-full p-2 focus:outline-none ${icon ? 'pl-0' : ''}`}
			/>
		</div>
	);
}
