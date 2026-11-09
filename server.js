// server.js - Servidor Express Completo (Programação Back-End I - Aula 11)
require('dotenv').config();
const express = require('express');
const supabase = require('./src/config/supabaseClient');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3016;
// Aluno 16: Hamburgueria
// 1. Rota GET Global: Listar todos os produtos
app.get('/burgers', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('hamburgueres_menu')
      .select('*')
      .order('vendas', { ascending: false });
    res.json(data);
    
    if (error) {
      return res.status(500).json({ erro: 'Erro no banco de dados', detalhe: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ erro: 'Falha interna no servidor' });
  }
});


// 2. Rota GET por ID com tratamento 404
app.get('/burgers/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('hamburgueres_menu')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ erro: 'Produto não foi encontrado' });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ erro: 'Falha na busca do recurso' });
  }
});

// 3. Rota GET com Ordenação Decrescente por Preço
app.get('/burgers-ordenados', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('hamburgueres_menu')
      .select('*')
      .order('vendas', { ascending: false });

    if (error) throw error;

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao ordenar catálogo' });
  }
});

// Inicialização da escuta do servidor HTTP
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando com sucesso na porta ${PORT}`);
  console.log(`📡 Endpoints disponíveis: http://localhost:${PORT}/burgers`);
});