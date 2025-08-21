import React from 'react'
import { FormControl, InputLabel, Select, MenuItem, FormHelperText, SelectProps } from '@mui/material'
import { Controller, Control, FieldPath, FieldValues } from 'react-hook-form'

interface SelectOption {
  value: string | number
  label: string
}

interface FormSelectProps<T extends FieldValues> extends Omit<SelectProps, 'name' | 'value' | 'onChange'> {
  name: FieldPath<T>
  control: Control<T>
  label: string
  options: SelectOption[]
  placeholder?: string
}

function FormSelect<T extends FieldValues>({
  name,
  control,
  label,
  options,
  placeholder,
  ...selectProps
}: FormSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth error={!!error} variant="outlined">
          <InputLabel
            sx={{
              '&.Mui-focused': {
                color: '#DC143C',
              },
            }}
          >
            {label}
          </InputLabel>
          <Select
            {...field}
            {...selectProps}
            label={label}
            displayEmpty={!!placeholder}
            sx={{
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#DC143C',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#DC143C',
              },
              ...selectProps.sx,
            }}
          >
            {placeholder && (
              <MenuItem value="" disabled>
                <em>{placeholder}</em>
              </MenuItem>
            )}
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  )
}

export default FormSelect
