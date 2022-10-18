import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Context = createContext()

export const StateContext = ({ children }) => {
    const [showCart, setshowCart] = useState(false)
    const [cartItems, setCartItems] = useState([])
    const [totalPrice, setTotalPrice] = useState()
    const [totalQuantities, setTotalQuantities] = useState()
    const [qty, setQty] = useState(1)

    const onAdd = (product, quantity) => {
        const checkProductInCart = cartItems.find(item => item._id === product._id)

        setTotalPrice(prevTotalPrice => prevTotalPrice + product.price * quantity)
        setTotalQuantities(prevTotalQuantities => prevTotalQuantities + quantity)
        // if item already in cart, add new price to previous total price and increase quantity
        if (checkProductInCart) {
            // update items in cart
            const updatedCartItems = cartItems.map(cartItem => {
                if (cartItem._id === product._id) return {
                    ...cartItem,
                    quantity: cartItem.quantity + quantity
                }
            })

            setCartItems(updatedCartItems)
        } else {
            product.quantity = quantity
            setCartItems([...cartItems, { ...product }])
        }
        // success pop up, item added to cart
        toast.success(`${qty} ${product.name} added to the cart.`)
    }

    // update number of items in cart
    const incQty = () => {
        setQty(prevQty => prevQty + 1)
    }
    const decQty = () => {
        setQty(prevQty => {
            if (prevQty - 1 < 1) return 1
            return prevQty - 1
        })
    }

    return (
        <Context.Provider
            value={{
                showCart,
                cartItems,
                totalPrice,
                totalQuantities,
                qty,
                incQty,
                decQty,
                onAdd
            }}
        >
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context)