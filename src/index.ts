import Fastify, { FastifyReply } from 'fastify'
import { getMarketWalletData } from './services/marketWalletData.service';


const fy = Fastify({
  logger: true
})

const WalletSchema = {
  type: 'object',
  properties: {
    wallet_address: { type: 'string' },
    market_name: { type: 'string' },
    asset_name: { type: 'string' },
    oracle_name: { type: 'string' },
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function postWallet(request: any, reply: FastifyReply) {
  const { wallet_address: walletAddress, market_name: marketName, asset_name: assetName, oracle_name: oracleName } = request.body;
  const marketData = await getMarketWalletData(walletAddress, marketName, assetName, oracleName);
  console.log(marketData);
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

fy.listen({ port: 3000, host: '0.0.0.0' }, (err, _address) => {
  if (err) throw err
  // Server is now listening on ${address}
})
