export default defineNuxtRouteMiddleware((to) => {
  // Verificar se está tentando acessar uma rota administrativa
  if (to.path.startsWith('/admin')) {
    // Verificar se não está na página de login
    if (to.path === '/admin/login') {
      return
    }

    // Usar useCookie em ambos (cliente/servidor) para evitar inconsistências
    const adminSession = useCookie('admin-session', { sameSite: 'lax', path: '/' })

    console.log('Middleware check:', {
      sessionValue: adminSession.value,
      path: to.path,
      isClient: process.client
    })

    if (!adminSession.value || adminSession.value !== 'true') {
      return navigateTo('/admin/login')
    }
  }
})
