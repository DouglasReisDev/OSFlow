/* ==========================================================
   pops.js  |  LISTA DOS POPs (Procedimentos Operacionais Padrão)
   ----------------------------------------------------------
   Cada linha tem: número de 3 dígitos + espaço + nome do POP.
   Para adicionar um POP novo, é só incluir uma linha aqui.
   ========================================================== */
const LISTA_POPS = `
001 Tratamento de solicitações de serviço
002 Atualizações e Revisões de Cronogramas de Manutenções Programadas
003 Aquisição, Avaliação, Especificação, Recebimento, Instalação e Treinamento
004 Manutenção Preventiva em Monitores Multiparâmetros
005 Manutenção Preventiva em Cardioversores
006 Manutenção Preventiva em Carrinhos de Anestesia
007 Manutenção Preventiva em Oxímetros
008 Manutenção Preventiva em Bisturis
009 Manutenção Preventiva em Focos Cirúrgicos
010 Manutenção Preventiva em Mesas Cirúrgicas
011 Manutenção Preventiva em Câmeras de Vídeo
012 Manutenção Preventiva em Raio-X
013 Manutenção Preventiva em Microscópios Cirúrgicos
014 Manutenção Preventiva em Fontes de Luz
015 Manutenção Preventiva em Insufladores
016 Manutenção Preventiva em Circulação Extra Corpórea
017 Manutenção Preventiva em Ventiladores/Respiradores
018 Manutenção Preventiva em Arcos Cirúrgicos
019 Manutenção Preventiva em Aparelho de Ultrassom
020 Manutenção Preventiva em Eletrocardiógrafos
021 Manutenção Preventiva em Aspiradores de Secreção
022 Manutenção Preventiva em Processador de Filmes
023 Manutenção Preventiva em Esteiras Ergométricas
024 Manutenção Preventiva em Holter
025 Manutenção Preventiva em Lavadora Ultrassônica
026 Coleta de Água para análise - CME
027 Manutenção Preventiva em Balão Intra-aórtico
028 Realização da Manutenção Preventiva em Máquinas de Hemodiálise
029 Manutenção Preventiva nas Reprocessadoras de Capilares
030 Manutenção Preventiva do sistema de controle e produção de concentrado
031 Desinfecção do tanque de água tratada e do loop de distribuição com ozônio
032 Realização da Desinfecção do Tanque de Água Tratada e Sistema do Loop de Distribuição
033 Manutenção Preventiva do Sistema de Tratamento do serviço de diálise
034 Calibração de aparelho de pressão
035 Coleta de água para análise - Diálise
036 Manual de conduta para o tratamento de água
037 Sistema Operacional do Tratamento de Água da Hemodiálise
038 Teste Diário do Sistema de Tratamento de Água da Diálise
039 Manutenção Preventiva em Osmose Reversa 1º passo
040 Manutenção Preventiva em Osmose Reversa 2º passo
041 Rotinas para Tecnovigilância
042 Manutenção Preventiva em Armário de Vídeo
043 Manutenção Preventiva em Aquecedor
044 Manutenção Preventiva em Balança
045 Manutenção Preventiva em Bilispot
046 Manutenção Preventiva em Incubadora
047 Manutenção Preventiva em MAPA
048 Manutenção Preventiva em Torniquete
049 Manutenção Preventiva em Craniótomo
050 Manutenção Preventiva em Urodinâmica
051 Manutenção Preventiva em Hemocron
053 Processo Administrativo - Montagem de orçamentos
054 Manutenção Preventiva em Colposcópio/Videocolposcópio
055 Manutenção Preventiva em Polígrafo
056 Manutenção Preventiva em Micrótomo
057 Manutenção Preventiva em Serra de Gesso
058 Manutenção Preventiva em Radiômetro
059 Avaliação e verificação de certificado de calibração e TSE
060 Manutenção Preventiva em Otocalorímetro
061 Recebimento e conferência de notas fiscais
062 Processo Administrativo - Alimentação de planilhas
063 Processo Administrativo - Arquivamento de documentos
064 Descontinuidade e descarte em equipamento eletromédico e instrumentos de medição
065 Validação dos serviços de calibração
066 Realização da Desinfecção do Tanque de Água Tratada e Sistema do Loop de Distribuição do CME
067 Teste Diário do Sistema de Tratamento de Água da CME
068 Teste de Segurança Elétrica
069 Manutenção Preventiva em Bomba de Sangue
070 Manutenção em CAMA
071 Manutenção Preventiva em Estufa para Cultura
072 Manutenção Preventiva em Audiômetro Siemens
073 Manutenção Preventiva em Detector Fetal
074 Manutenção Preventiva em Impedanciômetro
075 Manutenção Preventiva em Monitor de Óxido Nítrico
076 Manutenção Preventiva em Rotem Delta
077 Manutenção Preventiva em Spot Signs XLi
078 Manutenção Preventiva em Video Printer
079 Manutenção Preventiva em Elevador
080 Manutenção Preventiva em Eletroencefalógrafo
081 Manutenção Preventiva em Walbox
082 Manutenção Preventiva em Osmose Reversa Portátil
083 Abertura de chamados técnicos para empresas terceirizadas
084 Manutenção Corretiva
085 Verificação - Atualização da Planilha de Padrão de Fornecedores
086 Teste de Linearidade dos Glicosímetros Freestyle Precision Pro Abbott
087 Geração e Impressão de OS Programadas
088 Manutenção Preventiva em Autoclave Vertical AV75
`;
