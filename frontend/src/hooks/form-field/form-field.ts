import { ChangeEvent, useCallback, useEffect, useState } from "react"

export const useFormField = (initialValue?: string, validator?: (value: string) => boolean) => {
  const [value, setValue] = useState(initialValue ?? '')
  const [isValueValid, setIsValueValid] = useState(false)
  const [isDone, setIsDone] = useState(false)
  
  useEffect(() => {
    if (validator) {
      if (validator(value)) {
        setIsValueValid(true)
        return
      }

      setIsValueValid(false)
      return
    }

    setIsValueValid(true)
  }, [value, validator])
  
  function handleValueChange(e: ChangeEvent<HTMLInputElement>) {
    const { value: eventValue } = e.target;
    setValue(eventValue);
  }

  const onBlur = useCallback(() => setIsDone(true), [])

  return { value, isValid: isValueValid, handleChange: handleValueChange, onBlur, isDone }
}
