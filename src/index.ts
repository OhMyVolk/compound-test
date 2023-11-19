import Fastify, { FastifyReply } from 'fastify'
import { contract } from './contract';
const fy = Fastify({
  logger: true
})

const WalletSchema = {
  type: 'object',
  properties: {
    wallet_address: { type: 'string' }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function postWallet(request: any, reply: FastifyReply) {
  const { wallet_address: walletAddress } = request.body;
  await contract(process.env.ALCHEMY_API_KEY as string, walletAddress);

  reply.code(200).send("Ok")
}

fy.get('/ping', (_request, reply) => {
  reply.code(200).send("Pong")
})

fy.post('/add_wallet',
  {
    schema: {
      body: WalletSchema,
    },
    handler: postWallet,
  }
)

fy.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
  if (err) throw err
  // Server is now listening on ${address}
})
