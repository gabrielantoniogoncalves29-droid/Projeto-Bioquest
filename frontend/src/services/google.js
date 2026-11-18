const URL_SCRIPT = 'https://accounts.google.com/gsi/client'

let carregamento = null

export function carregarGoogle() {

  if (window.google?.accounts?.id) return Promise.resolve(window.google)

  if (!carregamento) {

    carregamento = new Promise((resolver, rejeitar) => {

      const script = document.createElement('script')

      script.src = URL_SCRIPT
      script.async = true
      script.defer = true
      script.onload = () => resolver(window.google)
      script.onerror = () => {

        carregamento = null
        script.remove()
        rejeitar(new Error('Não foi possível carregar o login do Google'))

      }

      document.head.appendChild(script)

    })

  }

  return carregamento

}
