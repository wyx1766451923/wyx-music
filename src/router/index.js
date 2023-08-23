import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      redirect:'/home/index'
    },
    {
      path:'/404notfound',
      component: ()=>import('../views/NotFound/index.vue')
    },
    {
      path: '/home',
      redirect:'/home/index',
      name: 'home',
      component: ()=>import('../views/Home/index.vue'),
      children:[
        {
          path:'index',
          name:'index',
          component: ()=>import('../views/Index/index.vue')
        },
        {
          path:'search/:keyValue',
          name:'search',
          component: ()=>import('../views/Serach/Detail.vue')
        },
        {
          path:'song/:id',
          name:'song',
          component: ()=>import('../views/Song/index.vue')
        },
        {
          path:'album/:id',
          name:'album',
          component: ()=>import('../views/Album/index.vue')
        },
        {
          path:'musicCharts',
          name:'musicCharts',
          component: ()=>import('../views/MusicCharts/index.vue')
        },
        {
          path:'musicVideo',
          name:'musicVideo',
          component: ()=>import('../views/MusicVideo/index.vue')
        },
        {
          path:'musicVideo/detail/:id',
          name:'musicVideo/detail',
          component: ()=>import('../views/musicVideo/Detail.vue')
        },
        {
          path:'myMusic',
          name:'myMusic',
          component: ()=>import('../views/MyMusic/index.vue')
        },
        {
          path:'playlist',
          name:'playlist',
          component: ()=>import('../views/Playlist/index.vue')
        },
        {
          path:'playlist/detail/:id',
          name:'playlist/detail',
          component: ()=>import('../views/Playlist/Detail.vue')
        },
        {
          path:'singer',
          name:'singer',
          component: ()=>import('../views/Singer/index.vue')
        },
      ]
    },
    {
      path:'/:catchAll(.*)',
      redirect:'/404notfound'
    }
  ]
})

export default router
