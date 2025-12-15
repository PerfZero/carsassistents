<template>
  <div class="min-h-screen bg-white">
    <router-view />
    <PrivacyPolicyModal v-if="showPrivacyModal" @close="showPrivacyModal = false" />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import PrivacyPolicyModal from './components/PrivacyPolicyModal.vue'

const showPrivacyModal = ref(false)

const openPrivacyModal = () => {
  showPrivacyModal.value = true
}

provide('openPrivacyModal', openPrivacyModal)
</script>
