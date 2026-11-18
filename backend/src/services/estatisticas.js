import { db } from '../db.js'
import { config } from '../config.js'

const formatadorDeDia = new Intl.DateTimeFormat('en-CA', {
  timeZone: config.fusoEstatisticas, year: 'numeric', month: '2-digit', day: '2-digit'
})

const diaDe = data => formatadorDeDia.format(data)
const diaDaTentativa = utcSql => diaDe(new Date(`${utcSql.replace(' ', 'T')}Z`))

function ordinal(dia) {
  const [ano, mes, dd] = dia.split('-').map(Number)
  return Date.UTC(ano, mes - 1, dd) / 86400000
}

const percentual = (parte, total) => (total > 0 ? Math.round((100 * parte) / total) : null)

export function calcularSequencias(dias, hoje) {
  const ordinais = dias.map(ordinal)
  let maior = 0
  let corrida = 0

  ordinais.forEach((valor, indice) => {
    corrida = indice > 0 && valor - ordinais[indice - 1] === 1 ? corrida + 1 : 1
    maior = Math.max(maior, corrida)
  })

  const ultimo = ordinais[ordinais.length - 1]
  const atual = ultimo !== undefined && ordinal(hoje) - ultimo <= 1 ? corrida : 0

  return { atual, maior }
}

function calendario(porDia, hoje, mesPedido) {
  const [ano, mes] = (mesPedido ?? hoje.slice(0, 7)).split('-').map(Number)
  const prefixo = `${String(ano).padStart(4, '0')}-${String(mes).padStart(2, '0')}-`

  return {
    ano,
    mes,
    diasNoMes: new Date(Date.UTC(ano, mes, 0)).getUTCDate(),
    primeiroDiaSemana: new Date(Date.UTC(ano, mes - 1, 1)).getUTCDay(),
    hoje,
    dias: [...porDia.entries()]
      .filter(([dia]) => dia.startsWith(prefixo))
      .map(([dia, tentativas]) => ({ dia: Number(dia.slice(8)), tentativas }))
      .sort((a, b) => a.dia - b.dia)
  }
}

function desempenhoPorConteudo(usuarioId) {
  return db.prepare(`
    SELECT c.id, c.nome,
           (SELECT COUNT(*) FROM questoes q WHERE q.conteudo_id = c.id) AS disponiveis,
           COUNT(r.questao_id) AS respondidas,
           COALESCE(SUM(r.correta), 0) AS acertos
      FROM conteudos c
      LEFT JOIN questoes q ON q.conteudo_id = c.id
      LEFT JOIN respostas r ON r.questao_id = q.id AND r.usuario_id = ?
     GROUP BY c.id
     ORDER BY c.id
  `).all(usuarioId).map(linha => ({
    id: linha.id,
    nome: linha.nome,
    disponiveis: linha.disponiveis,
    respondidas: linha.respondidas,
    acertos: linha.acertos,
    erros: linha.respondidas - linha.acertos,
    taxaAcerto: percentual(linha.acertos, linha.respondidas),
    conclusao: percentual(linha.respondidas, linha.disponiveis) ?? 0
  }))
}

const contar = (sql, usuarioId) => db.prepare(sql).get(usuarioId).total

export function calcularEstatisticas(usuarioId, { agora = new Date(), mes } = {}) {
  const hoje = diaDe(agora)

  const { resolvidas, acertos } = db.prepare(`
    SELECT COUNT(*) AS resolvidas, COALESCE(SUM(correta), 0) AS acertos
      FROM respostas WHERE usuario_id = ?
  `).get(usuarioId)

  const tentativas = db.prepare(`
    SELECT respondida_em AS quando, origem FROM tentativas WHERE usuario_id = ?
  `).all(usuarioId)

  const porDia = new Map()
  tentativas.forEach(({ quando }) => {
    const dia = diaDaTentativa(quando)
    porDia.set(dia, (porDia.get(dia) ?? 0) + 1)
  })

  const diasComAtividade = [...porDia.keys()].sort()
  const sequencias = calcularSequencias(diasComAtividade, hoje)

  return {
    geral: {
      resolvidas,
      acertos,
      erros: resolvidas - acertos,
      taxaAcerto: percentual(acertos, resolvidas),
      salvas: contar('SELECT COUNT(*) AS total FROM questoes_salvas WHERE usuario_id = ?', usuarioId),
      revisar: contar('SELECT COUNT(*) AS total FROM questoes_revisar WHERE usuario_id = ?', usuarioId),
      tentativas: tentativas.length,
      diasEstudados: diasComAtividade.length,
      sequenciaAtual: sequencias.atual,
      maiorSequencia: sequencias.maior
    },
    historicoParcial: tentativas.some(t => t.origem === 'migracao'),
    conteudos: desempenhoPorConteudo(usuarioId),
    calendario: calendario(porDia, hoje, mes)
  }
}
