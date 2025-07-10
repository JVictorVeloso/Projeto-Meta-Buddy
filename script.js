
const apiKeyInput = document.getElementById('apiKey')
const gameSelect = document.getElementById('gameSelect')
const questionInput = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const aiResponse = document.getElementById('aiResponse')
const form = document.getElementById('form')

const markdownToHTML = (text) => {
  const converter = new showdown.Converter()
  return converter.makeHtml(text)
}

const perguntarAI = async (question, game, apiKey) => {
  const model = "gemini-2.5-flash"
  const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  let instrucoesExtras = ''
  switch (game) {
    case "lol":
      instrucoesExtras = "- Foco em builds, runas, rotas e estratégias por lane. Considere o patch atual."
      break
    case "valorant":
      instrucoesExtras = "- Destaque táticas por mapa, agentes ideais e economia de rounds."
      break
    case "pokemmo":
      instrucoesExtras = "- Oriente sobre IV/EV, builds de Pokémon e locais de farm."
      break
    case "dota2":
      instrucoesExtras = "- Foque em builds, picks por função e estratégias de rotação."
      break
    case "csgo":
      instrucoesExtras = "- Fale sobre táticas de bomb, economia e armas por situação."
      break
    case "fortnite":
      instrucoesExtras = "- Sugira rotas de loot, armas ideais e dicas de construção."
      break
    case "overwatch2":
      instrucoesExtras = "- Fale sobre composições, counters e estratégias de defesa/ataque."
      break
    case "freefire":
      instrucoesExtras = "- Oriente sobre posicionamento, armas e movimentação."
      break
    case "pubg":
      instrucoesExtras = "- Dicas sobre zonas seguras, melhores armas e veículos."
      break
    case "wildrift":
      instrucoesExtras = "- Estratégias adaptadas ao mobile: builds rápidas e decisões ágeis."
      break
    case "apex":
      instrucoesExtras = "- Oriente sobre rotações, habilidades das lendas e combate em squads."
      break
    case "mlbb":
      instrucoesExtras = "- Sugira builds, lanes e sinergia entre heróis no meta atual."
      break
    case "smite":
      instrucoesExtras = "- Concentre-se em builds, deuses do meta e controle de objetivos."
      break
    case "fifa":
      instrucoesExtras = "- Oriente sobre táticas, formações e estratégias em FUT ou modo carreira."
      break
    case "rocketleague":
      instrucoesExtras = "- Dicas sobre posicionamento, movimentação e domínio da bola."
      break
    default:
      instrucoesExtras = ''
  }

  const pergunta = `
    ## Especialidade
    Você é um especialista assistente de meta para o jogo ${game}.
    
    ## Tarefa
    Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, build e dicas.
    
    ## Regras
    - Se você não sabe a resposta, diga 'Não sei' e não invente.
    - Se a pergunta não for sobre o jogo, responda 'Essa pergunta não está relacionada com o jogo!'
    - Considere a data atual: ${new Date().toLocaleDateString()}
    - Baseie-se no patch atual para sua resposta.
    - Nunca inclua informações que não tenham confirmação no meta atual.

    ## Resposta
    - Seja direto. Máximo 500 caracteres.
    - Use markdown.
    - Sem saudação ou despedida.

    ## Instruções específicas
    ${instrucoesExtras}

    ---
    Pergunta do usuário: ${question}
  `

  const contents = [{
    role: "user",
    parts: [{ text: pergunta }]
  }]

  const tools = [{ google_search: {} }]

  const response = await fetch(geminiURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents, tools })
  })

  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}

const enviarFormulario = async (event) => {
  event.preventDefault()
  const apiKey = apiKeyInput.value
  const game = gameSelect.value
  const question = questionInput.value

  if (!apiKey || !game || !question) {
    alert('Por favor, preencha todos os campos')
    return
  }

  askButton.disabled = true
  askButton.textContent = 'Perguntando...'
  askButton.classList.add('loading')

  try {
    const text = await perguntarAI(question, game, apiKey)
    aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text)
    aiResponse.classList.remove('hidden')
  } catch (error) {
    console.error('Erro:', error)
    alert('Erro ao consultar a IA. Verifique a API KEY e tente novamente.')
  } finally {
    askButton.disabled = false
    askButton.textContent = 'Perguntar'
    askButton.classList.remove('loading')
  }
}

form.addEventListener('submit', enviarFormulario)
