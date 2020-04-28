import Field, { FieldProps } from '../Field'
import styles from './styles.css'

/**
 *
 * Usage:
 *
 * ```jsx
 *   <Form.PinInput
 *     type="email"
 *     error="xxx"
 *     hint="xxx"
 *     ...other <input> props...
 *   />
 * ```
 *
 */

type PinInputProps = {
  type: 'text' | 'password' | 'email' | 'number'
  name: string
} & Omit<FieldProps, 'fieldMsgId'> &
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >

const PinInput: React.FC<PinInputProps> = ({
  type,

  name,
  label,
  extraButton,

  hint,
  error,

  ...inputProps
}) => {
  const fieldId = `field-${name}`
  const fieldMsgId = `field-msg-${name}`

  return (
    <Field>
      <Field.Header htmlFor={fieldId} label={label} extraButton={extraButton} />

      <Field.Content>
        <input
          {...inputProps}
          name={name}
          type={type}
          aria-describedby={fieldMsgId}
          autoComplete="nope"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </Field.Content>

      <Field.Footer fieldMsgId={fieldMsgId} hint={hint} error={error} />

      <style jsx>{styles}</style>
    </Field>
  )
}

export default PinInput
