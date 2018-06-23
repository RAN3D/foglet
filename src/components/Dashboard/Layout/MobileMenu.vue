<template>
  <ul class="nav nav-mobile-menu">
    <li class="nav-item">
      <a :href="config.gettingStarted" class="nav-link">
        Getting Started
      </a>
    </li>
    <li class="nav-item">
      <a :href="config.api" class="nav-link">
        Documentation
      </a>
    </li>
    <li class="nav-item">
      <a :href="config.github" class="nav-link">
        <img src='/static/img/GitHub-Mark-Light-32px.png' width=auto height=auto />
        Github link
      </a>
    </li>
  </ul>
</template>
<script>
  import DropDown from '../../UIComponents/Dropdown.vue'

  export default {
    components: {
      DropDown
    }
  }
</script>
<style>
</style>
