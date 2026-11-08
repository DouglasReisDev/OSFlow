/* ==========================================================
   dados.js  |  TODOS OS TEXTOS E CARDS DO SITE
   ----------------------------------------------------------
   Aqui ficam só DADOS (nada de tela). Para mudar um texto de
   fechamento, é neste arquivo que você mexe.

   Marcadores dentro dos textos (viram campos no modal):
     {empresa}  {pop}  {certificado}  {avaria}  {motivo}
   ========================================================== */


/* ---------- ANO ATUAL ----------
   Usado no número do certificado. Em 2026 vira "26". */
const ANO = String(new Date().getFullYear()).slice(2);


/* ---------- TIPOS DE CARD ----------
   Cada tipo tem um nome e uma cor (matiz de 0 a 360 no círculo de cores).
   A MESMA cor aparece em todas as abas para o mesmo tipo.
   Verde e vermelho ficam reservados para Conforme / Não conforme. */
const TIPOS = {
  engenharia:         { nome: 'Engenharia Clínica',  matiz: 175 },
  terceiros:          { nome: 'Terceiros',           matiz: 225 },
  preventiva:         { nome: 'Preventiva',          matiz: 280 },
  mapa:               { nome: 'MAPA',                matiz: 315 },
  naoRealizado:       { nome: 'Não realizado',       matiz: 28  },
  naoLocalizado:      { nome: 'Não localizado',      matiz: 50  },
  naoDisponibilizado: { nome: 'Não disponibilizado', matiz: 95  }
};


/* ---------- PROCEDIMENTOS ---------- */
const PROCEDIMENTO_CALIBRACAO = 'PRS ENG 04';
const POP_PRESSAO = 'POP ENG 034';


/* ==========================================================
   FUNÇÕES QUE MONTAM OS TEXTOS
   Parâmetros: conforme (true/false) e terceiro (true/false)
   ========================================================== */

/* Calibração: análise crítica */
function analiseCalibracao(procedimento, conforme, terceiro) {
  let quemFez = 'conduzidos de acordo com';
  if (terceiro) {
    quemFez = 'realizados pela empresa {empresa}, seguindo';
  }

  let resultado = 'não apresentou valores dentro do limite aceitável. Portanto, este se encontra inapto para uso.';
  if (conforme) {
    resultado = 'apresentou valores dentro do limite aceitável. É seguro concluir, portanto, que ele está apto para uso.';
  }

  return 'Durante os ensaios de calibração ' + quemFez + ' as diretrizes estabelecidas pelo ' +
    procedimento + ' e a tabela de critérios de aceitação, foi constatado que o equipamento ' + resultado;
}

/* Calibração: descrição de serviço */
function descricaoCalibracao(procedimento, conforme, terceiro) {
  let quemFez = 'Eng Clínica';
  if (terceiro) {
    quemFez = 'empresa {empresa}';
  }

  if (conforme) {
    let certificado = ' CAL/ENG{certificado}-' + ANO;
    if (terceiro) {
      certificado = ''; // terceiros: o certificado só segue em anexo
    }
    return 'A Calibração foi REALIZADA CONFORME pela ' + quemFez + ', de acordo com o ' + procedimento +
      ' e tabela de critérios de aceitação. Testes funcionais ok. Equipamento apto para uso. ' +
      'Segundo certificado em anexo' + certificado + '.';
  }

  return 'A calibração foi REALIZADA NÃO CONFORME, pois durante a manutenção programada executada pela ' +
    quemFez + ', seguindo o ' + procedimento + ' o equipamento apresentou valores fora dos limites ' +
    'estabelecidos pela tabela de critérios de aceitação. Dessa forma, estando inapto para uso.';
}

/* TSE (Teste de Segurança Elétrica): análise crítica.
   Atenção: o modelo de terceiros foi adaptado do modelo da Eng Clínica. Confira a redação. */
function analiseTse(conforme, terceiro) {
  let quemFez = 'conforme';
  if (terceiro) {
    quemFez = 'pela empresa {empresa}, conforme';
  }

  let resultado = 'fora dos limites aceitáveis e encontra-se inapto para uso.';
  if (conforme) {
    resultado = 'aceitáveis e encontra-se apto para uso.';
  }

  return 'Durante o Teste de Segurança Elétrica realizado ' + quemFez +
    ' as normas ABNT (IEC 60601-1 / IEC 62353) e POP ENG 068 o equipamento apresentou valores ' + resultado;
}

/* TSE: descrição de serviço */
function descricaoTse(conforme, terceiro) {
  let quemFez = 'Eng Clínica';
  if (terceiro) {
    quemFez = 'empresa {empresa}';
  }

  let certificado = ' TSE/ENG{certificado}-' + ANO;
  if (terceiro) {
    certificado = '';
  }
  const final = ' De acordo com certificado' + certificado + ' em anexo.';

  if (conforme) {
    return 'O Teste de Segurança elétrica foi REALIZADO CONFORME pela ' + quemFez +
      ', seguindo as diretrizes do POP ENG 068. Testes funcionais ok. Equipamento apto para uso.' + final;
  }

  return 'O Teste de Segurança elétrica foi REALIZADO NÃO CONFORME pela ' + quemFez +
    ', pois mesmo seguindo as diretrizes do POP ENG 068, o equipamento apresentou valores fora do limite ' +
    'aceitável, estando portanto inapto para uso.' + final;
}

/* Preventiva padrão */
const TEXTO_PREVENTIVA_CONFORME =
  'A manutenção preventiva foi REALIZADA CONFORME pela Eng clínica, seguindo as diretrizes do {pop}, ' +
  'no qual foram executados testes funcionais e este apresentou desempenho esperado pelos padrões ' +
  'estabelecidos, atestando sua aptidão para uso.';

const TEXTO_PREVENTIVA_NAO_CONFORME =
  'A manutenção preventiva foi REALIZADA NÃO CONFORME, pois durante a execução pela Eng clínica, ' +
  'seguindo as diretrizes do {pop}, o equipamento apresentou a seguinte avaria: {avaria}, ' +
  'no qual foi atestado sua inaptidão para uso.';

const TEXTO_MAPA =
  'Manutenção preventiva em MAPA realizada com sucesso conforme o POP ENG 047, equipamento liberado para uso.';


/* ==========================================================
   FUNÇÕES PARA CRIAR OS BOTÕES
   Um botão é um objeto: { rotulo, status, texto, campos }
   - status: 'ok' (verde), 'nc' (vermelho) ou 'neutro'
   - campos: quais campos o modal deve pedir
   ========================================================== */

/* Cria o par de botões "Conforme" e "Não conforme" */
function criarPar(textoConforme, textoNaoConforme, camposConforme, camposNaoConforme) {
  return [
    { rotulo: 'Conforme',     status: 'ok', texto: textoConforme,     campos: camposConforme },
    { rotulo: 'Não conforme', status: 'nc', texto: textoNaoConforme,  campos: camposNaoConforme }
  ];
}

/* Cria um botão único (sem conforme / não conforme) */
function criarBotaoUnico(texto, campos) {
  return [{ rotulo: 'Abrir modelo', status: 'neutro', texto: texto, campos: campos }];
}

/* Botões de calibração (interna ou de terceiros) */
function botoesCalibracao(funcaoTexto, procedimento, terceiro, pedeCertificado) {
  let camposConforme = [];
  let camposNaoConforme = [];

  if (terceiro) {
    camposConforme = ['empresa'];
    camposNaoConforme = ['empresa'];
  } else if (pedeCertificado) {
    camposConforme = ['certificado'];
  }

  return criarPar(
    funcaoTexto(procedimento, true, terceiro),
    funcaoTexto(procedimento, false, terceiro),
    camposConforme,
    camposNaoConforme
  );
}

/* Botões de TSE (interna ou de terceiros) */
function botoesTse(funcaoTexto, terceiro, pedeCertificado) {
  let campos = [];
  if (terceiro) {
    campos = ['empresa'];
  } else if (pedeCertificado) {
    campos = ['certificado'];
  }
  return criarPar(funcaoTexto(true, terceiro), funcaoTexto(false, terceiro), campos, campos);
}


/* ==========================================================
   CARDS QUE O APP.JS TAMBÉM USA (catálogo de POPs e equipamentos)
   ========================================================== */
const CARD_PREVENTIVA = {
  tipo: 'preventiva',
  titulo: 'Manutenção preventiva padrão',
  descricao: 'Escolha o POP. Na não conformidade, descreva a avaria.',
  botoes: criarPar(TEXTO_PREVENTIVA_CONFORME, TEXTO_PREVENTIVA_NAO_CONFORME, ['pop'], ['pop', 'avaria'])
};

const CARD_MAPA = {
  tipo: 'mapa',
  titulo: 'MAPA',
  descricao: 'Modelo específico do POP ENG 047.',
  botoes: criarBotaoUnico(TEXTO_MAPA, [])
};


/* ==========================================================
   SEÇÕES (cada uma vira uma aba)
   ========================================================== */
const SECOES = [
  {
    id: 'calibracao',
    nome: 'Calibração',
    descricao: 'Ensaios conduzidos segundo as diretrizes do PRS ENG 04',
    etiqueta: 'PRS ENG 04',
    cards: [
      { tipo: 'engenharia', titulo: 'Análise crítica',
        descricao: 'Conduzida pela equipe interna, conforme tabela de critérios de aceitação.',
        botoes: botoesCalibracao(analiseCalibracao, PROCEDIMENTO_CALIBRACAO, false, false) },
      { tipo: 'terceiros', titulo: 'Análise crítica',
        descricao: 'Realizada por empresa contratada. Informe a empresa.',
        botoes: botoesCalibracao(analiseCalibracao, PROCEDIMENTO_CALIBRACAO, true, false) },
      { tipo: 'engenharia', titulo: 'Descrição de serviço',
        descricao: 'Calibração interna com certificado CAL/ENG em anexo.',
        botoes: botoesCalibracao(descricaoCalibracao, PROCEDIMENTO_CALIBRACAO, false, true) },
      { tipo: 'terceiros', titulo: 'Descrição de serviço',
        descricao: 'Calibração executada por terceiros, certificado em anexo.',
        botoes: botoesCalibracao(descricaoCalibracao, PROCEDIMENTO_CALIBRACAO, true, false) }
    ]
  },
  {
    id: 'tse',
    nome: 'TSE',
    descricao: 'Normas ABNT (IEC 60601-1 / IEC 62353) e POP ENG 068',
    etiqueta: 'POP ENG 068',
    cards: [
      { tipo: 'engenharia', titulo: 'Análise crítica',
        descricao: 'Teste de segurança elétrica: valores dentro ou fora dos limites.',
        botoes: botoesTse(analiseTse, false, false) },
      { tipo: 'terceiros', titulo: 'Análise crítica',
        descricao: 'Teste realizado por empresa contratada. Informe a empresa.',
        botoes: botoesTse(analiseTse, true, false) },
      { tipo: 'engenharia', titulo: 'Descrição de serviço',
        descricao: 'Laudo descritivo com número do certificado TSE/ENG.',
        botoes: botoesTse(descricaoTse, false, true) },
      { tipo: 'terceiros', titulo: 'Descrição de serviço',
        descricao: 'Teste executado por terceiros, certificado em anexo.',
        botoes: botoesTse(descricaoTse, true, false) }
    ]
  },
  {
    id: 'preventiva',
    nome: 'Preventiva',
    descricao: 'Manutenções periódicas programadas por POP específico',
    etiqueta: 'POP geral',
    cards: [CARD_PREVENTIVA, CARD_MAPA]
  },
  {
    id: 'pressao',
    nome: 'Aparelho de pressão',
    descricao: 'Calibração segundo o POP ENG 034',
    etiqueta: 'POP ENG 034',
    cards: [
      { tipo: 'engenharia', titulo: 'Análise crítica',
        descricao: 'Valores dentro ou fora do limite aceitável.',
        botoes: botoesCalibracao(analiseCalibracao, POP_PRESSAO, false, false) },
      { tipo: 'engenharia', titulo: 'Descrição de serviço',
        descricao: 'Calibração interna com certificado CAL/ENG em anexo.',
        botoes: botoesCalibracao(descricaoCalibracao, POP_PRESSAO, false, true) }
    ]
  },
  {
    id: 'ocorrencias',
    nome: 'Ocorrências',
    descricao: 'Justificativas para manutenção programada não realizada no mês',
    etiqueta: 'Impedimentos',
    cards: [
      { tipo: 'naoRealizado', titulo: 'Não realizado',
        descricao: 'Impedimento técnico ou operacional. Informe o motivo.',
        botoes: criarBotaoUnico(
          'NÃO REALIZADO, pois o equipamento apresentou {motivo}, mediante ao fato descrito a manutenção programada não pôde ser executada.',
          ['motivo']) },
      { tipo: 'naoLocalizado', titulo: 'Não localizado',
        descricao: 'Equipamento não localizado no setor no mês vigente.',
        botoes: criarBotaoUnico(
          'NÃO LOCALIZADO, pelo setor de origem, para realização da sua manutenção programada dentro do mês vigente.', []) },
      { tipo: 'naoDisponibilizado', titulo: 'Não disponibilizado',
        descricao: 'Setor não liberou o aparelho para a manutenção.',
        botoes: criarBotaoUnico(
          'NÃO DISPONIBILIZADO, pelo setor de origem, para realização da sua manutenção programada dentro do mês vigente.', []) }
    ]
  }
];

/* Empresas que aparecem como atalho no campo "Empresa" */
const EMPRESAS_PADRAO = ['Surgical', 'Vilela', 'Geeta', 'Precisa', 'Drager', 'Mhedica'];
