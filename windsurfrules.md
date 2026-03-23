# Windsurf Rules - RADDIO_V3 Project

## Ambiente de Desenvolvimento
- **Sistema Operacional:** Windows 11
- **Navegador:** Navegador web moderno (Chrome, Firefox, Edge)
- **Ferramentas:** Visual Studio Code com Windsurf AI

## Regras Importantes para Windows
- **NÃO usar comandos Unix/Linux:** Evite comandos como `ls`, `rm`, `mkdir`, `cd` no terminal
- **USAR comandos Windows:** Use `dir`, `del`, `mkdir`, `cd` (PowerShell/CMD)
- **Caminhos:** Use barras invertidas `\` ou barras normais `/` (aceitáveis na maioria dos casos)
- **Execução:** Prefira scripts `.bat` ou comandos PowerShell para automação

## ANTES DE IMPLEMENTAR QUALQUER COISA RODE TDD

## Plano de Ação - Refinamento de Importação de Dados

### AÇÃO 1 ✅ (CONCLUÍDA)
**Objetivo:** Corrigir exibição de dados do arquivo `test_data_corrigido.json` nas páginas

#### Tarefas Concluídas:
- [x] Corrigir categoria "Clientes Vigentes" → "Empresas Vigentes"
- [x] Atualizar arquivo JSON com terminologia correta
- [x] Corrigir filtros nas páginas Vendas e Terceirizados
- [x] Corrigir renderização de Contas Investimento
- [x] Corrigir cálculos de Infraestrutura
- [x] Atualizar textos de UI: "Clientes" → "Empresas"
- [x] Corrigir erro de variável duplicada `cliMap` → `empresaMap`
- [x] Corrigir erro de null em `renderClientes` com optional chaining

#### Status: ✅ CONCLUÍDO

---

### AÇÃO 2 🔄 (EM ANDAMENTO)
**Objetivo:** Implementar feedback para importação duplicada e reset de dados

#### Tarefas:
- [x] Detectar quando mesmo arquivo JSON é adicionado duas vezes
- [x] Mostrar mensagem de confirmação para adição duplicada
- [x] Adicionar mensagem de status ao RESETAR DADOS
- [x] Corrigir erro de null em `renderClientes`
- [x] Adicionar botão de fechar (X) no modal de importação JSON
- [x] Corrigir funcionamento dos botões X e Cancelar
- [ ] Corrigir mensagem de sucesso que não aparece no reset
- [ ] Implementar detecção de arquivo duplicado
- [ ] Implementar modal de confirmação para adição duplicada

#### Problemas Atuais:
- [ ] Toast de sucesso não aparece após reset de dados
- [ ] Botão X e Cancelar não funcionavam (corrigido, precisa testar)

#### Status: 🔄 EM ANDAMENTO

---

### AÇÃO 3 ⏳ (PENDENTE)
**Objetivo:** Melhorar modal de restauração com confirmação

#### Tarefas:
- [ ] Substituir toast por modal de confirmação após restauração
- [ ] Adicionar botão "OK" no modal de confirmação
- [ ] Adicionar botão "Close" no modal `modalConfirmRestore`
- [ ] Mostrar quantidade de dados inseridos com sucesso

#### Status: ⏳ PENDENTE

---

## Arquivos Principais

### `index.html`
- **Função principal:** Aplicação completa
- **Funções críticas:**
  - `renderClientes()` - Renderização de clientes/empresas
  - `renderVendas()` - Página de vendas
  - `renderTerceirizados()` - Página de terceirizados
  - `renderContasInvestimento()` - Contas de investimento
  - `renderInfraestrutura()` - Infraestrutura
  - `confirmarResetDados()` - Reset de dados
  - `showToast()` - Exibição de notificações
  - `closeModalRestore()` - Fechar modal de restauração

### `test_data_corrigido.json`
- **Função:** Dados de teste para importação
- **Estrutura:** Arrays de emissoras, agentes, contas, lançamentos, infraestrutura
- **Categoria correta:** "Empresas Vigentes"

## Comandos Windows Úteis

### Navegação
```powershell
# Listar arquivos
dir

# Mudar diretório
cd d:\DEVELOP\RADDIO_V3 - Windsurf

# Criar diretório
mkdir novo_diretorio
```

### Debug no Navegador
- **F12:** Abrir DevTools
- **Console:** Ver `console.log()` e erros
- **Network:** Monitorar requisições
- **LocalStorage:** Application > Local Storage

## Padrões de Código

### Optional Chaining (Windows Compatible)
```javascript
// Em vez de:
const valor = document.getElementById('elemento').value;

// Usar:
const valor = document.getElementById('elemento')?.value || null;
```

### Tratamento de Erros
```javascript
try {
  // Código que pode falhar
} catch (error) {
  console.error('Erro:', error);
  showToast('Ocorreu um erro', 'err');
}
```

## Próximos Passos

1. **Testar Ação 2:**
   - Verificar se botão X e Cancelar funcionam
   - Verificar se toast de sucesso aparece
   - Implementar detecção de arquivo duplicado

2. **Executar Ação 3:**
   - Criar modal de confirmação para restauração
   - Adicionar botões OK e Close
   - Mostrar estatísticas de importação

3. **Teste Final:**
   - Testar fluxo completo de importação
   - Testar reset de dados
   - Testar duplicação de arquivos

## Checklist de Testes

### Teste de Reset de Dados
- [ ] Sem dados: Mostrar "Não há dados salvos"
- [ ] Com dados: Mostrar "Dados deletados com sucesso"
- [ ] Após reset: Redirecionar para dashboard

### Teste de Importação JSON
- [ ] Botão X funciona para fechar modal
- [ ] Botão Cancelar funciona
- [ ] Arquivo duplicado detectado
- [ ] Confirmação para adição duplicada

### Teste de Páginas
- [ ] Página Infraestrutura exibe dados
- [ ] Página Vendas exibe dados
- [ ] Página Terceirizados exibe dados
- [ ] Página Contas Investimento exibe dados
- [ ] Página Agentes exibe dados

---

**Última atualização:** 22/03/2026
**Status:** Ação 2 em andamento - corrigindo funcionamento dos botões
