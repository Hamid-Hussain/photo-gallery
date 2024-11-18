<script setup>
import Header from "~/components/app/Header.vue";
import Footer from "~/components/app/Footer.vue";
</script>
<template>
  <Header />
  <slot></slot>
  <Footer />
</template>
