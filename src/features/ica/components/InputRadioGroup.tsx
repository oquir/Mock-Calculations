import type { RadioOption } from "../logic/types";

interface InputRadioGroupProps {
  label: string;
  options: RadioOption[];
  selectedValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  showExtraOn?: string;
  extraPlaceholder?: string;
  extraValue?: string;
  onExtraChange?: (val: string) => void;
}

export function InputRadioGroup({
  label,
  options,
  selectedValue,
  onChange,
  disabled = false,
  showExtraOn,
  extraPlaceholder = "Especifique...",
  extraValue,
  onExtraChange,
}: InputRadioGroupProps) {
  return (
    <div className="flex flex-col gap-3 py-3 border-b border-gray-100 last:border-0">
      {/* Contenedor principal: Vertical en móvil, Horizontal en desktop */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <label className="text-sm font-medium text-gray-700 leading-tight">
          {label}
        </label>

        {/* Grupo de botones: Se ajusta al ancho en móvil si es necesario */}
        <div className="flex bg-gray-100 p-1 rounded-lg self-start sm:self-center overflow-x-auto max-w-full">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange?.(option.value)}
              className={`px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap disabled:cursor-not-allowed
                ${
                  selectedValue === option.value
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                } `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input de texto extra: Siempre ocupa el ancho total */}
      {selectedValue === showExtraOn && (
        <div className="mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
          <input
            type="text"
            placeholder={extraPlaceholder}
            value={extraValue ?? ""}
            onChange={(e) => onExtraChange?.(e.target.value)}
            className="w-full bg-white text-sm p-2.5 border border-gray-200 rounded-md outline-none transition-all focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-gray-900"
          />
        </div>
      )}
    </div>
  );
}
