import { useMemo, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";

interface Props {
  label: string;
  value: number;
  onChange: (n: number) => void;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  error?: string;
  maxlength?: number;
  suffix?: string;
  autocomplete?: string;
}

export function EnergyInput({
  label,
  value,
  onChange,
  disabled = false,
  required = false,
  id,
  error,
  maxlength = 10,
  autocomplete = "off",
  suffix = "kW",
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const displayText = isEditing ? editingText : value.toString();

  const sanitizeRegex = useMemo(() => /[^0-9]/g, []);
  const sanitizeRaw = (rawText: string): string =>
    rawText.replace(sanitizeRegex, "");

  const commitValue = (rawText: string): void => {
    const raw = sanitizeRaw(rawText);
    onChange(raw === "" ? 0 : Number(raw));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const raw = sanitizeRaw(e.target.value);
    setEditingText(raw);
    onChange(raw === "" ? 0 : Number(raw));
  };

  const handleFocus = (): void => {
    setIsEditing(true);
    setEditingText(value ? value.toString() : "");
  };

  const handleBlur = (): void => {
    setIsEditing(false);
    commitValue(editingText);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.ctrlKey || e.metaKey) return;

    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
      "Tab",
    ];
    const isNumber = /^[0-9]$/.test(e.key);
    const isAllowed = allowedKeys.includes(e.key);

    if (!isNumber && !isAllowed) e.preventDefault();
  };

  const borderClass = error ? "border-red-500" : "border-gray-300";
  const focusRingClass = disabled
    ? ""
    : "focus-within:ring-2 focus-within:ring-gray-100";
  const bgClass = disabled ? "bg-gray-100" : "bg-white";

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-800">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>

      <div
        className={[
          "grid grid-cols-[1fr_auto] items-stretch",
          "h-10 rounded-md border",
          borderClass,
          bgClass,
          focusRingClass,
          disabled ? "cursor-not-allowed" : "",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={displayText}
          maxLength={maxlength}
          autoComplete={autocomplete}
          disabled={disabled}
          inputMode="numeric"
          className={[
            "w-full h-full bg-transparent",
            "px-3 py-2 text-left text-base outline-none font-mono",
            disabled ? "text-gray-600" : "text-gray-900",
          ].join(" ")}
          onFocus={handleFocus}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />

        {suffix && (
          <div
            className={[
              "h-full flex items-center",
              "px-3 text-sm font-medium whitespace-nowrap select-none",
              "border-l",
              error ? "border-red-300" : "border-gray-200",
              disabled ? "text-gray-500" : "text-gray-600",
              disabled ? "bg-gray-100" : "bg-gray-50",
              "rounded-r-md",
            ].join(" ")}
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
