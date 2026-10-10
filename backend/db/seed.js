import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config } from '../src/config.js'
import { db, inicializarBanco } from '../src/db.js'
import { definirPalavrasDaQuestao } from '../src/services/palavrasChave.js'
import { normalizar } from '../src/utils/texto.js'

const pasta = path.join(path.dirname(fileURLToPath(import.meta.url)), 'seed-data')
const ler = nome => JSON.parse(fs.readFileSync(path.join(pasta, nome), 'utf8'))

const reset = process.argv.includes('--reset')

function limparTudo() {
  db.exec(`
    DELETE FROM comentarios;
    DELETE FROM respostas;
    DELETE FROM questoes_salvas;
    DELETE FROM questoes_revisar;
    DELETE FROM questao_palavras_chave;
    DELETE FROM palavras_chave;
    DELETE FROM alternativas;
    DELETE FROM questoes;
  `)
}

function salvarImagem(imagem, id) {
  if (!imagem) return ''

  const dataUri = imagem.match(/^data:image\/(png|jpeg|webp|gif);base64,(.+)$/)
  if (!dataUri) return imagem

  const extensao = dataUri[1] === 'jpeg' ? 'jpg' : dataUri[1]
  const nome = `seed-${id}.${extensao}`
  const destino = path.join(config.uploadsDir, 'questoes')

  fs.mkdirSync(destino, { recursive: true })
  fs.writeFileSync(path.join(destino, nome), Buffer.from(dataUri[2], 'base64'))

  return `/uploads/questoes/${nome}`
}

function palavrasParaQuestao(card, resolver, catalogo, conteudoNome) {
  const texto = normalizar([
    card.resumo,
    card.subconteudo,
    conteudoNome,
    resolver.enunciado.textoPrincipal,
    resolver.enunciado.textoComplementar
  ].join(' '))

  const palavras = new Set([String(card.ano), 'Enem', conteudoNome, card.subconteudo.trim()])

  for (const palavra of catalogo) {
    const normalizada = normalizar(palavra)
    if (normalizada.length >= 4 && texto.includes(normalizada)) palavras.add(palavra)
  }

  return [...palavras]
}

function importar() {
  const cards = ler('card.json')
  const resolvers = ler('resolver.json')
  const detalhes = ler('detalhes.json')
  const comentarios = ler('comentarios.json')
  const catalogo = ler('palavrasChave.json')

  const buscarSub = db.prepare(`
    SELECT s.id FROM subconteudos s WHERE s.conteudo_id = ? AND s.nome = ?
  `)
  const nomeConteudo = db.prepare('SELECT nome FROM conteudos WHERE id = ?')

  const inserirQuestao = db.prepare(`
    INSERT INTO questoes (
      id, serial, ano, banca, prova, numero_questao, nivel_id, conteudo_id,
      subconteudo_id, objeto_id, resumo, enunciado_texto, enunciado_complemento,
      imagem, imagem_alt, resposta, comentario, teoria, taxa_acerto
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  const inserirAlternativa = db.prepare(`
    INSERT INTO alternativas (questao_id, letra, texto) VALUES (?, ?, ?)
  `)
  const inserirComentario = db.prepare(`
    INSERT INTO comentarios (questao_id, autor, texto, curtidas, criado_em)
    VALUES (?, ?, ?, ?, ?)
  `)

  for (const card of cards) {
    const resolver = resolvers.find(item => item.id === card.id)
    const detalhe = detalhes.find(item => item.id === card.id)

    if (!resolver || !detalhe) {
      throw new Error(`Questão ${card.id} sem dados completos nos JSONs`)
    }

    const sub = buscarSub.get(card.conteudoId, card.subconteudo.trim())

    if (!sub) {
      throw new Error(`Subconteúdo "${card.subconteudo}" não existe no conteúdo ${card.conteudoId}`)
    }

    inserirQuestao.run(
      card.id, card.serial, card.ano, detalhe.banca, detalhe.prova, detalhe.numeroQuestao,
      card.nivel, card.conteudoId, sub.id, detalhe.objeto.id,
      card.resumo, resolver.enunciado.textoPrincipal, resolver.enunciado.textoComplementar,
      salvarImagem(resolver.enunciado.imagem, card.id), resolver.enunciado.alt,
      resolver.resposta, resolver.comentario, JSON.stringify(detalhe.teoria),
      detalhe.taxaAcerto
    )

    resolver.alternativas.forEach(alt => inserirAlternativa.run(card.id, alt.letra, alt.texto))

    definirPalavrasDaQuestao(
      card.id,
      palavrasParaQuestao(card, resolver, catalogo, nomeConteudo.get(card.conteudoId).nome)
    )

    const registro = comentarios.find(item => item.questaoId === card.id)

    registro?.comentarios.forEach(c => {
      inserirComentario.run(card.id, c.autor, c.texto, c.curtidas ?? 0, `${c.data} 12:00:00`)
    })
  }

  return cards.length
}

inicializarBanco()

const existentes = db.prepare('SELECT COUNT(*) AS total FROM questoes').get().total

if (existentes > 0 && !reset) {
  console.log(`O banco já tem ${existentes} questões. Nada foi alterado.`)
  console.log('Use "npm run seed:reset" para apagar as questões atuais e importar os dados de exemplo.')
  process.exit(0)
}

const total = db.transaction(() => {
  if (reset) limparTudo()
  return importar()
})()

console.log(`${total} questões de exemplo importadas em ${config.dbPath}`)
