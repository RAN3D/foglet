<template>
  <footer class="footer">
    <div class="container-fluid">
      <nav>
        <ul class="footer-menu">
          <li>
            <router-link :to="{path:'/foglet'}">Homepage</router-link>
          </li>
        </ul>
      </nav>
      <div class="copyright text-center">
        &copy; Coded with
        <i class="fa fa-heart heart"></i> by
        <a href="https://github.com/cristijora" target="_blank">Arnaud Grall</a>.
        Inspired from <a href="https://github.com/creativetimofficial/vue-light-bootstrap-dashboard" target="_blank">vue-light-bootstrap-dashboard</a>.
      </div>
    </div>
  </footer>
</template>
<script>
  export default {}
</script>
<style>
</style>
