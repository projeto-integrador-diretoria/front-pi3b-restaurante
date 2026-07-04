import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Loader2, AlertCircle, Check } from 'lucide-react';
import { usePageHeader } from '../../context/PageHeaderContext';
import Button from '../../components/Button/Button';
import { getCardapio } from '../../services/cardapioService';
import { listarMesas } from '../../services/mesaService';
import { criarPedido } from '../../services/pedidoService';
import { formatarMoeda } from '../../utils/format';
import './NewOrderPage.css';

const SUBTITULOS = [
    'Informe a mesa do pedido',
    'Escolha os itens do cardápio',
    'Confira e envie o pedido',
];

function NewOrderPage() {
    const { setHeader } = usePageHeader();
    const navigate = useNavigate();

    const [step, setStep] = useState(0);

    // Passo 1 — mesa
    const [mesas, setMesas] = useState([]);
    const [numeroMesa, setNumeroMesa] = useState('');
    const [mesaErro, setMesaErro] = useState('');

    // Passo 2 — cardápio + carrinho
    const [cardapio, setCardapio] = useState([]);
    const [carregandoCardapio, setCarregandoCardapio] = useState(true);
    const [erroCardapio, setErroCardapio] = useState('');
    // carrinho: { [itemId]: { item, quantidade, personalizacoes } }
    const [carrinho, setCarrinho] = useState({});

    // Passo 3 — envio
    const [enviando, setEnviando] = useState(false);
    const [erroEnvio, setErroEnvio] = useState('');

    // Header controlado por passo (usa o botão de voltar do PageHeader)
    useEffect(() => {
        setHeader({
            title: 'Novo Pedido',
            subtitle: SUBTITULOS[step],
            showBack: step > 0,
            onBack: step > 0 ? () => setStep((s) => s - 1) : null,
        });
    }, [step, setHeader]);

    // Carrega mesas e cardápio uma vez ao abrir a tela
    useEffect(() => {
        listarMesas().then(setMesas).catch((e) => console.error(e));

        (async () => {
            setCarregandoCardapio(true);
            setErroCardapio('');
            try {
                setCardapio(await getCardapio());
            } catch (e) {
                console.error(e);
                setErroCardapio('Não foi possível carregar o cardápio.');
            } finally {
                setCarregandoCardapio(false);
            }
        })();
    }, []);

    const mesaSelecionada = useMemo(
        () => mesas.find((m) => m.numero === Number(numeroMesa)) || null,
        [mesas, numeroMesa]
    );

    const itensCarrinho = useMemo(() => Object.values(carrinho), [carrinho]);

    const total = useMemo(
        () => itensCarrinho.reduce((soma, c) => soma + c.item.preco * c.quantidade, 0),
        [itensCarrinho]
    );

    const totalItens = useMemo(
        () => itensCarrinho.reduce((soma, c) => soma + c.quantidade, 0),
        [itensCarrinho]
    );

    // ---- Operações do carrinho ----
    const setQuantidade = useCallback((item, quantidade) => {
        setCarrinho((atual) => {
            const proximo = { ...atual };
            if (quantidade <= 0) {
                delete proximo[item.id];
            } else {
                proximo[item.id] = {
                    item,
                    quantidade,
                    personalizacoes: proximo[item.id]?.personalizacoes || '',
                };
            }
            return proximo;
        });
    }, []);

    const setPersonalizacao = useCallback((item, texto) => {
        setCarrinho((atual) => {
            if (!atual[item.id]) return atual;
            return { ...atual, [item.id]: { ...atual[item.id], personalizacoes: texto } };
        });
    }, []);

    // ---- Navegação entre passos ----
    function avancarDaMesa() {
        setMesaErro('');
        if (!numeroMesa.trim()) {
            setMesaErro('Digite o número da mesa.');
            return;
        }
        if (!mesaSelecionada) {
            setMesaErro(`Mesa ${numeroMesa} não encontrada.`);
            return;
        }
        setStep(1);
    }

    async function enviarPedido() {
        setErroEnvio('');
        setEnviando(true);
        try {
            const payload = {
                mesaId: mesaSelecionada.id,
                itens: itensCarrinho.map((c) => ({
                    itemCardapioId: c.item.id,
                    quantidade: c.quantidade,
                    personalizacoes: c.personalizacoes?.trim() || null,
                })),
            };
            const novo = await criarPedido(payload);
            // Substitui a entrada no histórico: "voltar" no detalhe vai para a Home
            navigate(`/pedidos/${novo.id}`, { replace: true });
        } catch (err) {
            console.error(err);
            setErroEnvio('Não foi possível enviar o pedido. Tente novamente.');
            setEnviando(false);
        }
    }

    return (
        <div className="novo-pedido">
            {step === 0 && (
                <PassoMesa
                    numeroMesa={numeroMesa}
                    setNumeroMesa={(v) => { setNumeroMesa(v); setMesaErro(''); }}
                    mesas={mesas}
                    erro={mesaErro}
                />
            )}

            {step === 1 && (
                <PassoCardapio
                    carregando={carregandoCardapio}
                    erro={erroCardapio}
                    cardapio={cardapio}
                    carrinho={carrinho}
                    setQuantidade={setQuantidade}
                    setPersonalizacao={setPersonalizacao}
                />
            )}

            {step === 2 && (
                <PassoConfirmacao
                    numeroMesa={mesaSelecionada?.numero}
                    itens={itensCarrinho}
                    total={total}
                    erro={erroEnvio}
                />
            )}

            {/* Barra de ação fixa acima da navbar */}
            <div className="np-actionbar">
                {step === 1 && (
                    <div className="np-actionbar__resumo">
                        <span>{totalItens} {totalItens === 1 ? 'item' : 'itens'}</span>
                        <strong>{formatarMoeda(total)}</strong>
                    </div>
                )}

                {step === 0 && (
                    <Button fullWidth onClick={avancarDaMesa}>Continuar</Button>
                )}

                {step === 1 && (
                    <Button fullWidth onClick={() => setStep(2)} disabled={itensCarrinho.length === 0}>
                        Revisar pedido
                    </Button>
                )}

                {step === 2 && (
                    <Button fullWidth onClick={enviarPedido} loading={enviando}>
                        Enviar pedido
                    </Button>
                )}
            </div>
        </div>
    );
}

// ================================================================
// Passo 1 — Mesa
// ================================================================
function PassoMesa({ numeroMesa, setNumeroMesa, mesas, erro }) {
    const disponiveis = mesas.filter((m) => m.status === 'DISPONIVEL');

    return (
        <div className="np-mesa">
            <label className="np-mesa__label" htmlFor="numero-mesa">Número da mesa</label>
            <input
                id="numero-mesa"
                className={`np-mesa__input${erro ? ' np-mesa__input--erro' : ''}`}
                type="number"
                inputMode="numeric"
                min="1"
                placeholder="Ex: 5"
                value={numeroMesa}
                onChange={(e) => setNumeroMesa(e.target.value)}
                autoFocus
            />
            {erro && <p className="np-mesa__erro">{erro}</p>}

            {disponiveis.length > 0 && (
                <>
                    <p className="np-mesa__hint">Mesas disponíveis</p>
                    <div className="np-mesa__chips">
                        {disponiveis.map((m) => (
                            <button
                                key={m.id}
                                className={`np-mesa__chip${Number(numeroMesa) === m.numero ? ' np-mesa__chip--ativo' : ''}`}
                                onClick={() => setNumeroMesa(String(m.numero))}
                                type="button"
                            >
                                {m.numero}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

// ================================================================
// Passo 2 — Cardápio + carrinho
// ================================================================
function PassoCardapio({ carregando, erro, cardapio, carrinho, setQuantidade, setPersonalizacao }) {
    if (carregando) {
        return (
            <div className="np-estado">
                <Loader2 size={28} className="np-spin" />
                <p>Carregando cardápio…</p>
            </div>
        );
    }

    if (erro) {
        return (
            <div className="np-estado">
                <AlertCircle size={40} color="#dc2626" />
                <p>{erro}</p>
            </div>
        );
    }

    return (
        <div className="np-cardapio">
            {cardapio.map((categoria) => (
                <section key={categoria.categoriaId} className="np-categoria">
                    <h2 className="np-categoria__nome">{categoria.categoriaNome}</h2>
                    {categoria.itens.map((item) => (
                        <ItemCardapio
                            key={item.id}
                            item={item}
                            linha={carrinho[item.id]}
                            setQuantidade={setQuantidade}
                            setPersonalizacao={setPersonalizacao}
                        />
                    ))}
                </section>
            ))}
        </div>
    );
}

function ItemCardapio({ item, linha, setQuantidade, setPersonalizacao }) {
    const quantidade = linha?.quantidade || 0;

    return (
        <div className="np-item">
            <div className="np-item__topo">
                <div className="np-item__info">
                    <p className="np-item__nome">{item.nome}</p>
                    {item.descricao && <p className="np-item__desc">{item.descricao}</p>}
                    <p className="np-item__preco">{formatarMoeda(item.preco)}</p>
                </div>

                {quantidade === 0 ? (
                    <button className="np-item__add" onClick={() => setQuantidade(item, 1)} type="button">
                        <Plus size={18} strokeWidth={2.5} />
                    </button>
                ) : (
                    <div className="np-stepper">
                        <button className="np-stepper__btn" onClick={() => setQuantidade(item, quantidade - 1)} type="button" aria-label="Diminuir">
                            <Minus size={16} strokeWidth={2.5} />
                        </button>
                        <span className="np-stepper__qtd">{quantidade}</span>
                        <button className="np-stepper__btn" onClick={() => setQuantidade(item, quantidade + 1)} type="button" aria-label="Aumentar">
                            <Plus size={16} strokeWidth={2.5} />
                        </button>
                    </div>
                )}
            </div>

            {quantidade > 0 && (
                <input
                    className="np-item__pers"
                    type="text"
                    placeholder="Observação (ex: sem cebola)"
                    value={linha?.personalizacoes || ''}
                    onChange={(e) => setPersonalizacao(item, e.target.value)}
                />
            )}
        </div>
    );
}

// ================================================================
// Passo 3 — Confirmação
// ================================================================
function PassoConfirmacao({ numeroMesa, itens, total, erro }) {
    return (
        <div className="np-resumo">
            <div className="np-resumo__mesa">
                <Check size={18} strokeWidth={2.5} />
                Mesa {numeroMesa}
            </div>

            <div className="np-resumo__itens">
                {itens.map((c) => (
                    <div key={c.item.id} className="np-resumo__linha">
                        <span className="np-resumo__qtd">{c.quantidade}×</span>
                        <div className="np-resumo__desc">
                            <span className="np-resumo__nome">{c.item.nome}</span>
                            {c.personalizacoes?.trim() && (
                                <span className="np-resumo__obs">{c.personalizacoes}</span>
                            )}
                        </div>
                        <span className="np-resumo__valor">{formatarMoeda(c.item.preco * c.quantidade)}</span>
                    </div>
                ))}
            </div>

            <div className="np-resumo__total">
                <span>Total</span>
                <strong>{formatarMoeda(total)}</strong>
            </div>

            {erro && (
                <p className="np-resumo__erro">
                    <AlertCircle size={16} /> {erro}
                </p>
            )}
        </div>
    );
}

export default NewOrderPage;
