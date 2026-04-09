import React from "react";

function getFieldDescriptionIds(field) {
  const ids = [];
  if (field.help_text) {
    ids.push(`${field.name}-help`);
  }
  if (field.errors?.length) {
    ids.push(`${field.name}-error`);
  }
  return ids.join(" ") || undefined;
}

export function ErrorNotice({ errors }) {
  if (!errors?.length) {
    return null;
  }

  return (
    <div className="alert alert-danger" role="alert">
      {errors.map((error, index) => <div key={index}>{error}</div>)}
    </div>
  );
}

function getInputEnhancements(field) {
  const autocompleteMap = {
    username: "username",
    email: "email",
    password: "current-password",
    confirm_password: "new-password",
    first_name: "given-name",
    last_name: "family-name",
    phone_number: "tel",
    institute: "organization",
    department: "organization-title",
    location: "address-level2",
    state: "address-level1",
  };

  return {
    autoComplete: autocompleteMap[field.name],
    inputMode: field.name === "phone_number" ? "tel" : undefined,
  };
}

export function FormField({ field }) {
  const describedBy = getFieldDescriptionIds(field);
  const enhancements = getInputEnhancements(field);

  const commonProps = {
    id: field.name,
    name: field.name,
    defaultValue: field.value,
    required: field.required,
    placeholder: field.placeholder || "",
    className: "form-control",
    "aria-invalid": field.errors?.length ? "true" : "false",
    "aria-describedby": describedBy,
    autoComplete: enhancements.autoComplete,
    inputMode: enhancements.inputMode,
  };

  let control = null;

  if (field.type === "textarea") {
    control = <textarea {...commonProps} />;
  } else if (field.type === "select") {
    control = (
      <select {...commonProps}>
        {field.options?.map((option, index) => (
          option.options ? (
            <optgroup key={index} label={option.label}>
              {option.options.map((child) => (
                <option key={child.value} value={child.value}>{child.label}</option>
              ))}
            </optgroup>
          ) : (
            <option key={option.value} value={option.value}>{option.label}</option>
          )
        ))}
      </select>
    );
  } else if (field.type === "checkbox") {
    control = (
      <label className="checkbox-card compact" htmlFor={field.name}>
        <input
          id={field.name}
          name={field.name}
          type="checkbox"
          defaultChecked={field.checked}
          aria-invalid={field.errors?.length ? "true" : "false"}
          aria-describedby={describedBy}
        />
        <span>{field.label}</span>
      </label>
    );
  } else {
    const type = field.type === "textfield" ? "text" : field.type;
    control = <input {...commonProps} type={type} />;
  }

  return (
    <div className={`field-group ${field.required && field.type !== "checkbox" ? "required" : ""}`}>
      {field.type !== "checkbox" ? <label htmlFor={field.name}>{field.label}</label> : null}
      {control}
      {field.help_text ? <small className="form-helptext" id={`${field.name}-help`}>{field.help_text}</small> : null}
      {field.errors?.length ? (
        <ul className="errorlist" id={`${field.name}-error`}>
          {field.errors.map((error, index) => <li key={index}>{error}</li>)}
        </ul>
      ) : null}
    </div>
  );
}
