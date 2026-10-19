import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config } from '../src/config.js'
import { db, inicializarBanco, idDoSubconteudo } from '../src/db.js'
import { definirPalavrasDaQuestao } from '../src/services/palavrasChave.js'
import { normalizar, termosDaPlanilha } from '../src/utils/texto.js'
import { importarArquivos } from '../src/services/arquivosQuestoes.js'

const pasta = path.join(path.dirname(fileURLToPath(import.meta.url)), 'seed-data')
const reset = process.argv.includes('--reset')

inicializarBanco()

function lerPlanilha() {
  const arquivo = path.join(pasta, 'questoes.json')

  if (!fs.existsSync(arquivo)) {
    console.error('Falta db/seed-data/questoes.json. Gere com: python3 db/converter_planilha.py')
    process.exit(1)
  }

  return JSON.parse(fs.readFileSync(arquivo, 'utf8'))
}

function validar(linhas) {
  const eixos = new Set(db.prepare('SELECT id FROM eixos').all().map(l => l.id))
  const conteudos = new Set(db.prepare('SELECT id FROM conteudos').all().map(l => l.id))
  const subs = new Set(db.prepare('SELECT id FROM subconteudos').all().map(l => l.id))
  const vistos = new Set()
  const problemas = []
  const validas = []

  for (const [indice, l] of linhas.entries()) {
    const ref = `linha ${indice + 2} (questao_id ${l.questaoId ?? '?'})`
    const erros = []

    if (!Number.isInteger(l.questaoId) || l.questaoId <= 0) erros.push('questao_id inválido')
    if (vistos.has(l.questaoId)) erros.push('questao_id repetido')
    if (!Number.isInteger(l.ano)) erros.push('ano inválido')
    if (![1, 2, 3].includes(l.categorizacao)) erros.push(`categorizacao inválida (${l.categorizacao})`)
    if (!['A', 'B', 'C', 'D', 'E'].includes(l.gabarito)) erros.push(`gabarito inválido (${l.gabarito})`)
    if (!eixos.has(l.objetoMatrizId)) erros.push(`objeto da matriz ${l.objetoMatrizId} não existe na taxonomia`)
    if (!conteudos.has(l.objetoLivroId)) erros.push(`objeto do livro ${l.objetoLivroId} não existe na taxonomia`)

    const numero = /^C(\d+)$/.exec(l.conteudoCodigo ?? '')
    const subId = numero ? idDoSubconteudo(l.objetoLivroId, Number(numero[1])) : null

    if (!numero) erros.push(`código de conteúdo inválido (${l.conteudoCodigo})`)
    else if (!subs.has(subId)) {
      erros.push(`combinação objeto ${l.objetoLivroId} + ${l.conteudoCodigo} ("${l.conteudoNome}") não existe em taxonomia.json`)
    }

    if (erros.length) {
      problemas.push(`${ref}: ${erros.join('; ')}`)
      continue
    }

    vistos.add(l.questaoId)
    validas.push({ ...l, subconteudoId: subId, conteudoNumero: Number(numero[1]) })
  }

  return { validas, problemas }
}

function limparTudo() {
  const imagens = db.prepare(`
    SELECT imagem FROM questoes WHERE imagem LIKE '/uploads/questoes/%'
  `).all()

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

  imagens.forEach(({ imagem }) => {
    fs.rmSync(path.join(config.uploadsDir, 'questoes', path.basename(imagem)), { force: true })
  })
}

const SQL_UPSERT = `
  INSERT INTO questoes (
    id, serial, ano, banca, prova, numero_questao,
    nivel_id, conteudo_id, subconteudo_id, objeto_id, resposta,
    objeto_matriz_id, objeto_matriz_nome, objeto_livro_id, objeto_livro_nome,
    conteudo_livro_codigo, conteudo_livro_numero, conteudo_livro_nome,
    categorizacao, observacoes
  ) VALUES (
    @questaoId, @questaoId, @ano, 'Enem', 'Caderno Azul', @numeroCadernoAzul,
    @categorizacao, @objetoLivroId, @subconteudoId, @objetoMatrizId, @gabarito,
    @objetoMatrizId, @objetoMatrizNome, @objetoLivroId, @objetoLivroNome,
    @conteudoCodigo, @conteudoNumero, @conteudoNome,
    @categorizacao, @observacoes
  )
  ON CONFLICT(id) DO UPDATE SET
    serial = excluded.serial,
    ano = excluded.ano,
    numero_questao = excluded.numero_questao,
    nivel_id = excluded.nivel_id,
    conteudo_id = excluded.conteudo_id,
    subconteudo_id = excluded.subconteudo_id,
    objeto_id = excluded.objeto_id,
    resposta = excluded.resposta,
    objeto_matriz_id = excluded.objeto_matriz_id,
    objeto_matriz_nome = excluded.objeto_matriz_nome,
    objeto_livro_id = excluded.objeto_livro_id,
    objeto_livro_nome = excluded.objeto_livro_nome,
    conteudo_livro_codigo = excluded.conteudo_livro_codigo,
    conteudo_livro_numero = excluded.conteudo_livro_numero,
    conteudo_livro_nome = excluded.conteudo_livro_nome,
    categorizacao = excluded.categorizacao,
    observacoes = excluded.observacoes,
    atualizado_em = datetime('now')
`

function importar(validas) {
  const upsert = db.prepare(SQL_UPSERT)
  const temPalavras = db.prepare('SELECT 1 FROM questao_palavras_chave WHERE questao_id = ? LIMIT 1')
  const jaExistia = db.prepare('SELECT 1 FROM questoes WHERE id = ?')
  let novas = 0
  let atualizadas = 0

  for (const l of validas) {
    if (jaExistia.get(l.questaoId)) atualizadas++
    else novas++

    upsert.run(l)

    if (!temPalavras.get(l.questaoId)) {
      definirPalavrasDaQuestao(l.questaoId, termosDaPlanilha(l.conteudoNome, l.observacoes))
    }
  }

  return { novas, atualizadas }
}

function contar(validas, chave) {
  const mapa = new Map()
  validas.forEach(l => mapa.set(l[chave], (mapa.get(l[chave]) ?? 0) + 1))
  return [...mapa.entries()].sort((a, b) => a[0] - b[0])
}

function imprimirRelatorio(validas, problemas, resultado) {
  const niveis = new Map(db.prepare('SELECT id, nome FROM niveis').all().map(n => [n.id, n.nome]))
  const eixos = new Map(db.prepare('SELECT id, nome FROM eixos').all().map(e => [e.id, e.nome]))
  const termos = new Set()

  validas.forEach(l => termosDaPlanilha(l.conteudoNome, l.observacoes).forEach(t => termos.add(normalizar(t))))

  const totalBanco = db.prepare('SELECT COUNT(*) AS n FROM questoes').get().n
  const totalPalavras = db.prepare('SELECT COUNT(*) AS n FROM palavras_chave').get().n
  const semGabarito = db.prepare('SELECT COUNT(*) AS n FROM questoes WHERE resposta IS NULL').get().n
  const alternativas = db.prepare('SELECT COUNT(*) AS n FROM alternativas').get().n

  console.log('\n=== Relatório da importação ===')
  console.log(`Modo: ${reset ? 'seed:reset (apagou e reimportou)' : 'seed (upsert)'}`)
  console.log(`Questões importadas: ${validas.length}  (novas: ${resultado.novas}, atualizadas: ${resultado.atualizadas})`)
  console.log(`Questões no banco agora: ${totalBanco}`)
  console.log(`Gabaritos gravados: ${totalBanco - semGabarito} de ${totalBanco} · alternativas cadastradas: ${alternativas}`)
  console.log(`Termos únicos de autocomplete (na planilha): ${termos.size} · palavras-chave no banco: ${totalPalavras}`)

  console.log('\nPor ano:')
  contar(validas, 'ano').forEach(([ano, n]) => console.log(`  ${ano}: ${n}`))

  console.log('\nPor nível (categorização):')
  contar(validas, 'categorizacao').forEach(([id, n]) => console.log(`  ${id} - ${niveis.get(id)}: ${n}`))

  console.log('\nPor objeto da matriz:')
  contar(validas, 'objetoMatrizId').forEach(([id, n]) => console.log(`  ${id} - ${eixos.get(id)}: ${n}`))

  console.log(`\nLinhas com problema: ${problemas.length}`)
  problemas.forEach(p => console.log(`  - ${p}`))
}

const linhas = lerPlanilha()
const { validas, problemas } = validar(linhas)

if (problemas.length) {
  console.error(`Importação cancelada: ${problemas.length} linha(s) com problema.`)
  problemas.forEach(p => console.error(`  - ${p}`))
  process.exit(1)
}

const resultado = db.transaction(() => {
  if (reset) limparTudo()
  return importar(validas)
})()

imprimirRelatorio(validas, problemas, resultado)

const arquivos = importarArquivos()

console.log(`\nArquivos de questões (db/questoes): ${arquivos.importadas} importado(s)`)

if (arquivos.problemas.length) {
  console.error(`\nOs arquivos abaixo têm problema e NADA deles foi importado (a planilha já foi):`)
  arquivos.problemas.forEach(p => console.error(`  - ${p}`))
  process.exit(1)
}

if (arquivos.orfas.length) {
  console.log(`Atenção: ${arquivos.orfas.length} questão(ões) criada(s) no painel não têm arquivo em db/questoes (ids: ${arquivos.orfas.join(', ')}).`)
  console.log('Rode "npm run exportar" para gerar os arquivos antes que elas se percam.')
}
