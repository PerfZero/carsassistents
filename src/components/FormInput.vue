<template>
  <div class="mb-4">
    <label class="block mb-1 font-normal text-[14px] leading-[129%] text-[#828282]">{{ label }}</label>
    <input
      ref="inputRef"
      :type="type"
      :placeholder="placeholder"
      :value="displayValue"
      @input="handleInput"
      @blur="handleBlur"
      @keydown="handleKeydown"
      @paste="handlePaste"
      class="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 transition-colors"
      :class="touched && error ? 'border border-red-500 focus:ring-red-500' : 'border border-gray-300 focus:ring-[#204A8A]'"
    />
    <p v-if="touched && error" class="mt-1 text-xs text-red-500">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  touched: {
    type: Boolean,
    default: false
  },
  error: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: ''
  },
  useMask: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'input', 'blur'])

const inputRef = ref(null)
const cursorPosition = ref(0)

const extractDigits = (value) => {
  let digits = value.replace(/\D/g, '')
  if (digits.length > 0 && (digits[0] === '7' || digits[0] === '8')) {
    digits = digits.slice(1)
  }
  return digits.slice(0, 10)
}

const formatPhone = (digits) => {
  if (!digits || digits.length === 0) {
    return ''
  }
  
  const d = digits
  if (d.length <= 3) {
    return `+7 (${d}`
  } else if (d.length <= 6) {
    return `+7 (${d.slice(0, 3)}) ${d.slice(3)}`
  } else if (d.length <= 8) {
    return `+7 (${d.slice(0, 3)}) ${d.slice(3, 6)} ${d.slice(6)}`
  } else {
    return `+7 (${d.slice(0, 3)}) ${d.slice(3, 6)} ${d.slice(6, 8)} ${d.slice(8)}`
  }
}

const getDigitPosition = (formatted, targetDigitIndex) => {
  let digitCount = 0
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      if (digitCount === targetDigitIndex) {
        return i + 1
      }
      digitCount++
    }
  }
  return formatted.length
}

const displayValue = computed(() => {
  if (props.useMask && props.type === 'tel') {
    return formatPhone(props.modelValue)
  }
  return props.modelValue
})

const handleInput = (event) => {
  const value = event.target.value
  
  if (props.useMask && props.type === 'tel') {
    const oldDigits = props.modelValue
    const newDigits = extractDigits(value)
    
    console.log('FormInput handleInput (masked):', { 
      input: value,
      oldDigits,
      newDigits
    })
    
    const formatted = formatPhone(newDigits)
    const currentPos = inputRef.value?.selectionStart || 0
    const oldFormatted = formatPhone(oldDigits)
    
    if (oldDigits !== newDigits || value !== formatted) {
      emit('update:modelValue', newDigits)
      emit('input', newDigits)
      
      nextTick(() => {
        if (inputRef.value) {
          const digitsBeforeCursor = extractDigits(oldFormatted.slice(0, currentPos)).length
          const digitsAdded = newDigits.length - oldDigits.length
          
          let targetDigitIndex = digitsBeforeCursor
          if (digitsAdded > 0) {
            targetDigitIndex = Math.min(newDigits.length, digitsBeforeCursor + digitsAdded)
          } else if (digitsAdded < 0 && digitsBeforeCursor > 0) {
            targetDigitIndex = Math.max(0, digitsBeforeCursor - 1)
          }
          
          const newCursorPos = getDigitPosition(formatted, targetDigitIndex)
          const safePos = Math.max(4, Math.min(formatted.length, newCursorPos))
          
          inputRef.value.setSelectionRange(safePos, safePos)
        }
      })
    }
  } else {
    console.log('FormInput handleInput (normal):', { value })
    emit('update:modelValue', value)
    emit('input', value)
  }
}

const handleKeydown = (event) => {
  if (!props.useMask || props.type !== 'tel' || !inputRef.value) {
    return
  }
  
  const key = event.key
  const currentPos = inputRef.value.selectionStart || 0
  const currentValue = inputRef.value.value
  const currentDigits = props.modelValue
  
  if (key.length === 1 && /[0-9]/.test(key) && currentDigits.length >= 10) {
    event.preventDefault()
    return
  }
  
  if (key === 'Backspace') {
    if (currentPos <= 4) {
      event.preventDefault()
      if (props.modelValue.length > 0) {
        emit('update:modelValue', '')
        emit('input', '')
      }
      return
    }
    
    if ([' ', ')', '('].includes(currentValue[currentPos - 1])) {
      event.preventDefault()
      const digits = extractDigits(currentValue)
      const digitsBeforeCursor = extractDigits(currentValue.slice(0, currentPos)).length
      
      if (digitsBeforeCursor > 0) {
        const newDigits = digits.slice(0, digitsBeforeCursor - 1) + digits.slice(digitsBeforeCursor)
        emit('update:modelValue', newDigits)
        emit('input', newDigits)
        
        nextTick(() => {
          if (inputRef.value) {
            const formatted = formatPhone(newDigits)
            const newPos = getDigitPosition(formatted, digitsBeforeCursor - 1)
            inputRef.value.setSelectionRange(newPos, newPos)
          }
        })
      }
    }
  } else if (key === 'Delete') {
    if (currentPos < 4) {
      event.preventDefault()
      return
    }
    
    if ([' ', ')', '('].includes(currentValue[currentPos])) {
      event.preventDefault()
      const digits = extractDigits(currentValue)
      const digitsBeforeCursor = extractDigits(currentValue.slice(0, currentPos)).length
      
      if (digitsBeforeCursor < digits.length) {
        const newDigits = digits.slice(0, digitsBeforeCursor) + digits.slice(digitsBeforeCursor + 1)
        emit('update:modelValue', newDigits)
        emit('input', newDigits)
      }
    }
  }
}

const handlePaste = (event) => {
  if (!props.useMask || props.type !== 'tel') {
    return
  }
  
  event.preventDefault()
  const pastedText = (event.clipboardData || window.clipboardData).getData('text')
  const currentDigits = props.modelValue
  const pastedDigits = extractDigits(pastedText)
  
  let newDigits = currentDigits
  const cursorPos = inputRef.value?.selectionStart || 0
  const oldFormatted = formatPhone(currentDigits)
  const digitsBeforeCursor = extractDigits(oldFormatted.slice(0, cursorPos)).length
  
  if (digitsBeforeCursor < currentDigits.length) {
    newDigits = currentDigits.slice(0, digitsBeforeCursor) + pastedDigits + currentDigits.slice(digitsBeforeCursor)
  } else {
    newDigits = currentDigits + pastedDigits
  }
  
  newDigits = extractDigits(newDigits)
  
  emit('update:modelValue', newDigits)
  emit('input', newDigits)
  
  nextTick(() => {
    if (inputRef.value) {
      const formatted = formatPhone(newDigits)
      const newPos = getDigitPosition(formatted, Math.min(newDigits.length, digitsBeforeCursor + pastedDigits.length))
      inputRef.value.setSelectionRange(newPos, newPos)
    }
  })
}

const handleBlur = (event) => {
  let value = event.target.value
  
  if (props.useMask && props.type === 'tel') {
    value = extractDigits(value)
  }
  
  console.log('FormInput handleBlur:', { value })
  emit('blur', value)
}
</script>