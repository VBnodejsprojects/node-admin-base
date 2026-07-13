export const processFormData = (payload, formData = new FormData(), parentKey = "") => {
    Object.entries(payload).forEach(([key, value]) => {
        const finalKey = parentKey ? `${parentKey}[${key}]` : key;

        if (value === null || value === undefined) return;

        // Handle File
        if (value instanceof File) {
            formData.append(finalKey, value);
        }
        // Handle Array
        else if (Array.isArray(value)) {
            value.forEach((item, idx) => {
                const arrayKey = `${finalKey}[${idx}]`;

                if (item instanceof File) {
                    formData.append(arrayKey, item);
                } else if (typeof item === "object" && item !== null) {
                    processFormData(item, formData, arrayKey);
                } else {
                    formData.append(arrayKey, item);
                }
            });
        }
        // Handle nested object
        else if (typeof value === "object") {
            processFormData(value, formData, finalKey);
        }
        // Primitive values
        else {
            formData.append(finalKey, value);
        }
    });

    return formData;
};
