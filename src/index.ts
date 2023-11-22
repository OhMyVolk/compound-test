import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import { getMarketWalletData } from './services/marketWalletData.service';
import { Static, Type } from '@sinclair/typebox';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';


const fy = Fastify({
  logger: true
}).withTypeProvider<TypeBoxTypeProvider>()

const Wallet = Type.Object({
  wallet_address: Type.String(),
  market_name: Type.String(),
  asset_name: Type.String(),
  oracle_name: Type.String(),
})

type WalletType = Static<typeof Wallet>;

fy.post<{ Body: WalletType }>('/add_wallet',
  {
    schema: {
      body: Wallet,
    },
  }, async (request, reply) => {
    const { wallet_address: walletAddress, market_name: marketName, asset_name: assetName, oracle_name: oracleName } = request.body;
    const marketData = await getMarketWalletData(walletAddress, marketName, assetName, oracleName);
    console.log(marketData);
    reply.code(200).send("Ok")
  }
)

fy.get('/ping', (_request, reply) => {
  reply.code(200).send("Pong")
})


fy.listen({ port: 3000, host: '0.0.0.0' }, (err, _address) => {
  if (err) throw err
})
