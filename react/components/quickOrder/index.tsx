import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "react-apollo"
import UPDATE_CART from "../../graphql/updateCart.graphql"
import GET_PRODUCT from "../../graphql/getProductBySku.graphql"
import { useCssHandles } from "vtex.css-handles"
import "./styles.css"

const QuickOrder = () => {
   const [ sku, SetSku ] = useState("")
   const [ search, setSearch ] = useState(false)
   const [ getProductData, { data: product } ] = useLazyQuery(GET_PRODUCT)
   const [ addToCart ] = useMutation(UPDATE_CART)

   const CSS_HANDLES = ["container","title", "contentForm", "label", "inputSKU", "button"]
   const handles =  useCssHandles(CSS_HANDLES)

   useEffect(()=>{
      if(product){
        let skuProduct = parseInt(sku)
        updateCart(skuProduct)
      }    
   },[search])

   const handleChange = (e:any)=> {
      SetSku(e.target.value)
   }

   const handleSubmit = (e: any) => {
     e.preventDefault()
     setSearch(!search)
     if(sku){
     let skuProduct = parseInt(sku)
     addProductToCart(skuProduct)
     SetSku("")
     }
   }

   const addProductToCart = (sku: number) => {
      getProductData({
         variables: {
            sku: sku
         }
      })
   }

   const updateCart = (sku: number) => {
      addToCart({ 
         variables: {
            salesChannel: "1",
            Items: [
               {
                  id: sku,
                  quantity: 1,
                  seller: "1"
               }
            ]
         }
      }).then(()=> {
         window.location.href = "/checkout"
      })
   }

   return <div className={`${handles.container}`}>
      <h2 className={`${handles.title}`}>VTEX COMPRA RAPIDA</h2>
      <form className={`${handles.contentForm}`} onSubmit={handleSubmit}>
          <label className={`${handles.label}`} htmlFor="sku">Ingresa un número SKU</label>
          <input className={`${handles.inputSKU}`} id="sku" type="text" value={sku} onChange={handleChange}/>
          <input className={`${handles.button}`} type="submit" value="AÑADIR AL CARRITO" />
      </form>
   </div>
}

export default QuickOrder
