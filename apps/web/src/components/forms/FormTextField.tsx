import React from 'react'
import { TextField, TextFieldProps } from '@mui/material'
import { Controller, Control, FieldPath, FieldValues } from 'react-hook-form'

interface FormTextFieldProps<T extends FieldValues> extends Omit<TextFieldProps, 'name' | 'value' | 'onChange'> {
  name: FieldPath<T>
  control: Control<T>
  label: string
  placeholder?: string
  type?: string
  multiline?: boolean
  rows?: number
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
}

function FormTextField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = 'text',
  multiline = false,
  rows,
  startAdornment,
  endAdornment,
  ...textFieldProps
}: FormTextFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...textFieldProps}
          label={label}
          placeholder={placeholder}
          type={type}
          multiline={multiline}
          rows={rows}
          error={!!error}
          helperText={error?.message}
          fullWidth
          variant="outlined"
          InputProps={{
            startAdornment,
            endAdornment,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#DC143C',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#DC143C',
              },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#DC143C',
            },
            ...textFieldProps.sx,
          }}
        />
      )}
    />
  )
}

export default FormTextField
