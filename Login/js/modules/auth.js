// js/modules/auth.js
import {SUPABASE_URL, API_KEY} from './config.js'

// Login do usuário
export async function login(email, password) {
    console.log('Tentando login para:', email)
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
            'apikey': API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
    })

    const data = await res.json() 
    console.log('Resposta do supabase:', data)

    //confirma se o login está correto
    if(!res.ok) { 
        const errorMsg = data.error_description || data.msg || "Erro no login"
        console.error('Erro no login:', errorMsg)
        throw new Error(errorMsg)
    }

    localStorage.setItem('sb_token', data.access_token)
    localStorage.setItem('sb_refresh_token', data.refresh_token)
    localStorage.setItem('sb_user', JSON.stringify(data.user))

    console.log('Login bem-sucedido para:', data.user.email)
    return data
}

//Verifica se já possui um usuário logado
export async function getCurrentUser() {
    const token = localStorage.getItem('sb_token')
    
    if(!token) {
        console.log('Nenhum token encontrado')
        return null
    }

    try {
        const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
            headers: {
                'apikey': API_KEY,
                'Authorization': `Bearer ${token}`
            }
        })
            if (!response.ok) {
                console.log('Token inválido')
                localStorage.removeItem('sb_token')
                localStorage.removeItem('sb_refresh_token')
                localStorage.removeItem('sb_user')
                return null
            }

        const user = await response.json()
        console.log('Usuário atual :', user)
        return user
    } catch (error) {
        console.error('Erro ao buscar usuário:', error)
        return null
    }
}

// Logout do usuario
export async function logout() {
    localStorage.removeItem('sb_token')
    localStorage.removeItem('sb_refresh_token')
    localStorage.removeItem('sb_user')
    window.location.href = 'index.html'
}

// Botão para logout
const botao = document.getElementById('logoutBtn')
if(botao) {
    botao.addEventListener('click', () => {
        logout()
    })
}

// Verifica se o usuário está autenticado
export async function requireAuth() {
    const user = await getCurrentUser()
    if(!user) {
        window.location.href = 'index.html'
       return false
    }
    return user

}
