const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ 'pages/LoginPage.vue')
  },
  {
    path: '/principal',
    name: 'principal',
    meta: { auth: true },
    component: () => import(/* webpackChunkName: "principal" */ 'layouts/MainLayout.vue'),
    children: [
      {
        path: 'dashboard',
        icono: 'dashboard',
        label: 'Inicio',
        name: 'dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */'src/modules/dashboard/DashBoard.vue')
      },
      {
        path: 'solicitudes',
        icono: 'description',
        label: 'Solicitudes',
        name: 'solicitudes',
        component: () => import(/* webpackChunkName: "dashboard" */'src/modules/solicitudes/MisSolicitudes.vue')
      }
    ]
  }
]

export default routes
