import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

const routes = [
  // {
  //   path: "/",
  //   name: "home",
  //   component: Home
  // },
  // {
  //   path: "/about",
  //   name: "about",
  //   component: () => import(/* webpackChunkName: "about" */ "./views/About.vue")
  // }

  {
    path: "/events",
    name: "EventsListScreen",
    component: require("./screens/EventsListScreen").default
  },
  {
    path: "/events/categories",
    name: "EventsCategoriesListScreen",
    component: require("./screens/EventsCategoriesListScreen").default
  },
  {
    path: "/events/:eventId",
    name: "EventsViewScreen",
    component: require("./screens/EventsViewScreen").default
  },
  {
    path: "/clubs",
    name: "ClubsListScreen",
    component: require("./screens/ClubsListScreen").default
  },
  {
    path: "/clubs/:clubId",
    name: "ClubsViewScreen",
    component: require("./screens/ClubsViewScreen").default
  },
  {
    path: "/ranges",
    name: "RangesListScreen",
    component: require("./screens/RangesListScreen").default
  },
  {
    path: "/weapons",
    name: "WeaponsListScreen",
    component: require("./screens/WeaponsListScreen").default
  },
  {
    path: "/settings",
    name: "SettingsScreen",
    component: require("./screens/SettingsScreen").default
  },
  {
    path: "/error",
    name: "ErrorScreen",
    component: require("./screens/ErrorScreen").default,
    props: true
  },
  {
    path: "*",
    redirect: "/events"
  }
]

const router = new VueRouter({
  routes
})

export default router
