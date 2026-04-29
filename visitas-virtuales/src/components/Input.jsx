import { Children } from "react";

export default function Input({ name, defaultValue, value, onChange, type = 'text', placeholder = '', className = '' , children }) {
    const baseStyles = "group flex w-full flex-row gap-2 items-center bg-white border border-slate-200 rounded-lg shadow-sm transition-all duration-200 focus-within:ring-4 focus-within:ring-blue-600/10 focus-within:border-blue-600";
    const childArray = Children.toArray(children);
    const hasTwoChildren = childArray.length >= 2;

    return (
      <div className={`${baseStyles} ${className}`}>
        {hasTwoChildren && childArray[0]}
        <input
          type={type}
          name={name}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full p-2 outline-none bg-transparent"
        />
        {hasTwoChildren ? childArray[1] : childArray[0]}
      </div>
    );
}