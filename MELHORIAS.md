# Plano de Melhorias - app-intersig

## ✅ 1. Índices de Banco de Dados
- [x] Adicionar índices em `database-schema.ts`:
  - [x] `idx_pedidos_tipo ON pedidos(tipo)`
  - [x] `idx_pedidos_vendedor ON pedidos(vendedor)`
  - [x] `idx_pedidos_data ON pedidos(data_cadastro)`
  - [x] `idx_pedidos_situacao ON pedidos(situacao)`
  - [x] `idx_pedidos_cliente ON pedidos(cliente)`
  - [x] `idx_produtos_pedido_pedido ON produtos_pedido(pedido)`
  - [x] `idx_produtos_pedido_codigo ON produtos_pedido(codigo)`
  - [x] `idx_clientes_nome ON clientes(nome)`
  - [x] `idx_clientes_vendedor ON clientes(vendedor)`
  - [x] `idx_clientes_cnpj ON clientes(cnpj)`
  - [x] `idx_produtos_descricao ON produtos(descricao)`
  - [x] `idx_produtos_num_fabricante ON produtos(num_fabricante)`
  - [x] `idx_produtos_num_original ON produtos(num_original)`
  - [x] `idx_produtos_sku ON produtos(sku)`
  - [x] `idx_produtos_marca ON produtos(marca)`
  - [x] `idx_servicos_pedido_pedido ON servicos_pedido(pedido)`
  - [x] `idx_parcelas_pedido ON parcelas(pedido)`
  - [x] `idx_fotos_produto ON fotos_produtos(produto)`
  - [x] `idx_usuarios_email ON usuarios(email)`
  - [x] `idx_empresas_cnpj ON empresas(cnpj)`

## ✅ 2. Tela de Login (idêntica ao app-estoque)
- [x] Redesign completo do `src/screens/login/index.tsx`
- [x] Layout visual igual ao app-estoque (logo, campos, botões, cores)
- [x] Manter funcionalidades existentes (email/senha, "lembrar-me", "esqueci a senha")
- [x] Manter lógica offline-first (autologin com usuário local)

## ⬜ 3. Consultas à API (backend atualizado)
> Nota: ajuste manual pelo usuário, pois a API foi atualizada.
- [ ] Revisar funções de consulta à API nos sync hooks
- [ ] Ajustar payloads/endpoints conforme nova API

## ✅ 4. Componente CustomHeader Reutilizável
- [x] Criar `src/components/custom-header/index.tsx` (baseado no app-estoque)
- [x] Header azul (#185FED) com `borderBottomLeftRadius: 20`, `borderBottomRightRadius: 20`
- [x] Barra de busca integrada (fundo branco, 45px altura, borderRadius: 8, ícone lupa)
- [x] Sombra iOS + Android
- [x] Substituir headers inline em:
  - [x] `src/screens/Produtos/index.tsx`
  - [x] `src/screens/clientes/index.tsx`
  - [x] `src/screens/servicos/index.tsx`
  - [x] `src/screens/categorias/index.tsx`
  - [x] `src/screens/marcas/index.tsx`
  - [x] `src/screens/caracteristicas/index.tsx`
  - [x] `src/screens/veiculos/index.tsx`
  - [x] `src/screens/formasDePagamento/index.tsx`
  - [x] `src/screens/usuarios/index.tsx`
  - [x] `src/screens/pedidos/index.tsx` (Lista_pedidos)

## ✅ 5. Componente CustomAlert
- [x] Criar `src/components/custom-alert/index.tsx` com 4 tipos:
  - [x] `success` (verde)
  - [x] `error` (vermelho)
  - [x] `warning` (laranja)
  - [x] `info` (azul)
- [x] Overlay escuro (`rgba(0,0,0, 0.8)`)
- [x] Card: `borderRadius: 16`, `padding: 25`
- [x] Círculo de ícone: 70x70, borderRadius: 35
- [x] Dois botões (cancelar/confirmar)
- [x] Substituir `Alert.alert()` nativo em:
  - [x] `src/screens/login/index.tsx`
  - [x] `src/screens/home/index.tsx`

## ✅ 6. Tela de Registro de Pedidos (Pedido_Component)
- [x] Redesign completo de `src/components/pedido-components/components/main/index.tsx`
- [x] Layout padronizado com cards `borderRadius: 12`, sombras, bordas laterais
- [x] Melhor espaçamento e hierarquia visual entre seções (cliente, produtos, serviços, parcelas)
- [x] Cabeçalho com CustomHeader
- [x] Botões padronizados (borderRadius: 10-12, paddingVertical: 12-15)
- [x] Inputs padronizados (underline azul ou fundo #F5F7FA)
- [x] Indicadores visuais de etapas preenchidas vs pendentes

## ✅ 7. Modais de Parâmetros do Pedido
- [x] Melhorias visuais nos modais usados durante a criação do pedido:
  - [x] `src/components/pedido-components/components/clientes/index.tsx` (seleção de cliente)
  - [x] `src/components/pedido-components/components/produtos/index.tsx` (busca de produtos)
  - [x] `src/components/pedido-components/components/servico/index.tsx` (seleção de serviços)
  - [x] `src/components/pedido-components/components/parcelas/index.tsx` (configuração de parcelas)
  - [ ] `src/components/pedido-components/components/parcelasPersonalizada/index.tsx`
  - [x] `src/components/selectCliente/index.tsx` (modal de seleção de cliente)
- [x] Padronizar com overlay `rgba(0,0,0,0.5)`, borderRadius: 16, header azul
- [x] Listas com cards padronizados e ícones

## ✅ 8. Telas de Cadastro (Melhorias Visuais)
- [x] Aplicar padrão visual consistente em todas as telas de cadastro:
  - [x] `src/screens/cadastro_produto/index.tsx` (CustomHeader, save button, inputs)
  - [x] `src/screens/cadastro_cliente/index.tsx` (CustomHeader, cards borderRadius:12, save button, endereço modal)
  - [x] `src/screens/cadastro_servicos/index.tsx` (CustomHeader, form card borderRadius:12, save button)
  - [x] `src/screens/cadastro-FormaPagamento/index.tsx` (CustomHeader, form card, inputs padronizados)
  - [x] `src/screens/cadastro-caracteristicas/index.tsx` (CustomHeader, form card borderRadius:12, save button)
  - [x] `src/screens/cadastrarMarcas/index.tsx` (CustomHeader, form card borderRadius:12, save button)
  - [x] `src/screens/cadastrarCategorias/index.tsx` (CustomHeader, form card borderRadius:12, save button)
  - [x] `src/screens/cadastroVeiculo/index.tsx` (CustomHeader, form card borderRadius:12, save button)
  - [x] `src/screens/cadastrarUsuarios/index.tsx` (CustomHeader, form card borderRadius:12, save button)
- [x] Formulários com inputs padronizados (borderWidth, borderRadius:8, backgroundColor:#F9F9F9)
- [x] Botões de salvar padronizados (borderRadius:10, paddingVertical:14, shadow)
- [x] Headers com CustomHeader (com back button) em todas as telas

## ✅ 9. Melhorias na Tela de Pedidos (Lista_pedidos)
- [x] Legenda no rodapé com bolinhas coloridas + labels (Orçamento, Aprovado, Faturado, Reprovado, Parcial)
- [x] **RefreshControl** (pull-to-refresh) na FlatList
- [x] Badge de sincronia (Sinc./Pend.) com ícone + cor de fundo
- [x] Card padronizado: fundo branco, borderRadius: 12, borderLeftWidth: 5 com cor do status
- [x] Status badge como chip semi-transparente no header do card
- [x] Ações com fundo #E3F2FD e borderRadius
- [x] Divisores de seção: height: 1, backgroundColor: '#F0F0F0'
- [x] Empty state com ícone (receipt-long) e texto

## ✅ 10. Padronização de Cards (Listagens)
- [x] Unificar `borderRadius: 12` em todos os cards (pedidos, cadastros, modais)
- [x] Adicionar sombras iOS (`shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`)
- [x] Substituir fundo colorido por **borda lateral de 5px** com cor do status em:
  - [x] `src/screens/pedidos/index.tsx` (Lista_pedidos)
- [x] Adicionar divisores de seção: `height: 1, backgroundColor: '#F0F0F0'`
- [x] **Status badges**: chips semi-transparentes no canto do card
- [x] **Ações com container** fundo `#E3F2FD` e borderRadius

## ✅ 11. Padronização de Modais
- [x] Overlay consistente: `rgba(0,0,0,0.5)`
- [x] Card: `borderRadius: 16`, `overflow: 'hidden'`
- [x] Header azul #185FED com título branco + botão fechar
- [x] Unificar em:
  - [x] `src/components/pedido-components/components/clientes/index.tsx` ✅
  - [x] `src/components/pedido-components/components/produtos/index.tsx` ✅
  - [x] `src/components/pedido-components/components/servico/index.tsx` (3 modais) ✅
  - [x] `src/components/pedido-components/components/parcelas/index.tsx` (2 modais) ✅
  - [x] `src/components/selectCliente/index.tsx` ✅
  - [x] `src/screens/cadastro_cliente/index.tsx` (endereço modal) ✅
  - [x] `src/screens/pedidos/components/modal-filter/modal-filter.tsx`
  - [x] `src/screens/cadastro_produto/modalMarcas.tsx`
  - [x] `src/screens/cadastro_produto/modalCategorias.tsx`
  - [x] `src/screens/cadastro_produto/modal-caracteristicas.tsx`
  - [ ] `src/screens/pedidos/components/modal-print-pedido/index.tsx` (já possui estilo próprio)
  - [ ] `src/screens/cadastro_produto/modalFotos.tsx` (já possui estilo próprio)

## ✅ 12. FAB (Floating Action Button) Padronizado
- [x] Tamanho: 50x50, borderRadius: 25 (padrão consistente no app)
- [x] Sombras iOS + Android (elevation: 10)
- [x] Ícone: `MaterialIcons "add-circle" size={45}`
- [x] Posição consistente: `right: 30`
- [x] Unificar em todas as telas de listagem (padrão já consistente)

## ✅ 13. Barra de Busca Padronizada
- [x] Fundo branco, altura 45px, borderRadius: 8 (via CustomHeader)
- [x] Ícone de lupa dentro do input
- [x] `placeholderTextColor: '#999'`
- [x] Sem `elevation` no input
- [x] Unificar em todas as telas de listagem via CustomHeader

## ✅ 14. Estados Vazios
- [x] Criar componente `src/components/empty-state/index.tsx` reutilizável (ícone + texto)
- [x] Aplicado em:
  - [x] `src/screens/pedidos/index.tsx` (receipt-long icon + "Nenhum pedido encontrado")
  - [x] `src/screens/Produtos/index.tsx` (inventory-2)
  - [x] `src/screens/clientes/index.tsx` (people-outline)
  - [x] `src/screens/servicos/index.tsx` (build)
  - [x] `src/screens/categorias/index.tsx` (category)
  - [x] `src/screens/marcas/index.tsx` (trademark)
  - [x] `src/screens/caracteristicas/index.tsx` (list-alt)
  - [x] `src/screens/veiculos/index.tsx` (directions-car)
  - [x] `src/screens/formasDePagamento/index.tsx` (payment)
  - [x] `src/screens/usuarios/index.tsx` (person-outline)

## ✅ 15. Estilização de Botões
- [x] Padronizar `borderRadius: 10` em botões primários (cadastros, pedidos)
- [x] Aumentar padding vertical para 14
- [x] Adicionar sombra nos botões primários (shadowColor, elevation)

## ✅ 16. Inputs de Formulário
- [x] Padronizar inputs com `borderWidth: 1, borderColor: '#DEE2E6', borderRadius: 8, backgroundColor: '#F9F9F9'`
- [x] Inputs multi-line com backgroundColor: '#F9F9F9', borderRadius: 8

---

## Legenda
- ✅ Concluído
- ⬜ Pendente
- 🔄 Em andamento
