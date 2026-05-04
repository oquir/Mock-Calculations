import { useRef } from "react";

interface Props {
  label: string;
  value: number;
  id?: string;
  error?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
  showRadioButtons?: boolean;
  radioLabel?: string;
  selectedValue?: "Si" | "No";
  onValueChange?: (value: "Si" | "No") => void;
}

export function Output({
  label,
  value,
  id,
  error,
  prefix = "",
  suffix,
  className = "",
  showRadioButtons = false,
  radioLabel,
  selectedValue,
  onValueChange,
}: Props) {
  const outputRef = useRef<HTMLOutputElement>(null);

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-800">
        {label}
      </label>

      {showRadioButtons && radioLabel && (
        <div className="mt-2">
          <label className="text-sm font-medium text-gray-700 block mb-2">
            {radioLabel}
          </label>
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name={`${id}-radio`}
                value="Si"
                checked={selectedValue === "Si"}
                onChange={() => onValueChange?.("Si")}
                className="w-4 h-4 text-blue-600 cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-700">Si</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name={`${id}-radio`}
                value="No"
                checked={selectedValue === "No"}
                onChange={() => onValueChange?.("No")}
                className="w-4 h-4 text-blue-600 cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-700">No</span>
            </label>
          </div>
        </div>
      )}

      <div
        className={`
          flex items-stretch rounded-md border
          ${error ? "border-red-500" : "border-gray-300"}
          bg-gray-100
          overflow-hidden
          ${className}
        `}
      >
        {/* Prefix */}
        {prefix && (
          <span
            className="px-3 flex items-center select-none text-gray-600"
            aria-hidden="true"
          >
            {prefix}
          </span>
        )}

        {/* Value */}
        <output
          ref={outputRef}
          id={id}
          tabIndex={-1}
          className="block w-full min-w-0 bg-transparent px-2 py-2 text-left text-base outline-none font-mono text-gray-600 cursor-text select-text whitespace-nowrap overflow-hidden text-ellipsis"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          role="textbox"
          aria-readonly="true"
        >
          {value}
        </output>

        {/* Suffix */}
        {suffix && (
          <div
            className="px-3 flex items-center text-sm text-gray-600 bg-gray-50 border-l border-gray-200 select-none whitespace-nowrap"
            aria-hidden="true"
          >
            {suffix}
          </div>
        )}
      </div>

      {error && (
        <span id={`${id}-error`} className="text-xs text-red-600" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
