import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

// ---------- Contexts ----------

const FormFieldContext = React.createContext({})
const FormItemContext = React.createContext({})

// ---------- Hooks ----------

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext?.name) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const id = itemContext.id

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

// ---------- Components ----------

function FormField({ name, children }) {
  return (
    <FormFieldContext.Provider value={{ name }}>
      {children}
    </FormFieldContext.Provider>
  )
}

function FormItem({ className, ...props }) {
  const id = React.useId()
  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
}

function FormLabel({ className, ...props }) {
  const { error, formItemId } = useFormField()

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

function FormControl(props) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
}

function FormDescription({ className, ...props }) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function FormMessage({ className, ...props }) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : ""

  if (!body) return null

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-sm text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
}

// ---------- Exports ----------

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
