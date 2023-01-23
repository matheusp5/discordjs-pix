import mercadopago from 'mercadopago';
import imgbb from "imgbb-uploader"
import source from '../database/source.js';
import { EmbedBuilder } from 'discord.js';
import { sendMessage } from "../index.js"

const ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN
const API_KEY = process.env.IMGBB_APIKEY

mercadopago.configurations.setAccessToken(ACCESS_TOKEN);

var payment_data = {
  transaction_amount: 5,
  description: "produto",
  payment_method_id: 'pix',
  external_reference: "external_reference_aqui",
  notification_url: "http://mxtheuz.com.br/notify", // notification url
  payer: {
    email: 'mategame2402@gmail.com',
    first_name: 'Matheus',
    last_name: 'Piccoli',
    identification: {
      type: 'CPF',
      number: '75800950920'
    },
    address: {
      zip_code: '06233200',
      street_name: 'Av. das Nações Unidas',
      street_number: '3003',
      neighborhood: 'Bonfim',
      city: 'Osasco',
      federal_unit: 'SP'
    }
  }
};

export default function create_payment(Interaction) {

  let externalref = "PIX-" + Math.floor(Math.random() * (943267542 - 143267542) + 143267542).toString();
  payment_data.external_reference = externalref

  mercadopago.payment.create(payment_data).then(function (data) {
    let id = data.body.id

    mercadopago.payment.get(id.toString()).then(function (inf) {
      let base64 = inf.body.point_of_interaction.transaction_data.qr_code_base64

      const options = {
        apiKey: API_KEY,
        name: "pix-" + id,
        base64string: base64
      };

      imgbb(options).then(result => {
        let embed = new EmbedBuilder()
          .setTitle("Pagamento pix (QR Code)")
          .setImage(result.url)
          .setColor(0xff0000);

          let member_id = Interaction.member.id
          sendMessage(member_id, "Seu pedido foi registrado com sucesso: " + inf.body.id)

        source.models[0].create({
          id: externalref,
          member_id: member_id,
          external_reference: externalref,
          mp_id: id
        })

        Interaction.reply({ embeds: [embed] })

      }).catch(error => {
        console.log(error)
      })

    }).catch(function (error) {
      console.log(error)
    });
  }).catch(function (error) {
    console.log(error)
  });

}

