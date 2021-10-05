<template>
  <router-view></router-view>
</template>

<script>
import httpService from './helpers/http'
import { toast } from './helpers/swal'
export default {
  name: 'App',
  methods: {
    getUserProfile() {
      httpService.get('/v1/user/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accesstoken')}`
        }
      })
        .then(({ data }) => {
          localStorage.setItem('user-profile', JSON.stringify(data))
        })
        .catch((err) => {
          console.log(err);
          toast('Session Expired', 'error')
          this.$router.push({ name: 'Login' })
        })
    }
  },
  mounted() {
    // this.getUserProfile()
  }
}
</script>

<style lang="scss">
  // Import Main styles for this application
  @import 'assets/scss/style';
</style>
