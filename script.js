// ── XSS escape helper — always use for user-supplied data in innerHTML ──
function esc(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ── Secondary nav group toggle ───────────────────────────────────────────
function toggleNavGroup(id) {
  const grp = document.getElementById(id);
  if (grp) {
    grp.classList.toggle('open');
    // Update aria-expanded for accessibility
    const trigger = grp.querySelector('.nav-group-trigger');
    if (trigger) {
      const isExpanded = grp.classList.contains('open');
      trigger.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    }
  }
}
function openNavGroup(id) {
  const grp = document.getElementById(id);
  if (grp) grp.classList.add('open');
}

function debounce(fn, ms) { let t; return function(...a){ clearTimeout(t); t=setTimeout(()=>fn.apply(this,a),ms); }; }
function groupBy(arr, keyFn) { return arr.reduce((acc,x)=>{ const k=keyFn(x); (acc[k]=acc[k]||[]).push(x); return acc; },{}); }
function sumByTipo(arr, tipo) { return (arr||[]).filter(l=>l.tipo===tipo).reduce((s,l)=>s+(l.valor||0),0); }
const _dirty = new Set(['dashboard','entradas','despesas','empresas','fluxo','emissoras','agentes','terceirizados']);
const markDirty = (...pp) => pp.forEach(p=>_dirty.add(p));
const markClean = p => _dirty.delete(p);
const isDirty   = p => _dirty.has(p);
function getActivePage(){ const a=document.querySelector('.page.active'); return a ? a.id.replace('page-','') : 'dashboard'; }
function _renderActivePage(){
  const p=getActivePage(); if (!isDirty(p)) return;
  ({dashboard:renderDashboard,entradas:renderEntradas,despesas:renderDespesas,empresas:renderClientes,fluxo:renderFluxo,emissoras:renderEmissoras}[p]||function(){})();
  markClean(p);
}

// ══════════════════════════════════════════════
//  ESTADO GLOBAL
// ══════════════════════════════════════════════
const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

// ── Constantes de domínio — evita strings mágicas espalhadas pelo código ──
const STATUS = Object.freeze({ EM_DIA:'Em dia', Inadimplente:'Inadimplente', PERMUTA:'Permuta', PAGO:'Pago', PENDENTE:'Pendente', ATRASADO:'Atrasado' });
const TIPO   = Object.freeze({ ENTRADA:'entrada', despesa:'despesa' });
const CAT    = Object.freeze({ VIGENTES:'Empresas Vigentes', TERCEIRIZADOS:'Terceirizados', PERMUTAS:'Permutas' });

// ── Business Logic Layer ───────────────────────────────────────────────────
const BusinessLogicLayer = {
  validateLancamento: function(data) {
    const errors = [];
    
    if (!data || typeof data !== 'object') {
      errors.push('Dados do lançamento inválidos');
      return errors;
    }
    
    if (!data.desc || !data.desc.trim()) {
      errors.push('Informe a descrição');
    }
    
    if (!data.valor || isNaN(data.valor) || parseFloat(data.valor) <= 0) {
      errors.push('Informe um valor válido maior que zero');
    }
    
    if (!data.radio) {
      errors.push('Selecione a emissora');
    }
    
    if (!data.tipo || !Object.values(TIPO).includes(data.tipo)) {
      errors.push('Tipo de lançamento inválido');
    }
    
    if (!data.mes || !MESES.includes(data.mes)) {
      errors.push('Mês inválido');
    }
    
    if (!data.ano || isNaN(data.ano) || parseInt(data.ano) < 2000 || parseInt(data.ano) > 2100) {
      errors.push('Ano inválido (deve estar entre 2000 e 2100)');
    }
    
    return errors;
  },
  
  calculateLiquido: function(valorBruto, taxaComissao) {
    if (!valorBruto || isNaN(valorBruto)) return 0;
    if (!taxaComissao || isNaN(taxaComissao)) return parseFloat(valorBruto);
    
    const valor = parseFloat(valorBruto);
    const taxa = parseFloat(taxaComissao);
    
    if (taxa < 0 || taxa > 100) {
      console.warn('Taxa de comissão inválida:', taxa);
      return valor;
    }
    
    return valor - (valor * taxa / 100);
  },
  
  formatCurrency: function(valor) {
    if (!valor || isNaN(valor)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(valor));
  },
  
  getStatusColor: function(status) {
    const statusColors = {
      [STATUS.EM_DIA]: 'green',
      [STATUS.Inadimplente]: 'red',
      [STATUS.PERMUTA]: 'blue',
      [STATUS.PAGO]: 'green',
      [STATUS.PENDENTE]: 'yellow',
      [STATUS.ATRASADO]: 'red'
    };
    return statusColors[status] || 'gray';
  }
};

// ── Data Access Layer ─────────────────────────────────────────────────────
const DataAccessLayer = {
  getStorageKey: function(type) {
    const emissora = localStorage.getItem('emissoraAtiva') || 'default';
    return `${type}_${emissora}`;
  },
  
  saveData: function(type, data) {
    try {
      const key = this.getStorageKey(type);
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      return false;
    }
  },
  
  getData: function(type) {
    try {
      const key = this.getStorageKey(type);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      return [];
    }
  },
  
  clearData: function(type) {
    try {
      const key = this.getStorageKey(type);
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      return false;
    }
  }
};

// ── UI Components Layer ───────────────────────────────────────────────────
const UIComponents = {
  showToast: function(message, type = 'success', duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.className = `toast show ${type}`;
    toast.innerHTML = `
      <i class="ph ph-${type === 'success' ? 'check-circle' : 'x-circle'}"></i>
      <span>${esc(message)}</span>
    `;
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  },
  
  showModal: function(title, content, onConfirm = null, confirmText = 'Confirmar') {
    const modal = document.getElementById('modal');
    if (!modal) return;
    
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = content;
    
    const confirmBtn = document.getElementById('modalConfirm');
    if (onConfirm) {
      confirmBtn.style.display = 'inline-flex';
      confirmBtn.textContent = confirmText;
      confirmBtn.onclick = onConfirm;
    } else {
      confirmBtn.style.display = 'none';
    }
    
    modal.classList.add('open');
  },
  
  hideModal: function() {
    const modal = document.getElementById('modal');
    if (modal) {
      modal.classList.remove('open');
    }
  },
  
  confirmAction: function(message, onConfirm, confirmText = 'Confirmar') {
    this.showModal(
      'Confirmar Ação',
      `<p>${esc(message)}</p>`,
      onConfirm,
      confirmText
    );
  }
};

// ── Navigation Layer ─────────────────────────────────────────────────────
const NavigationLayer = {
  init: function() {
    this.setupNavigationListeners();
    this.setupThemeToggle();
  },
  
  setupNavigationListeners: function() {
    document.querySelectorAll('.nav-item, .nav-sub-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.getAttribute('data-target') || item.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          this.navigateToPage(targetId.substring(1));
        }
      });
    });
  },
  
  navigateToPage: function(pageId) {
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-item, .nav-sub-item').forEach(item => {
      item.classList.remove('active');
    });
    
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
      targetPage.classList.add('active');
    }
    
    const navItem = document.querySelector(`[data-target="${pageId}"], [href="#${pageId}"]`);
    if (navItem) {
      navItem.classList.add('active');
    }
    
    markDirty(pageId);
    _renderActivePage();
  },
  
  setupThemeToggle: function() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
};

// ── Authentication Layer ───────────────────────────────────────────────────
const AuthLayer = {
  init: function() {
    this.setupLoginListeners();
    this.checkAuthStatus();
  },
  
  setupLoginListeners: function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin();
      });
    }
    
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => this.handleLogin());
    }
  },
  
  checkAuthStatus: function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginScreen = document.getElementById('loginScreen');
    
    if (isLoggedIn) {
      if (loginScreen) {
        loginScreen.style.display = 'none';
      }
      this.initializeApp();
    } else {
      if (loginScreen) {
        loginScreen.style.display = 'flex';
      }
    }
  },
  
  handleLogin: function() {
    const password = document.getElementById('loginPassInput')?.value;
    const savedPassword = localStorage.getItem('senha') || 'admin';
    
    if (password === savedPassword) {
      localStorage.setItem('isLoggedIn', 'true');
      document.getElementById('loginScreen').style.display = 'none';
      this.initializeApp();
      UIComponents.showToast('Login realizado com sucesso!', 'success');
    } else {
      UIComponents.showToast('Senha incorreta!', 'error');
      this.shakeLoginScreen();
    }
  },
  
  logout: function() {
    localStorage.setItem('isLoggedIn', 'false');
    location.reload();
  },
  
  shakeLoginScreen: function() {
    const loginCard = document.querySelector('.login-card');
    if (loginCard) {
      loginCard.style.animation = 'loginShake 0.5s';
      setTimeout(() => {
        loginCard.style.animation = '';
      }, 500);
    }
  },
  
  initializeApp: function() {
    NavigationLayer.init();
    DashboardLayer.init();
    this.setupLogoutListener();
  },
  
  setupLogoutListener: function() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        UIComponents.confirmAction(
          'Deseja realmente sair do sistema?',
          () => this.logout(),
          'Sair'
        );
      });
    }
  }
};

// ── Dashboard Layer ───────────────────────────────────────────────────────
const DashboardLayer = {
  init: function() {
    this.setupEventListeners();
    markDirty('dashboard');
  },
  
  setupEventListeners: function() {
    const yearSelect = document.getElementById('yearSelect');
    if (yearSelect) {
      yearSelect.addEventListener('change', () => {
        markDirty('dashboard');
        _renderActivePage();
      });
    }
  },
  
  renderDashboard: function() {
    const year = document.getElementById('yearSelect')?.value || new Date().getFullYear().toString();
    const entradas = DataAccessLayer.getData('entradas').filter(e => e.ano === year);
    const despesas = DataAccessLayer.getData('despesas').filter(d => d.ano === year);
    
    this.renderKPIs(entradas, despesas);
    this.renderCharts(entradas, despesas);
  },
  
  renderKPIs: function(entradas, despesas) {
    const totalEntradas = entradas.reduce((sum, e) => sum + parseFloat(e.valor || 0), 0);
    const totalDespesas = despesas.reduce((sum, d) => sum + parseFloat(d.valor || 0), 0);
    const saldo = totalEntradas - totalDespesas;
    
    this.updateKPI('kpi-entradas', totalEntradas);
    this.updateKPI('kpi-despesas', totalDespesas);
    this.updateKPI('kpi-saldo', saldo);
    this.updateKPI('kpi-lucro', totalEntradas > 0 ? (saldo / totalEntradas * 100) : 0, '%');
  },
  
  updateKPI: function(id, value, suffix = '') {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = BusinessLogicLayer.formatCurrency(value) + suffix;
    }
  },
  
  renderCharts: function(entradas, despesas) {
    // Implementar gráficos aqui
    console.log('Renderizando gráficos...', { entradas, despesas });
  }
};

// ── Main Application Entry Point ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  AuthLayer.init();
});

// ── Utility Functions ───────────────────────────────────────────────────────
function renderEntradas() {
  console.log('Renderizando entradas...');
  // Implementar renderização de entradas
}

function renderDespesas() {
  console.log('Renderizando despesas...');
  // Implementar renderização de despesas
}

function renderClientes() {
  console.log('Renderizando clientes...');
  // Implementar renderização de clientes
}

function renderFluxo() {
  console.log('Renderizando fluxo...');
  // Implementar renderização de fluxo
}

function renderEmissoras() {
  console.log('Renderizando emissoras...');
  // Implementar renderização de emissoras
}

function renderInfraestruturaCharts() {
  console.log('Renderizando gráficos de infraestrutura...');
  // Implementar renderização de gráficos de infraestrutura
}

// ── Export Functions ───────────────────────────────────────────────────────
function exportToExcel(data, filename) {
  try {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Dados');
    XLSX.writeFile(wb, filename);
    UIComponents.showToast('Arquivo exportado com sucesso!', 'success');
  } catch (error) {
    console.error('Erro ao exportar:', error);
    UIComponents.showToast('Erro ao exportar arquivo!', 'error');
  }
}
