import { useMemo, useRef, useState } from "react";
import {
  formatMoney,
  parseMoney,
  roundTo1000,
} from "../../../shared/utils/money";

type Props = {
  label: string;
  value: number;
  onChange: (n: number) => void;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  error?: string;
  maxlength?: number;
  autocomplete?: string;
  roundToThousands?: boolean;
};

export function MoneyInput({
  label,
  value,
  onChange,
  disabled = false,
  required = false,
  id,
  error,
  maxlength = 20,
  autocomplete = "off",
  roundToThousands = true,
}: Props) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingText, setEditingText] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  // ✅ Memoizar el texto formateado
  const formattedValue = useMemo(() => formatMoney(value), [value]);

  // ✅ Texto visible derivado (sin estado duplicado)
  const displayText = isEditing ? editingText : formattedValue;

  // ✅ Regex simple: números
  const sanitizeRegex = useMemo(() => /[^0-9]/g, []);

  // ✅ Sanitizar input
  const sanitizeRaw = (rawText: string): string =>
    rawText.replace(sanitizeRegex, "");

  // ✅ Commit final (blur)
  const commitValue = (rawText: string): void => {
    const raw = sanitizeRaw(rawText);
    let numeric = parseMoney(raw);

    if (roundToThousands) {
      numeric = roundTo1000(numeric);
    }

    onChange(numeric);
  };

  // ✅ Cambio en vivo
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const raw = sanitizeRaw(e.target.value);
    setEditingText(raw);

    onChange(parseMoney(raw));
  };

  // ✅ Focus: iniciar edición sin formato
  const handleFocus = (): void => {
    setIsEditing(true);
    setEditingText(value.toString());
  };

  // ✅ Blur: finalizar edición
  const handleBlur = (): void => {
    setIsEditing(false);
    commitValue(editingText);
  };

  // ✅ Control de teclado
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
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

    if (!isNumber && !isAllowed) {
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-800">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>

      <div
        className={`
          flex items-center rounded-md border
          ${error ? "border-red-500" : "border-gray-300"}
          ${
            disabled
              ? "bg-gray-100"
              : "bg-white focus-within:ring-2 focus-within:ring-gray-100"
          }
        `}
      >
        <span
          className={`px-3 select-none ${
            disabled ? "text-gray-600" : "text-black"
          }`}
          aria-hidden="true"
        >
          $
        </span>
        
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={displayText}
          maxLength={maxlength}
          autoComplete={autocomplete}
          disabled={disabled}
          inputMode="numeric"
          className={`w-full bg-transparent px-2 py-2 text-left text-base outline-none font-mono ${
            disabled ? "text-gray-600 cursor-not-allowed" : "text-gray-900"
          }`}
          onFocus={handleFocus}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>

      {error && (
        <span id={`${id}-error`} className="text-xs text-red-600" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
