const express = require("express")
const uuid = require('uuid')

const port = 3001;
const app = express()
app.use(express.json())

const orders = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex( order => order.id === id)

    if(index < 0){
        return response.status(404).json({ error: "User not found"})
    }

    request.userIndex =  index
    request.userId = id

    next()
}

app.post('/orders', (request, response) => {
    const { order, name, price } = request.body

    const orderId = { id: uuid.v4(), order, name, price, status: "in preparation" }

    orders.push(orderId)

    return response.status(201).json(orderId)
})


app.get('/orders', (request, response) =>{
    return response.json(orders)
})

app.put('/orders/:id', checkOrderId, (request, response) => {
    const { order, name, price} = request.body
    const index = request.userIndex
    const id = request.userId

    const updatedOrder = { id, order, name, price }
    
    orders[index] = updatedOrder

    return response.json(updatedOrder) 
})

app.delete('/orders/:id', checkOrderId, (request, response) => {
    const index = request.userIndex

    orders.splice(index, 1)

    return response.status(204).json({ massage: "Order deleted"})
})

app.get('/orders/:id', checkOrderId, (request, response) => {
    const index = request.userIndex
    const order = orders[index]

    return response.json(order)
})

app.patch('/orders/:id', checkOrderId, (request, response) => {
    const index = request.userIndex

    orders[index].status = "order ready"

    return response.json(orders[index])
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})