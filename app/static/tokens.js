import { default as arbitrum } from './address-book/arbitrum/tokens/tokens';
import { default as aurora } from './address-book/aurora/tokens/tokens';
import { default as avax } from './address-book/avax/tokens/tokens';
import { default as bsc } from './address-book/bsc/tokens/tokens';
import { default as celo } from './address-book/celo/tokens/tokens';
import { default as cronos } from './address-book/cronos/tokens/tokens';
import { default as emerald } from './address-book/emerald/tokens/tokens';
import { default as fantom } from './address-book/fantom/tokens/tokens';
import { default as fuse } from './address-book/fuse/tokens/tokens';
import { default as heco } from './address-book/heco/tokens/tokens';
import { default as metis } from './address-book/metis/tokens/tokens';
import { default as moonbeam } from './address-book/moonbeam/tokens/tokens';
import { default as moonriver } from './address-book/moonriver/tokens/tokens';
import { default as one } from './address-book/one/tokens/tokens';
import { default as optimism } from './address-book/optimism/tokens/tokens';
import { default as polygon } from './address-book/polygon/tokens/tokens';

var tokens = {};
const data = [
  arbitrum,
  aurora,
  avax,
  bsc,
  celo,
  cronos,
  emerald,
  fantom,
  fuse,
  heco,
  metis,
  metis,
  moonbeam,
  moonriver,
  one,
  optimism,
  polygon,
];
for (let blockchain of data) {
  for (let token in blockchain) {
    tokens[blockchain[token].address] = {
      address: blockchain[token].address,
      symbol: blockchain[token].symbol,
      decimals: blockchain[token].decimals,
      chainId: blockchain[token].chainId,
    };
  }
}

export default tokens;
