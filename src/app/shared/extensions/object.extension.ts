export function toFormData(object: any): FormData {
  const formData = new FormData();

  Object.keys(object).forEach(key => {
    const value = object[key];
    if (value === null || value === undefined) return;
    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else if (typeof value === 'object' && !(value instanceof File)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });

  return formData;
}

