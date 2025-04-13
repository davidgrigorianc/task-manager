import { ref } from 'vue'

const message = ref('')
const type = ref('')
const visible = ref(false)
let timeout

export function useAlert() {
  const showMessage = (msg, msgType = 'success', duration = 3000) => {
    message.value = msg
    type.value = msgType
    visible.value = true

    clearTimeout(timeout)
    timeout = setTimeout(() => {
      visible.value = false
    }, duration)
  }

  return {
    message,
    type,
    visible,
    showMessage,
  }
}
