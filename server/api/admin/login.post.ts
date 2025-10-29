export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { username, password } = body

    if (!username || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Usuário e senha são obrigatórios'
      })
    }

    // Login simples - sem banco de dados
    if (username === 'admin' && password === 'admin123') {
      // Definir cookie de sessão simples
      setCookie(event, 'admin-session', 'true', {
        httpOnly: true,
        secure: false, // Para desenvolvimento
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 // 24 horas
      })

      // Armazenar dados do admin na sessão
      setCookie(event, 'admin-user', JSON.stringify({
        id: 'admin-1',
        username: 'admin',
        name: 'Administrador',
        email: 'admin@santarita.gov.br'
      }), {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60
      })

      return {
        success: true,
        message: 'Login realizado com sucesso',
        admin: {
          id: 'admin-1',
          username: 'admin',
          name: 'Administrador',
          email: 'admin@santarita.gov.br'
        }
      }
    } else {
      throw createError({
        statusCode: 401,
        statusMessage: 'Credenciais inválidas'
      })
    }

  } catch (error: any) {
    console.error('Erro no login:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
})
