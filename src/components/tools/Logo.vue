<template>
  <div class="logo">
    <router-link :to="{name:'dashboard'}">
      <!--      <LogoSvg alt="logo" />-->
      <img src="@/assets/WDFlogo2.svg" alt="logo" style="width: 45px;height: 45px;">
      <h1 v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
import LogoSvg from '@/assets/fqlogo.svg?inline'

export default {
  name: 'Logo',
  components: {
    LogoSvg
  },
  props: {
    title: {
      type: String,
      default: 'Wonderful ERP',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
