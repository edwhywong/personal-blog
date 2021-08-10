import { FieldError } from "../generated/graphql";

export const fieldErrorsToFormError = (fieldErrors: Array<FieldError>) => {
  let formError: Record<string, string> = {};
  fieldErrors.forEach((err) => {
    formError[err.field] = err.message;
  });
  return formError;
};
