import {
  useForm,
  PreserveBoundary,
  useFormData,
} from "@conform-to/react/future";
import { parseWithZod } from "@conform-to/zod/v4";
import { coerceFormValue } from "@conform-to/zod/v4/future";
import { useState } from "react";
import z from "zod";

const schema = coerceFormValue(
  z.object({
    name: z.string(),
    email: z.string(),
    address: z.string(),
    city: z.string(),
  }),
);

function App() {
  const [step, setStep] = useState(1);
  const { form, fields } = useForm(schema, {
    defaultValue: {
      name: "John Doe",
      email: "john.doe@mail.com",
      address: "123 Main St",
      city: "Anytown",
    },
    onSubmit: (e, ctx) => {
      e.preventDefault();
      console.log("Submitted value", ctx.value);
    },
  });

  const submission = useFormData(form.id, (formData) => {
    const submission = parseWithZod(formData, { schema });

    if (submission.status === "success") {
      console.log("Valid submission", submission.value);
      return {
        status: "success",
        value: submission.value,
        error: null,
      };
    }

    console.error("Validation errors", {
      error: submission.error,
      nameCount: formData.getAll("name").length,
      emailCount: formData.getAll("email").length,
      addressCount: formData.getAll("address").length,
      cityCount: formData.getAll("city").length,
    });

    return {
      status: "error",
      value: null,
      error: submission.error,
    };
  });

  return (
    <form {...form.props}>
      {step === 1 ? (
        <PreserveBoundary name="step-1">
          <label>
            Name
            <input
              name={fields.name.name}
              defaultValue={fields.name.defaultValue}
            />
          </label>
          <label>
            Email
            <input
              name={fields.email.name}
              defaultValue={fields.email.defaultValue}
            />
          </label>
        </PreserveBoundary>
      ) : step === 2 ? (
        <PreserveBoundary name="step-2">
          <label>
            Address
            <input
              name={fields.address.name}
              defaultValue={fields.address.defaultValue}
            />
          </label>
          <label>
            City
            <input
              name={fields.city.name}
              defaultValue={fields.city.defaultValue}
            />
          </label>
        </PreserveBoundary>
      ) : null}

      <div>
        {step > 1 ? (
          <button type="button" onClick={() => setStep(step - 1)}>
            Previous
          </button>
        ) : null}
        {step < 2 ? (
          <button type="button" onClick={() => setStep(step + 1)}>
            Next
          </button>
        ) : step === 2 ? (
          <button type="submit">Submit</button>
        ) : null}
      </div>
      <pre><code>{JSON.stringify(submission,null,2)}</code></pre>
    </form>
  );
}

export default App;
