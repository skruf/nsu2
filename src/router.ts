import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

const routes = [
  {
    path: "/events",
    name: "EventsListScreen",
    component: (): any => import(/* webpackChunkName: "events" */ "./screens/EventsListScreen.vue")
  },
  {
    path: "/events/categories",
    name: "EventsCategoriesListScreen",
    component: (): any => import(/* webpackChunkName: "events" */ "./screens/EventsCategoriesListScreen.vue")
  },
  {
    path: "/events/:eventId",
    name: "EventsViewScreen",
    component: (): any => import(/* webpackChunkName: "events" */ "./screens/EventsViewScreen.vue")
  },
  {
    path: "/clubs",
    name: "ClubsListScreen",
    component: (): any => import(/* webpackChunkName: "clubs" */ "./screens/ClubsListScreen.vue")
  },
  {
    path: "/clubs/:clubId",
    name: "ClubsViewScreen",
    component: (): any => import(/* webpackChunkName: "clubs" */ "./screens/ClubsViewScreen.vue")
  },
  {
    path: "/ranges",
    name: "RangesListScreen",
    component: (): any => import(/* webpackChunkName: "ranges" */ "./screens/RangesListScreen.vue")
  },
  {
    path: "/ranges/:rangeId",
    name: "RangesViewScreen",
    component: (): any => import(/* webpackChunkName: "ranges" */ "./screens/RangesViewScreen.vue")
  },
  {
    path: "/weapons",
    name: "WeaponsListScreen",
    component: (): any => import(/* webpackChunkName: "weapons" */ "./screens/WeaponsListScreen.vue")
  },
  {
    path: "/settings",
    name: "SettingsScreen",
    component: (): any => import(/* webpackChunkName: "settings" */ "./screens/SettingsScreen.vue")
  },
  {
    path: "/error",
    name: "ErrorScreen",
    component: (): any => import(/* webpackChunkName: "error" */ "./screens/ErrorScreen.vue"),
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
