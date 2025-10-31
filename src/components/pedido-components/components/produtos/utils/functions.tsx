import { useCallback, useContext, useMemo } from "react";
import { OrcamentoContext } from "../../../../../contexts/orcamentoContext";

 export const useFunctionsProducts= ()=>{
    const { orcamento, setOrcamento } = useContext(OrcamentoContext);

  const selectedProductsMap = useMemo(() => {
    const map = {};
    for (const product of orcamento.produtos) {
      map[product.codigo] = product;
    }
    return map;
  }, [orcamento.produtos]);

 
  const handleSelectionChange = useCallback((newSelectedItems:any) => {
    const totalItens = newSelectedItems.reduce((acc, item) => {
      const total = (item.quantidade * item.preco) - (item.desconto || 0);
      return acc + total;
    }, 0);
    
    // Atualiza o contexto com a nova lista de produtos
    //console.log(newSelectedItems)
    setOrcamento((prev:any) => ({
      ...prev,
      produtos: newSelectedItems,
    }));
  }, [setOrcamento]);


 const toggleSelection =  (item: any) => {
    const currentSelected = [...orcamento.produtos];
    const index = currentSelected.findIndex((i: any) => i.sequencia === item.sequencia);
      let sequencia = 1;
        if(currentSelected.length > 0 ){
            const ultimoItem = currentSelected[currentSelected.length - 1 ]
            if(ultimoItem.sequencia){
              sequencia = ultimoItem.sequencia + 1 
            } 
        }
    if (index !== -1) {
      // Remove o item
      currentSelected.splice(index, 1);
      currentSelected.push({ ...item, quantidade: item.quantidade, desconto: item.desconto, total: item.total , sequencia:sequencia});

    } else {
      // Adiciona o item
    
      currentSelected.push({ ...item, quantidade:item.quantidade, desconto: item.desconto, total: item.total , sequencia:sequencia});
    }
    //handleSelectionChange(currentSelected);
  
     setOrcamento((prev:any) => ({
      ...prev,
      produtos: currentSelected,
    }));
  } ;
  

 const removeItem = (item:any )=>{
    const currentSelected = [...orcamento.produtos];
    const index = currentSelected.findIndex((i: any) => i.sequencia === item.sequencia);
      currentSelected.splice(index, 1);
      console.log(currentSelected)

    /**
    
    if (index !== -1) {
      // Remove o item
      currentSelected.splice(index, 1);
      currentSelected.push({ ...item, quantidade: item.quantidade, desconto: item.desconto, total: item.total , sequencia:sequencia});

    }  */
     setOrcamento((prev:any) => ({
      ...prev,
      produtos: currentSelected,
    }));

     
  }

/**
   const toggleSelection = useCallback((item: any) => {
    const currentSelected = [...orcamento.produtos];
    const index = currentSelected.findIndex((i: any) => i.codigo === item.codigo);
    
    if (index !== -1) {
      // Remove o item
      currentSelected.splice(index, 1);
      currentSelected.push({ ...item, quantidade: 1, desconto: 0, total: item.preco });

    } else {
      // Adiciona o item
      currentSelected.push({ ...item, quantidade: 1, desconto: 0, total: item.preco });
    }
    handleSelectionChange(currentSelected);
  }, [orcamento.produtos, handleSelectionChange]);
  
 */

 
  const updateSelectedItem = useCallback((itemCodigo, newValues) => {
        const updatedItems = orcamento.produtos.map(p => {
            if (p.codigo === itemCodigo) {
                const updatedProduct = { ...p, ...newValues };
                updatedProduct.total = (updatedProduct.quantidade * updatedProduct.preco) - (updatedProduct.desconto || 0);
                return updatedProduct;
            }
            return p;
        });
        handleSelectionChange(updatedItems);
  }, [orcamento.produtos, handleSelectionChange]);

 

  const handleIncrement = useCallback((item) => {
    updateSelectedItem(item.codigo, { quantidade: item.quantidade + 1 });
  }, [updateSelectedItem]);

  const handleDecrement = useCallback((item) => {
    if (item.quantidade > 1) {
        updateSelectedItem(item.codigo, { quantidade: item.quantidade - 1 });
    } else {
        // Se a quantidade for 1, a decrementação remove o item
        toggleSelection(item);
    }
  }, [updateSelectedItem, toggleSelection]);
  
  const handleDescontoChange = useCallback((item, value) => {
    let desconto = parseFloat(value) || 0;
    if (desconto > item.preco * item.quantidade) desconto = 0; // Lógica de validação
    updateSelectedItem(item.codigo, { desconto });
  }, [updateSelectedItem]);

  return { handleDecrement,removeItem ,toggleSelection,updateSelectedItem, handleDescontoChange,handleIncrement,handleSelectionChange,selectedProductsMap}
}
