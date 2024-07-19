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
        label: 'Mis solicitudes',
        name: 'solicitudes',
        component: () => import(/* webpackChunkName: "dashboard" */'src/modules/solicitudes/MisSolicitudes.vue')
      },
      {
        path: 'historialSolicitudes',
        icono: 'description',
        label: 'Historial de solicitudes',
        name: 'todasSolicitudes',
        component: () => import(/* webpackChunkName: "dashboard" */'src/modules/historialSolicitudes/HistorialSolicitudes.vue')
      },
      {
        path: 'asistencia',
        icono: 'calendar_month',
        label: 'Asistencias',
        name: 'asistencia',
        component: () => import(/* webpackChunkName: "dashboard" */'src/modules/asistencia/AsistenciasModule.vue')
      },
      {
        path: 'diasGanados',
        icono: 'fact_check',
        label: 'Dias Ganados',
        name: 'diasGanados',
        component: () => import(/* webpackChunkName: "dashboard" */'src/modules/diasGanados/DiasGanadosModule.vue')
      },
      {
        path: 'catalogoUsuarios',
        icono: 'person_search',
        label: 'Catálogo Usuarios',
        name: 'catalogoUsuarios',
        component: () => import(/* webpackChunkName: "dashboard" */'src/modules/catalogo/CatalogoUsuariosModule.vue')
      },
      {
        path: 'catalogoVacaciones',
        icono: 'format_list_numbered',
        label: 'Catálogo Vacaciones',
        name: 'catalogoVacaciones',
        component: () => import(/* webpackChunkName: "dashboard" */'src/modules/catalogo/CatalogoVacacionesModule.vue')
      },

    ]
  },
  {
    path: '/cambiar/contrasena',
    name: 'cambiarContrasena',
    component: () => import(/* webpackChunkName: "cambiarContrasena" */ 'pages/CambiarContrasenia.vue')
  }
]

export default routes
