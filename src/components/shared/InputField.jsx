const InputField = ({
    label,
    id,
    name,
    type,
    errors,
    register,
    required,
    message,
    className,
    min,
    value,
    placeholder,
    validation,
}) => {
    const fieldId = id || name;
    
    return (
        <div className="flex flex-col gap-1 w-full">
            <label
                htmlFor={fieldId}
                className={`${
                    className ? className : ""
                } font-semibold text-sm text-slate-800`}>
                {label}
            </label>
            <input
                type={type}
                id={fieldId}
                placeholder={placeholder}
                className={`${
                    className ? className : ""
                } px-2 py-2 border outline-none bg-transparent text-slate-800 rounded-md ${
                    errors[fieldId]?.message ? "border-red-500" : "border-slate-700"
                }`}
                {...register(fieldId, validation || {
                    required: { value: required, message },
                    minLength: min 
                        ? { value: min, message: `Minimum ${min} characters is required` }
                        : null,
                    pattern:
                        type === "email"
                            ? {
                                value: /^[a-zA-Z0-9._%+-]+@binus\.ac\.id$/,
                                message: "Invalid email"
                            }
                            : type === "url"
                            ? {
                                value: /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})(\/\S*)?$/,
                                message: "Please enter a valid url"
                            }
                            : null,
                })}
            />

            {errors[fieldId]?.message && (
                <p className="text-sm font-semibold text-red-600 mt-0">
                    {errors[fieldId]?.message}
                </p>
            )}
        </div>
    );
};

export default InputField;