<template>
  <v-snackbar v-model="visible" :color="color" timeout="-1">
    {{ message }}
    <template #actions>
      <v-btn icon @click="visible = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { useAlert } from '@/composables/useAlert.js'
import { computed } from 'vue'

const { message, type, visible } = useAlert()

const color = computed(() => {
  return (
    {
      success: 'green',
      error: 'red',
      warning: 'orange',
      info: 'blue',
    }[type.value] || 'primary'
  )
})
</script>
