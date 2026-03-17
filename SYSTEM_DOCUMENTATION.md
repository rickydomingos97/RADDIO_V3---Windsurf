# Sistema Radddio - Documentação Técnica

## Visão Geral do Sistema

**Aplicação**: Single-page application (SPA) financeira para gestão de rádios
**Arquivo**: `index.html` (único arquivo com HTML, CSS e JavaScript)
**Armazenamento**: LocalStorage (persistência no navegador)
**Framework**: Vanilla JavaScript com Chart.js para visualizações

## Estrutura e Arquitetura

### Módulos Principais

#### 1. **Dashboard** (`renderDashboard()`)
- KPIs financeiros (entradas, saídas, saldo, inadimplência)
- Gráficos interativos (receitas vs despesas, P&L por emissora)
- Top empresas e transações recentes
- Filtros por emissora e período

#### 2. **Gestão Financeira**
- **Entradas** (`renderEntradas()`): Lançamentos de receitas
- **Despesas** (`renderDespesas()`): Controle de despesas com status automático
- **Fluxo de Caixa** (`renderFluxo()`): Análise de fluxo por período

#### 3. **Operações Comerciais**
- **Vendas** (`renderVendas()`): Gestão de vendas e comissões
- **Terceirizados** (`renderTerceirizados()`): Controle de serviços terceirizados
- **Empresas** (`renderClientes()`): Cadastro de clientes/empresas

#### 4. **Recursos e Ativos**
- **Emissoras** (`renderEmissoras()`): Gestão de rádios
- **Agentes** (`renderAgentes()`): Gestão de vendedores/agentes
- **Contas Investimento** (`renderContasInvestimento()`): Contas bancárias

#### 5. **Infraestrutura** (`renderInfraestrutura()`)
- Gestão de projetos de infraestrutura
- Controle de equipamentos e instalações
- Gráficos de evolução e status

#### 6. **Sistema e Configurações**
- **Backup/Restore**: Sistema completo de backup
- **Importação**: Importação de dados Excel
- **Segurança**: Controle de acesso e senhas
- **Personalização**: Configurações de tema e preferências
- **Gestão do Usuário**: Perfil e configurações pessoais

## Estrutura de Dados

### Estado Global (`state`)
```javascript
state = {
  emissoras: [],           // Rádios
  lancamentos: [],         // Transações financeiras
  agentes: [],             // Vendedores/agentes
  contasInvestimento: [],  // Contas bancárias
  infraestrutura: [],      // Projetos de infra
  _cacheToken: 0,          // Cache invalidation
  filtroAno: '',           // Filtros globais
  filtroRadio: '',         // Emissora ativa
  periodo: '',            // Período de análise
  config: {}              // Configurações pessoais
}
```

## Funcionalidades Destaque

### **Financeiro**
- ✅ Lançamentos automáticos com status calculado
- ✅ Despesas fixas com vencimento inteligente
- ✅ Dashboard com KPIs em tempo real
- ✅ Fluxo de caixa detalhado
- ✅ Relatórios por emissora/período

### **Operacional**
- ✅ Gestão completa de agentes e comissões
- ✅ Controle de vendas e terceirizados
- ✅ Cadastro de empresas com status
- ✅ Sistema de busca global

### **Técnico**
- ✅ Gestão de infraestrutura e projetos
- ✅ Controle de equipamentos
- ✅ Monitoramento de evolução

### **Sistema**
- ✅ Backup automático com indicador
- ✅ Importação/exportação Excel
- ✅ Sistema de segurança com criptografia
- ✅ Personalização de tema
- ✅ Logs de auditoria

## Tecnologias Utilizadas

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **UI Framework**: Custom com design tokens
- **Ícones**: Phosphor Icons
- **Gráficos**: Chart.js
- **Excel**: SheetJS (xlsx)
- **Fontes**: Geist (UI) + Geist Mono (código)
- **Persistência**: LocalStorage
- **Estilo**: Design system moderno com tema claro/escuro

## Funções Principais

### Render Functions
- `renderDashboard()` - Dashboard principal
- `renderEntradas()` - Gestão de entradas
- `renderDespesas()` - Gestão de despesas
- `renderFluxo()` - Fluxo de caixa
- `renderClientes()` - Gestão de empresas
- `renderVendas()` - Gestão de vendas
- `renderEmissoras()` - Gestão de emissoras
- `renderAgentes()` - Gestão de agentes
- `renderContasInvestimento()` - Contas bancárias
- `renderInfraestrutura()` - Projetos de infra

### Funções de Estado
- `initData()` - Inicializa dados
- `saveToStorage()` - Persistência
- `loadFromStorage()` - Carregamento
- `genId()` - Geração de IDs

### Funções de UI
- `showPage()` - Navegação
- `openModal()` - Modais
- `showToast()` - Notificações
- `applyGlobalFilters()` - Filtros

## Padrões de Código

### Nomenclatura
- Funções: `camelCase` (ex: `renderDashboard`)
- Variáveis: `camelCase` (ex: `state`, `editingLanc`)
- IDs DOM: `kebab-case` (ex: `modal-add-lancamento`)
- Classes CSS: `kebab-case` (ex: `nav-item`)

### Estrutura de Funções
```javascript
function renderNomePagina() {
  // 1. Obter filtros
  const filters = { /* ... */ };
  
  // 2. Obter dados
  const data = getDados(filters);
  
  // 3. Processar dados
  const processed = data.map(/* ... */);
  
  // 4. Atualizar DOM
  document.getElementById('element').innerHTML = processed;
  
  // 5. Atualizar contadores/badges
  document.getElementById('count').textContent = data.length;
}
```

### Padrões de Estado
- Sempre usar `state` para dados globais
- Incrementar `state._cacheToken` para invalidar cache
- Usar `markDirty()` para marcar páginas para re-render
- Persistir com `saveToStorageDebounced()`

## Localização de Componentes

### Modais (HTML)
- `modalAddLancamento` - Adicionar lançamento
- `modalAddRadio` - Adicionar emissora
- `modalAddAgente` - Adicionar agente
- `modalImport` - Importação de dados
- `modalBackup` - Backup/restore

### Filtros (HTML)
- `fEnt*` - Filtros de entradas
- `fDes*` - Filtros de despesas
- `fCli*` - Filtros de clientes
- `fVen*` - Filtros de vendas

### Containers (HTML)
- `kpiGrid` - KPIs do dashboard
- `chartMain` - Gráfico principal
- `recentTbody` - Transações recentes
- `emissorasGrid` - Grid de emissoras

## Pontos de Atenção

### Performance
- Usar `state._cacheToken` para cache invalidation
- Renderizar apenas página ativa com `_renderActivePage()`
- Debounced saves com `saveToStorageDebounced()`

### Segurança
- Dados criptografados no localStorage
- Sistema de logs de auditoria
- Validação de inputs em formulários

### Manutenibilidade
- Código modularizado por função
- Comentários descritivos
- Padrões consistentes de nomenclatura

## Implementação de Features

### Passos para Nova Feature
1. **Definir estrutura de dados** em `state`
2. **Criar função render** correspondente
3. **Adicionar navegação** no menu
4. **Implementar CRUD** (Create/Read/Update/Delete)
5. **Adicionar filtros** se necessário
6. **Testar integração** com estado global
7. **Documentar** mudanças

### Exemplo: Nova Página "Relatórios"
```javascript
// 1. Render function
function renderRelatorios() {
  const data = getLancamentos({ /* filtros */ });
  const processed = processarRelatorios(data);
  document.getElementById('relatoriosContainer').innerHTML = processed;
}

// 2. Adicionar ao menu
<div class="nav-sub-item" onclick="showPage('relatorios',this)">
  <i class="ph ph-files nav-sub-icon"></i>Relatórios
</div>

// 3. Container HTML
<div id="page-relatorios" class="page">
  <div id="relatoriosContainer"></div>
</div>
```

## Status Atual

O sistema está **funcional e completo** com todas as principais funcionalidades implementadas. A arquitetura é bem estruturada com separação clara de responsabilidades e um sistema de estado centralizado eficiente.

---
*Gerado automaticamente para suporte ao desenvolvimento*
