import { useMemo, useRef } from "react";
import { formatMoney } from "../../../shared/utils/money";

type Props = {
  label: string;
  value: number;
  id?: string;
  error?: string;
  prefix?: string;
  className?: string;
};

export function MoneyOutput({
  label,
  value,
  id,
  error,
  prefix = "$",
  className = "",
}: Props) {
  const formattedValue = useMemo(() => formatMoney(value), [value]);
  const outputRef = useRef<HTMLOutputElement>(null);

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-800">
        {label}
      </label>

      <div
        className={`
          flex items-center rounded-md border
          ${error ? "border-red-500" : "border-gray-300"}
          bg-gray-100
          ${className}
        `}
      >
        <span className="px-3 select-none text-gray-600" aria-hidden="true">
          {prefix}
        </span>

        <output
          ref={outputRef}
          id={id}
          tabIndex={0}
          className="block w-full min-w-0 bg-transparent px-2 py-2 text-left text-base outline-none font-mono text-gray-600 cursor-text select-text whitespace-nowrap overflow-hidden text-ellipsis rounded"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          role="textbox"
          aria-readonly="true"
        >
          {formattedValue}
        </output>
      </div>

      {error && (
        <span id={`${id}-error`} className="text-xs text-red-600" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
