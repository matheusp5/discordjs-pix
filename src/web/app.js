import express from "express"
import axios from "axios"
import bodyParser from 'body-parser';
import source from "../database/source.js";
import { sendMessage } from "../index.js"
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/notify", async (req, res) => {
    let payment_id = req.body.id
    console.log(payment_id)

    const config = {
        headers: {
            "Authorization": `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
        }
    };
    const url = `https://api.mercadopago.com/v1/payments/${payment_id}`;

    axios.get(url, config).then(async (result) => {
        let external_reference = result.data.external_reference
        let payment_status = result.data.status

        source.models[0].update({ status: payment_status }, { where: { external_reference: external_reference }}).then(async () => {
            const payment = await source.models[0].findOne({ where: { external_reference: external_reference } })
            sendMessage(payment.member_id, "O pagamento do seu pedido foi aprovado com sucesso: " + payment.mp_id)
            res.send({
                status: 200,
                content: "Payment updated with success."
            })
        })
    })
})

const port = proces.env.WEB_PORT

app.listen(port, () => {
    console.log(`Servidor aberto e operando na porta ${port}...`)
})