/* ==========================================================
   app.js  |  O QUE O SITE FAZ (a lógica)
   ----------------------------------------------------------
   Índice:
   1. Elementos da página      5. Busca e filtro
   2. Variáveis                6. Janela (modal)
   3. Funções de apoio         7. Histórico
   4. Montar a tela            8. Eventos e início
   ========================================================== */


/* ---------- 1. ELEMENTOS DA PÁGINA ----------
   Guardamos em variáveis para não ficar procurando toda hora. */
const campoBusca     = document.getElementById('busca');
const campoFiltroPops = document.getElementById('filtro-pops');
const menuAbas       = document.getElementById('abas');
const areaSecoes     = document.getElementById('area-secoes');
const secaoPops      = document.querySelector('[data-id="pops"]');
const tabelaPops     = document.getElementById('tabela-pops');
const semResultado   = document.getElementById('sem-resultado');
const modal          = document.getElementById('modal');
const modalTitulo    = document.getElementById('modal-titulo');
const modalTipo      = document.getElementById('modal-tipo');
const modalCampos    = document.getElementById('modal-campos');
const textoFinal     = document.getElementById('texto-final');
const modalHistorico = document.getElementById('modal-historico');
const listaHistorico = document.getElementById('historico-lista');
const aviso          = document.getElementById('aviso');


/* ---------- 2. VARIÁVEIS ---------- */
let abaAtual = 'todos';       // qual aba está escolhida
let valores = {};             // o que foi digitado nos campos (fica lembrado)
let modeloAtual = null;       // modelo aberto no modal: { texto, titulo }
let camposFaltando = [];      // campos que ainda estão vazios no texto
let temporizadorAviso = null; // controla o sumiço do aviso

// Textos que aparecem acima de cada campo do modal
const ROTULOS = {
  empresa: 'Empresa',
  pop: 'POP',
  certificado: 'Nº do certificado',
  avaria: 'Avaria identificada',
  motivo: 'Motivo'
};

// Dicas dentro de cada campo vazio
const DICAS = {
  empresa: 'Nome da empresa',
  pop: 'Selecione ou digite',
  certificado: 'Só o número, ex.: 0123',
  avaria: 'Descreva a avaria',
  motivo: 'Ex.: avaria, em uso pelo paciente'
};

// Guardados no navegador (localStorage), continuam depois de fechar a página
let empresasSalvas = lerDoNavegador('empresas', []);
let historico = lerDoNavegador('historico', []);

// Transforma a LISTA_POPS (texto) em uma lista de objetos
const POPS = [];
const linhasPops = LISTA_POPS.trim().split('\n');
for (const linha of linhasPops) {
  const numero = linha.slice(0, 3);
  const nome = linha.slice(4);
  const ehPreventiva = nome.includes('Manutenção Preventiva') || nome.includes('Manutenção em CAMA');
  POPS.push({ codigo: 'POP ENG ' + numero, nome: nome, ehPreventiva: ehPreventiva });
}


/* ---------- 3. FUNÇÕES DE APOIO ---------- */

/* Lê um valor guardado no navegador. Se der erro, devolve o valor padrão. */
function lerDoNavegador(chave, padrao) {
  try {
    const guardado = localStorage.getItem(chave);
    if (guardado === null) {
      return padrao;
    }
    return JSON.parse(guardado);
  } catch (erro) {
    return padrao;
  }
}

/* Guarda um valor no navegador */
function guardarNoNavegador(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch (erro) {
    // se o navegador bloquear, o site continua funcionando (só não lembra)
  }
}

/* Deixa o texto minúsculo e sem acento, para a busca achar "calibracao" ou "calibração" */
function semAcento(texto) {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/* Tira o começo do nome do POP para sobrar só o equipamento.
   Ex.: "Manutenção Preventiva em Incubadora" vira "Incubadora" */
function nomeDoEquipamento(nomePop) {
  return nomePop.replace(/^(Realização da )?Manutenção (Preventiva )?(em |nas |do |de )?/, '');
}

/* Mostra uma mensagem rápida no canto da tela */
function mostrarAviso(mensagem) {
  aviso.textContent = mensagem;
  aviso.classList.add('visivel');
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(function () {
    aviso.classList.remove('visivel');
  }, 2800);
}

/* Copia um texto. Devolve true se deu certo. */
async function copiarTexto(texto, mensagemSucesso) {
  let deuCerto = false;

  try {
    await navigator.clipboard.writeText(texto);
    deuCerto = true;
  } catch (erro) {
    // Plano B para navegadores que bloqueiam o método acima
    const caixa = document.createElement('textarea');
    caixa.value = texto;
    caixa.style.position = 'fixed';
    caixa.style.opacity = '0';
    document.body.appendChild(caixa);
    caixa.select();
    deuCerto = document.execCommand('copy');
    caixa.remove();
  }

  if (deuCerto) {
    mostrarAviso(mensagemSucesso);
  } else {
    mostrarAviso('Não foi possível copiar. Selecione o texto e use Ctrl+C.');
  }
  return deuCerto;
}


/* ---------- 4. MONTAR A TELA ---------- */

/* Cria os botões das abas: Todos, uma por seção, Por equipamento e POPs */
function montarAbas() {
  const abas = [{ id: 'todos', nome: 'Todos' }];

  for (const secao of SECOES) {
    abas.push({ id: secao.id, nome: secao.nome });
  }
  abas.push({ id: 'equipamentos', nome: 'Por equipamento' });
  abas.push({ id: 'pops', nome: 'Catálogo de POPs' });

  for (const aba of abas) {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.textContent = aba.nome;
    botao.dataset.id = aba.id;
    botao.setAttribute('aria-pressed', 'false');

    botao.addEventListener('click', function () {
      abaAtual = aba.id;
      atualizarAbas();
      aplicarFiltro();
    });

    menuAbas.appendChild(botao);
  }
  atualizarAbas();
}

/* Marca visualmente qual aba está escolhida */
function atualizarAbas() {
  const botoes = menuAbas.querySelectorAll('button');
  for (const botao of botoes) {
    const escolhida = botao.dataset.id === abaAtual;
    botao.setAttribute('aria-pressed', String(escolhida));
  }
}

/* Cria UM botão de modelo (ex.: "Conforme") dentro de um card.
   Se vier um codigoPop, o campo POP já abre preenchido. */
function criarBotaoModelo(card, botao, codigoPop) {
  const elemento = document.createElement('button');
  elemento.type = 'button';
  elemento.className = 'botao-modelo ' + botao.status;
  elemento.innerHTML = '<i aria-hidden="true"></i>' + botao.rotulo;

  elemento.addEventListener('click', function () {
    if (codigoPop) {
      valores.pop = codigoPop;
    }
    abrirModal(card, botao);
  });
  return elemento;
}

/* Cria UM card (usa <article>, pois é um bloco independente) */
function criarCard(nomeSecao, card) {
  const tipo = TIPOS[card.tipo];

  const artigo = document.createElement('article');
  artigo.className = 'card';
  artigo.style.setProperty('--matiz', tipo.matiz); // define a cor deste card

  // texto usado pela busca (tudo junto, sem acento)
  let textoBusca = nomeSecao + ' ' + tipo.nome + ' ' + card.titulo + ' ' + card.descricao;
  for (const botao of card.botoes) {
    textoBusca = textoBusca + ' ' + botao.texto;
  }
  artigo.dataset.busca = semAcento(textoBusca);

  artigo.innerHTML =
    '<span class="card-tipo">' + tipo.nome + '</span>' +
    '<h3>' + card.titulo + '</h3>' +
    '<p>' + card.descricao + '</p>' +
    '<div class="botoes"></div>';

  const areaBotoes = artigo.querySelector('.botoes');
  for (const botao of card.botoes) {
    areaBotoes.appendChild(criarBotaoModelo(card, botao));
  }
  return artigo;
}

/* Cria as seções (Calibração, TSE...) com seus cards */
function montarSecoes() {
  for (const secao of SECOES) {
    const elemento = document.createElement('section');
    elemento.className = 'secao';
    elemento.dataset.id = secao.id;
    elemento.setAttribute('aria-labelledby', 'titulo-' + secao.id);

    elemento.innerHTML =
      '<div class="secao-cabecalho">' +
        '<div><h2 id="titulo-' + secao.id + '">' + secao.nome + '</h2><p>' + secao.descricao + '</p></div>' +
        '<span class="etiqueta">' + secao.etiqueta + '</span>' +
      '</div>' +
      '<div class="grade"></div>';

    const grade = elemento.querySelector('.grade');
    for (const card of secao.cards) {
      grade.appendChild(criarCard(secao.nome, card));
    }
    areaSecoes.appendChild(elemento);
  }
}

/* Cria a seção "Preventiva por equipamento": 1 card para cada POP de preventiva */
function montarEquipamentos() {
  const elemento = document.createElement('section');
  elemento.className = 'secao';
  elemento.dataset.id = 'equipamentos';
  elemento.setAttribute('aria-labelledby', 'titulo-equipamentos');
  elemento.innerHTML =
    '<div class="secao-cabecalho">' +
      '<div><h2 id="titulo-equipamentos">Preventiva por equipamento</h2>' +
      '<p>Escolha o equipamento: o POP já vem preenchido.</p></div>' +
    '</div>' +
    '<div class="grade grade-equipamentos"></div>';

  const grade = elemento.querySelector('.grade');

  for (const pop of POPS) {
    if (!pop.ehPreventiva) {
      continue; // pula POPs administrativos
    }
    const equipamento = nomeDoEquipamento(pop.nome);
    const ehMapa = pop.codigo.endsWith('047');
    const tipo = ehMapa ? TIPOS.mapa : TIPOS.preventiva;

    const artigo = document.createElement('article');
    artigo.className = 'card';
    artigo.style.setProperty('--matiz', tipo.matiz);
    artigo.dataset.busca = semAcento('preventiva ' + equipamento + ' ' + pop.codigo);
    artigo.innerHTML =
      '<span class="card-tipo">' + pop.codigo + '</span>' +
      '<h3>' + equipamento + '</h3>' +
      '<div class="botoes"></div>';

    // No MAPA, o "Conforme" usa o texto próprio; os demais usam o texto padrão
    let botaoConforme = CARD_PREVENTIVA.botoes[0];
    if (ehMapa) {
      botaoConforme = CARD_MAPA.botoes[0];
    }
    const botaoNaoConforme = CARD_PREVENTIVA.botoes[1];

    const cardParaModal = { tipo: ehMapa ? 'mapa' : 'preventiva', titulo: equipamento };
    const areaBotoes = artigo.querySelector('.botoes');
    areaBotoes.appendChild(criarBotaoModelo(cardParaModal, botaoConforme, pop.codigo));
    areaBotoes.appendChild(criarBotaoModelo(cardParaModal, botaoNaoConforme, pop.codigo));

    grade.appendChild(artigo);
  }
  areaSecoes.appendChild(elemento);
}

/* Preenche a tabela de POPs (respeitando o filtro digitado) */
function montarTabelaPops() {
  // se o filtro da tabela está vazio, usa o texto da busca do topo
  let filtro = semAcento(campoFiltroPops.value.trim());
  if (filtro === '') {
    filtro = semAcento(campoBusca.value.trim());
  }

  tabelaPops.innerHTML = '';
  let quantos = 0;

  for (const pop of POPS) {
    if (!semAcento(pop.codigo + ' ' + pop.nome).includes(filtro)) {
      continue;
    }
    quantos = quantos + 1;

    const linha = document.createElement('tr');
    linha.innerHTML = '<td>' + pop.codigo + '</td><td>' + pop.nome + '</td><td></td>';
    const celulaAcoes = linha.lastElementChild;

    // botão "Código": copia só o código do POP
    const botaoCodigo = document.createElement('button');
    botaoCodigo.type = 'button';
    botaoCodigo.className = 'botao-pequeno';
    botaoCodigo.textContent = 'Código';
    botaoCodigo.setAttribute('aria-label', 'Copiar código ' + pop.codigo);
    botaoCodigo.addEventListener('click', function () {
      copiarTexto(pop.codigo, 'Código copiado');
    });
    celulaAcoes.appendChild(botaoCodigo);

    // botão "Texto OS": só aparece nos POPs de preventiva
    if (pop.ehPreventiva) {
      const botaoTexto = document.createElement('button');
      botaoTexto.type = 'button';
      botaoTexto.className = 'botao-pequeno';
      botaoTexto.style.marginLeft = '6px';
      botaoTexto.textContent = 'Texto OS';
      botaoTexto.setAttribute('aria-label', 'Abrir texto da OS do ' + pop.codigo);
      botaoTexto.addEventListener('click', function () {
        if (pop.codigo.endsWith('047')) {
          abrirModal(CARD_MAPA, CARD_MAPA.botoes[0]);
        } else {
          valores.pop = pop.codigo;
          abrirModal(CARD_PREVENTIVA, CARD_PREVENTIVA.botoes[0]);
        }
      });
      celulaAcoes.appendChild(botaoTexto);
    }
    tabelaPops.appendChild(linha);
  }

  // Estado vazio: avisa em vez de mostrar tabela em branco
  if (quantos === 0) {
    tabelaPops.innerHTML = '<tr><td colspan="3">Nenhum POP encontrado.</td></tr>';
  }
  return quantos;
}


/* ---------- 5. BUSCA E FILTRO ---------- */

/* Decide quais seções e cards aparecem, de acordo com a aba e a busca */
function aplicarFiltro() {
  const busca = semAcento(campoBusca.value.trim());
  let secoesVisiveis = 0;

  const secoes = document.querySelectorAll('#area-secoes .secao');
  for (const secao of secoes) {
    const id = secao.dataset.id;

    // 1) esconde cada card que não combina com a busca
    let temCardVisivel = false;
    const cards = secao.querySelectorAll('.card');
    for (const card of cards) {
      const combina = card.dataset.busca.includes(busca);
      card.hidden = !combina;
      if (combina) {
        temCardVisivel = true;
      }
    }

    // 2) decide se a seção inteira aparece
    let abaPermite = false;
    if (busca !== '') {
      abaPermite = true;                        // pesquisando: procura em todas
    } else if (abaAtual === 'todos') {
      abaPermite = id !== 'equipamentos';       // "Todos" não mostra a lista longa
    } else {
      abaPermite = abaAtual === id;
    }

    secao.hidden = !(abaPermite && temCardVisivel);
    if (!secao.hidden) {
      secoesVisiveis = secoesVisiveis + 1;
    }
  }

  // 3) catálogo de POPs
  const quantosPops = montarTabelaPops();
  const popsPermite = abaAtual === 'todos' || abaAtual === 'pops' || busca !== '';
  secaoPops.hidden = !popsPermite;

  // 4) mensagem de "nada encontrado"
  const popsVisivel = popsPermite && quantosPops > 0;
  semResultado.hidden = secoesVisiveis > 0 || popsVisivel;
}


/* ---------- 6. JANELA (MODAL) ---------- */

/* Troca {empresa}, {pop}... pelo que foi digitado. O que faltar vira (Empresa), (POP)... */
function gerarTexto() {
  camposFaltando = [];

  const textoPronto = modeloAtual.texto.replace(/\{(\w+)\}/g, function (inteiro, nomeCampo) {
    const valor = (valores[nomeCampo] || '').trim();
    if (valor !== '') {
      return valor;
    }
    camposFaltando.push(ROTULOS[nomeCampo]);
    return '(' + ROTULOS[nomeCampo] + ')';
  });

  textoFinal.value = textoPronto;
}

/* Cria os atalhos de empresa (Surgical, Vilela...) */
function criarAtalhosEmpresa(campo) {
  const caixa = document.createElement('div');
  caixa.className = 'atalhos';

  function desenhar() {
    caixa.innerHTML = '';
    const todas = EMPRESAS_PADRAO.concat(empresasSalvas);

    for (const nome of todas) {
      const botao = document.createElement('button');
      botao.type = 'button';
      botao.className = 'atalho';
      botao.textContent = nome;
      botao.addEventListener('click', function () {
        campo.value = nome;
        valores.empresa = nome;
        gerarTexto();
      });

      // empresas salvas por você ganham um × para remover
      if (empresasSalvas.includes(nome)) {
        const remover = document.createElement('span');
        remover.textContent = ' ×';
        remover.title = 'Remover atalho';
        remover.addEventListener('click', function (evento) {
          evento.stopPropagation();
          empresasSalvas = empresasSalvas.filter(function (e) { return e !== nome; });
          guardarNoNavegador('empresas', empresasSalvas);
          desenhar();
        });
        botao.appendChild(remover);
      }
      caixa.appendChild(botao);
    }

    const salvar = document.createElement('button');
    salvar.type = 'button';
    salvar.className = 'atalho salvar';
    salvar.textContent = 'Salvar atalho';
    salvar.addEventListener('click', function () {
      const nome = campo.value.trim();
      if (nome !== '' && !todas.includes(nome)) {
        empresasSalvas.push(nome);
        guardarNoNavegador('empresas', empresasSalvas);
        desenhar();
      }
    });
    caixa.appendChild(salvar);
  }

  desenhar();
  return caixa;
}

/* Abre o modal com o modelo escolhido */
function abrirModal(card, botao) {
  const tipo = TIPOS[card.tipo];
  let titulo = card.titulo;
  if (botao.status !== 'neutro') {
    titulo = titulo + ', ' + botao.rotulo.toLowerCase();
  }

  modeloAtual = { texto: botao.texto, titulo: titulo + ' (' + tipo.nome + ')' };
  modalTitulo.textContent = titulo;
  modalTipo.textContent = tipo.nome;
  modal.style.setProperty('--matiz', tipo.matiz);

  // cria um campo para cada item da lista botao.campos
  modalCampos.innerHTML = '';
  for (const nomeCampo of botao.campos) {
    const caixa = document.createElement('div');
    caixa.className = 'campo';
    caixa.innerHTML =
      '<label for="campo-' + nomeCampo + '">' + ROTULOS[nomeCampo] + '</label>' +
      '<input id="campo-' + nomeCampo + '" type="text" autocomplete="off" placeholder="' + DICAS[nomeCampo] + '">';

    const input = caixa.querySelector('input');
    input.value = valores[nomeCampo] || '';
    if (nomeCampo === 'pop') {
      input.setAttribute('list', 'lista-pops'); // liga ao autocompletar
    }
    if (nomeCampo === 'certificado') {
      input.setAttribute('inputmode', 'numeric'); // teclado numérico no celular
    }

    input.addEventListener('input', function () {
      valores[nomeCampo] = input.value;
      gerarTexto();
    });

    modalCampos.appendChild(caixa);
    if (nomeCampo === 'empresa') {
      caixa.appendChild(criarAtalhosEmpresa(input));
    }
  }

  gerarTexto();
  modal.showModal();

  // coloca o cursor no primeiro campo (menos cliques para o usuário)
  const primeiroCampo = modalCampos.querySelector('input');
  if (primeiroCampo) {
    primeiroCampo.focus();
  }
}

/* Botão "Copiar texto" */
async function copiarDoModal() {
  let mensagem = 'Texto copiado';
  if (camposFaltando.length > 0) {
    // BOA PRÁTICA (UX): avisa o que ficou sem preencher, mas deixa copiar
    mensagem = 'Copiado, mas falta preencher: ' + camposFaltando.join(', ');
  }

  const copiou = await copiarTexto(textoFinal.value, mensagem);
  if (copiou) {
    guardarNoHistorico(textoFinal.value, modeloAtual.titulo);
    modal.close();
  }
}


/* ---------- 7. HISTÓRICO ---------- */

/* Guarda o texto copiado (no máximo 20, o mais novo primeiro) */
function guardarNoHistorico(texto, titulo) {
  const semRepetido = historico.filter(function (item) { return item.texto !== texto; });
  semRepetido.unshift({ texto: texto, titulo: titulo, data: Date.now() });
  historico = semRepetido.slice(0, 20);
  guardarNoNavegador('historico', historico);
}

/* Desenha a lista do histórico dentro da janela */
function desenharHistorico() {
  listaHistorico.innerHTML = '';

  if (historico.length === 0) {
    listaHistorico.textContent = 'Nada copiado ainda.';
    return;
  }

  for (const item of historico) {
    const caixa = document.createElement('div');
    caixa.className = 'item-historico';
    caixa.innerHTML = '<div class="item-historico-topo"><strong></strong><span></span></div><p></p>';

    // textContent (e não innerHTML) é mais seguro para texto digitado
    caixa.querySelector('strong').textContent = item.titulo;
    caixa.querySelector('span').textContent = new Date(item.data).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });
    caixa.querySelector('p').textContent = item.texto;

    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'botao-pequeno';
    botao.textContent = 'Copiar de novo';
    botao.addEventListener('click', function () {
      copiarTexto(item.texto, 'Texto copiado');
    });
    caixa.appendChild(botao);

    listaHistorico.appendChild(caixa);
  }
}


/* ---------- 8. EVENTOS E INÍCIO ---------- */

// Busca: filtra enquanto digita
campoBusca.addEventListener('input', aplicarFiltro);
campoFiltroPops.addEventListener('input', aplicarFiltro);

// Modal do texto
document.getElementById('modal-x').addEventListener('click', function () { modal.close(); });
document.getElementById('modal-cancelar').addEventListener('click', function () { modal.close(); });
document.getElementById('modal-copiar').addEventListener('click', copiarDoModal);

// Clicar no fundo escuro (fora da janela) também fecha
modal.addEventListener('click', function (evento) {
  if (evento.target === modal) {
    modal.close();
  }
});
modalHistorico.addEventListener('click', function (evento) {
  if (evento.target === modalHistorico) {
    modalHistorico.close();
  }
});

// Janela do histórico
document.getElementById('btn-historico').addEventListener('click', function () {
  desenharHistorico();
  modalHistorico.showModal();
});
document.getElementById('historico-x').addEventListener('click', function () { modalHistorico.close(); });
document.getElementById('historico-fechar').addEventListener('click', function () { modalHistorico.close(); });
document.getElementById('historico-limpar').addEventListener('click', function () {
  historico = [];
  guardarNoNavegador('historico', historico);
  desenharHistorico();
});

// Sugestões do campo POP (só POPs de preventiva)
const listaSugestoes = document.getElementById('lista-pops');
for (const pop of POPS) {
  if (pop.ehPreventiva) {
    const opcao = document.createElement('option');
    opcao.value = pop.codigo;
    opcao.label = nomeDoEquipamento(pop.nome);
    listaSugestoes.appendChild(opcao);
  }
}

// INÍCIO: monta tudo e aplica o filtro uma vez
montarAbas();
montarSecoes();
montarEquipamentos();
aplicarFiltro();
