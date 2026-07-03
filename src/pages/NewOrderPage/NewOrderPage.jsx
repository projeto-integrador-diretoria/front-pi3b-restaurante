import { useEffect, useState } from 'react';
import { usePageHeader } from '../../context/PageHeaderContext';
import './NewOrderPage.css';

/**
 * Demonstração de fluxo multi-step com controle do PageHeader.
 * - Passo 1: sem botão de voltar
 * - Passos seguintes: showBack: true com onBack customizado (retorna ao passo anterior)
 */
const STEPS = [
  { subtitle: 'Selecione ou escaneie a mesa' },
  { subtitle: 'Escolha os itens do pedido' },
  { subtitle: 'Confirme e envie o pedido' },
];

function NewOrderPage() {
  const { setHeader } = usePageHeader();
  const [step, setStep] = useState(0);

  useEffect(() => {
    setHeader({
      title: 'Novo Pedido',
      subtitle: STEPS[step].subtitle,
      showBack: step > 0,
      onBack: step > 0 ? () => setStep((s) => s - 1) : null,
    });
  }, [step, setHeader]);

  return (
    <div className="page-placeholder">
      <p className="page-placeholder__desc">Passo {step + 1} de {STEPS.length}</p>

      {/* Botões de navegação entre passos — apenas para demonstração */}
      <div className="">
        {step < STEPS.length - 1 && (
          <button
            onClick={() => setStep((s) => s + 1)}
          >
            Próximo passo →
          </button>
        )}
      </div>
    </div>
  );
}

export default NewOrderPage;
