/**
 * Dados semente do mock: cardápio e mesas.
 *
 * O formato espelha exatamente o que a API real devolve, para que a troca
 * mock → API real (VITE_USE_MOCK=false) não exija mudar nada nas telas.
 *
 * - Cardápio: mesmo shape do GET /cardapio → [{ categoriaId, categoriaNome, itens: [{ id, nome, descricao, preco }] }]
 * - Mesas:    shape esperado de um futuro GET /mesas → [{ id, numero, status }]
 */

// IDs fixos (UUID) para que os itens sejam estáveis entre recarregamentos.
export const CARDAPIO_MOCK = [
    {
        categoriaId: '11111111-0000-0000-0000-000000000001',
        categoriaNome: 'Entradas',
        itens: [
            { id: 'a0000000-0000-0000-0000-000000000001', nome: 'Bruschetta de Tomate', descricao: 'Pão italiano, tomate, manjericão e azeite', preco: 24.9 },
            { id: 'a0000000-0000-0000-0000-000000000002', nome: 'Bolinho de Bacalhau (6un)', descricao: 'Acompanha molho tártaro', preco: 32.0 },
            { id: 'a0000000-0000-0000-0000-000000000003', nome: 'Batata Rústica', descricao: 'Com alecrim e parmesão', preco: 28.5 },
        ],
    },
    {
        categoriaId: '11111111-0000-0000-0000-000000000002',
        categoriaNome: 'Pratos Principais',
        itens: [
            { id: 'b0000000-0000-0000-0000-000000000001', nome: 'Filé à Parmegiana', descricao: 'Arroz, fritas e salada', preco: 58.9 },
            { id: 'b0000000-0000-0000-0000-000000000002', nome: 'Risoto de Camarão', descricao: 'Arroz arbóreo, camarões e limão siciliano', preco: 64.0 },
            { id: 'b0000000-0000-0000-0000-000000000003', nome: 'Burguer Artesanal', descricao: '180g, cheddar, bacon e barbecue', preco: 39.9 },
            { id: 'b0000000-0000-0000-0000-000000000004', nome: 'Salmão Grelhado', descricao: 'Legumes salteados e purê rústico', preco: 69.9 },
        ],
    },
    {
        categoriaId: '11111111-0000-0000-0000-000000000003',
        categoriaNome: 'Bebidas',
        itens: [
            { id: 'c0000000-0000-0000-0000-000000000001', nome: 'Suco Natural (400ml)', descricao: 'Laranja, abacaxi ou maracujá', preco: 12.0 },
            { id: 'c0000000-0000-0000-0000-000000000002', nome: 'Refrigerante Lata', descricao: '350ml', preco: 7.5 },
            { id: 'c0000000-0000-0000-0000-000000000003', nome: 'Água com/sem gás', descricao: '500ml', preco: 5.0 },
        ],
    },
    {
        categoriaId: '11111111-0000-0000-0000-000000000004',
        categoriaNome: 'Sobremesas',
        itens: [
            { id: 'd0000000-0000-0000-0000-000000000001', nome: 'Petit Gâteau', descricao: 'Com sorvete de creme', preco: 26.0 },
            { id: 'd0000000-0000-0000-0000-000000000002', nome: 'Cheesecake de Frutas Vermelhas', descricao: 'Fatia individual', preco: 22.5 },
        ],
    },
];

/** 12 mesas disponíveis, numeradas de 1 a 12. */
export const MESAS_MOCK = Array.from({ length: 12 }, (_, i) => ({
    id: `e0000000-0000-0000-0000-0000000000${String(i + 1).padStart(2, '0')}`,
    numero: i + 1,
    status: 'DISPONIVEL',
}));

/** Índice plano de itemCardapioId → item, para o mock resolver preços/nomes. */
export const ITENS_POR_ID = CARDAPIO_MOCK.reduce((acc, categoria) => {
    for (const item of categoria.itens) acc[item.id] = item;
    return acc;
}, {});

/** Índice de mesaId → mesa. */
export const MESAS_POR_ID = MESAS_MOCK.reduce((acc, mesa) => {
    acc[mesa.id] = mesa;
    return acc;
}, {});
