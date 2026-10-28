// WhatsApp de la tienda: solo dígitos, con el código de país (Guatemala: 502).
export const WHATSAPP_NUMBER = '50258712992'

// Sin emojis: en algunas apps de WhatsApp el emoji del texto prellenado llega como un triángulo.
export const WHATSAPP_DEFAULT_MESSAGE = 'Hola Coco Emilia, quiero más información.'

/** Enlace que abre el chat de WhatsApp con el mensaje ya escrito. */
export const whatsappUrl = (message: string = WHATSAPP_DEFAULT_MESSAGE) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
