import Toasted from "vue-toasted"

export default (Vue) => {
  Vue.use(Toasted, {
    duration: 4500
  })

  Vue.mixin({
    methods: {

      $success(msg: string): void {
        this.$toasted.success(msg, {
          icon: "check_circle_outline"
        })
      },

      $error(msg = "Oops, noe gikk galt!"): void {
        this.$toasted.error(msg, {
          icon: "error_outline"
        })
      }

    }
  })
}
