<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Task Manager</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view />
        <AlertMessage />
      </v-container>
    </v-main>
  </v-app>
</template>
<script setup lang="ts">
import AlertMessage from '@/components/AlertMessage.vue'
</script>
