export function setValidationError({
  graphQLErrors,
  setError,
  useFormName,
  manyNames,
  setting
}: {
  graphQLErrors: any,
  setError: any,
  useFormName?: any,
  manyNames?: any,
  setting?: any
}) {
  const vali = graphQLErrors?.[0]?.extensions;

  if (vali?.category === "validation") {
    const validation = Object.entries(vali.validation).map(
      ([key, messages]: any) => ({
        message: messages[0],
        name: key,
      })
    );

    validation.forEach(({ name, message }) => {
      let fieldName = name;

      if (name.includes(`input.${useFormName}`)) {
        fieldName = name.split(".")[2];
      } else if (name.includes("input.")) {
        fieldName =
          (manyNames || setting)
            ? getValidationNameForMany(name.split("."), setting)
            : name.split(".")[1];
      } else {
        fieldName = name;
      }

      if (fieldName === "images") {
        fieldName = "fileName";
      }

      setError(fieldName, {
        type: "required",
        message: message,
        shouldFocus: true,
      });
    });
  }
}

function getValidationNameForMany(params: any, setting: any) {
  const names = params.slice(1);
  return setting ? names.join(".") : names.join("");
}
