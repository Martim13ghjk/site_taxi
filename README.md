# Douro Táxi

Site estático em português e inglês, sem instalação de dependências. A página inicial apresenta serviços e percursos; `contacto.html` reúne contactos e pedidos de orçamento. O serviço e passeio escolhidos são transportados para a página de contacto, usando armazenamento temporário de sessão para o percurso.

## Pré-visualizar

Executar `node preview.cjs` nesta pasta e abrir http://127.0.0.1:4173.

## Antes de publicar

Preencher `config.js` com telefone e WhatsApp em formato internacional (`+351` seguido do número real), e-mail e, se existir, ligação HTTPS para avaliações reais. Sem contactos configurados, o site mostra essa limitação e permite apenas preparar, copiar ou guardar pedidos. Não envia pedidos nem confirma reservas automaticamente.

Confirmar com a empresa as sugestões de percursos, serviços, fotografias e condições. Adicionar informação real sobre horários, área de serviço, passageiros, bagagem, idiomas e avaliações quando disponível. Não foram inventados preços, avaliações ou capacidade da viatura. Completar os dados empresariais e informação de privacidade aplicáveis antes do lançamento.

O formulário mantém os dados introduzidos apenas em memória nesta página. A sugestão escolhida no planeador é guardada temporariamente na sessão até abrir o contacto. O idioma é guardado no navegador. Os botões WhatsApp/e-mail preparam a mensagem para envio pelo visitante. Fontes são obtidas do Google Fonts; os mapas abrem o Google Maps apenas por escolha do visitante.

Fotografias WebP otimizadas em `assets/images`; os originais foram mantidos. `index.original.html` e `style.original.css` guardam a versão anterior. Ao publicar, incluir apenas `index.html`, `contacto.html`, `style.css`, `motion.css`, `app.js`, `motion.js`, `config.js` e `assets/images`, excluindo ficheiros de pré-visualização, documentação e cópias originais.

## Verificação

Verificados no navegador: apresentação, alternância PT/EN com manutenção dos campos, pedido de transfer com voo e regresso, pré-visualização do pedido, percursos, menu móvel e rejeição de regresso anterior à ida. Sem imagens em falta nem deslocação horizontal na largura móvel testada. Envio externo não testado: faltam contactos reais.


Animações decorativas em motion.js e motion.css: entrada de secções, fotografia inicial, botões e FAQs. Respeitam a preferência de movimento reduzido e mantêm o conteúdo acessível sem animações. Cartões de serviços em coluna única em ecrãs até 540 px.
