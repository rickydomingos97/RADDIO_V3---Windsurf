// Sistema de Diagnóstico Completo
// Execute no console do navegador para diagnosticar problemas

function diagnosticarSistema() {
    console.log('🔍 DIAGNÓSTICO COMPLETO DO SISTEMA');
    console.log('=====================================');
    
    // 1. Verificar estado geral
    console.log('\n📊 ESTADO GERAL:');
    console.log('state:', state);
    console.log('state.lancamentos:', state.lancamentos?.length || 0, 'itens');
    console.log('state.despesasFixas:', state.despesasFixas?.length || 0, 'itens');
    console.log('state.emissoras:', state.emissoras?.length || 0, 'itens');
    
    // 2. Verificar funções principais
    console.log('\n🔧 FUNÇÕES PRINCIPAIS:');
    console.log('renderDespesas:', typeof renderDespesas);
    console.log('carregarDespesasFixas:', typeof carregarDespesasFixas);
    console.log('salvarDespesaFixaModal:', typeof salvarDespesaFixaModal);
    console.log('excluirDespesaFixa:', typeof excluirDespesaFixa);
    console.log('deleteLanc:', typeof deleteLanc);
    console.log('editLanc:', typeof editLanc);
    
    // 3. Verificar elementos DOM
    console.log('\n🎯 ELEMENTOS DOM:');
    console.log('#listaDespesasFixas:', !!document.getElementById('listaDespesasFixas'));
    console.log('#despesasTableBody:', !!document.getElementById('despesasTableBody'));
    console.log('#modalDespesaFixaEdicao:', !!document.getElementById('modalDespesaFixaEdicao'));
    console.log('#modalAddLancamento:', !!document.getElementById('modalAddLancamento'));
    
    // 4. Verificar dados das despesas
    console.log('\n💰 DADOS DAS DESPESAS:');
    if (state.despesasFixas && state.despesasFixas.length > 0) {
        console.log('Primeira despesa fixa:', state.despesasFixas[0]);
    } else {
        console.log('❌ Nenhuma despesa fixa encontrada');
    }
    
    if (state.lancamentos && state.lancamentos.length > 0) {
        const despesas = state.lancamentos.filter(l => l.tipo === 'despesa');
        console.log('Despesas em lancamentos:', despesas.length, 'itens');
        if (despesas.length > 0) {
            console.log('Primeira despesa:', despesas[0]);
        }
    } else {
        console.log('❌ Nenhum lançamento encontrado');
    }
    
    // 5. Testar funções
    console.log('\n🧪 TESTES DE FUNÇÕES:');
    
    try {
        // Testar getLancamentos
        const todosLancamentos = getLancamentos();
        console.log('✅ getLancamentos():', todosLancamentos.length, 'itens');
        
        const despesasFiltradas = getLancamentos({tipo: 'despesa'});
        console.log('✅ getLancamentos({tipo: "despesa"}):', despesasFiltradas.length, 'itens');
        
        // Testar gerarInstanciasDespesasFixas
        const instancias = gerarInstanciasDespesasFixas();
        console.log('✅ gerarInstanciasDespesasFixas():', instancias.length, 'itens');
        
    } catch (error) {
        console.error('❌ Erro ao testar funções:', error);
    }
    
    // 6. Verificar localStorage
    console.log('\n💾 LOCALSTORAGE:');
    try {
        const savedState = localStorage.getItem('radddio_state');
        if (savedState) {
            const parsed = JSON.parse(savedState);
            console.log('✅ Dados salvos no localStorage:', {
                lancamentos: parsed.lancamentos?.length || 0,
                despesasFixas: parsed.despesasFixas?.length || 0,
                emissoras: parsed.emissoras?.length || 0
            });
        } else {
            console.log('❌ Nenhum dado encontrado no localStorage');
        }
    } catch (error) {
        console.error('❌ Erro ao ler localStorage:', error);
    }
    
    console.log('\n🏁 FIM DO DIAGNÓSTICO');
    console.log('=====================================');
}

// Função para testar cadastro de despesa fixa
function testarCadastroDespesaFixa() {
    console.log('\n🧪 TESTANDO CADASTRO DE DESPESA FIXA');
    
    // Dados de teste
    const dadosTeste = {
        emissora: state.emissoras?.[0]?.id || 'test-id',
        descricao: 'Despesa de Teste',
        vencimento: '15',
        valor: '100.50',
        tipo: 'aluguel',
        observacoes: 'Observação de teste'
    };
    
    console.log('Dados de teste:', dadosTeste);
    
    // Simular preenchimento do formulário
    try {
        document.getElementById('modalDespesaEmissora').value = dadosTeste.emissora;
        document.getElementById('modalDespesaDescricao').value = dadosTeste.descricao;
        document.getElementById('modalDespesaVencimento').value = dadosTeste.vencimento;
        document.getElementById('modalDespesaValor').value = dadosTeste.valor;
        document.getElementById('modalDespesaTipo').value = dadosTeste.tipo;
        document.getElementById('modalDespesaObservacoes').value = dadosTeste.observacoes;
        
        console.log('✅ Formulário preenchido com sucesso');
        
        // Tentar salvar
        if (typeof salvarDespesaFixaModal === 'function') {
            salvarDespesaFixaModal();
            console.log('✅ Função salvarDespesaFixaModal executada');
        } else {
            console.error('❌ Função salvarDespesaFixaModal não encontrada');
        }
        
    } catch (error) {
        console.error('❌ Erro no teste de cadastro:', error);
    }
}

// Função para limpar dados de teste
function limparDadosTeste() {
    console.log('\n🧹 LIMPANDO DADOS DE TESTE');
    
    if (state.despesasFixas) {
        const antes = state.despesasFixas.length;
        state.despesasFixas = state.despesasFixas.filter(d => !d.descricao.includes('Teste'));
        state.lancamentos = state.lancamentos.filter(l => !l.desc.includes('Teste'));
        
        console.log(`✅ Removidos ${antes - state.despesasFixas.length} itens de teste`);
        saveToStorage();
    }
}

// Exportar funções para uso global
window.diagnosticarSistema = diagnosticarSistema;
window.testarCadastroDespesaFixa = testarCadastroDespesaFixa;
window.limparDadosTeste = limparDadosTeste;

console.log('🔧 Sistema de diagnóstico carregado!');
console.log('Use: diagnosticarSistema() para analisar o sistema');
console.log('Use: testarCadastroDespesaFixa() para testar cadastro');
console.log('Use: limparDadosTeste() para limpar dados de teste');
