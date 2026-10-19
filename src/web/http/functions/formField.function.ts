/** A field's text, or undefined when the form did not send it, which is how an untouched hidden field must look. */
export const formField = (fields: URLSearchParams, name: string): string | undefined => fields.get(name) ?? undefined;
