import { Network } from '@ethersproject/networks';
import { Contract, ContractInterface, Event, ethers } from 'ethers';
import config from '../config';
import { valueNullOrUndefined } from './utils';

export const mumbai: Network = {
  name: 'mumbai',
  chainId: 80001,
  _defaultProvider: (providers) => new providers.JsonRpcProvider('https://rpc-mumbai.matic.today'),
};

let _provider: ethers.providers.BaseProvider;
export function getProvider() {
  if (valueNullOrUndefined(_provider)) {
    _provider = ethers.getDefaultProvider(config.network);
  }
  return _provider;
}

export async function getLatestBlock(): Promise<number> {
  const provider = this.getProvider();
  return await provider.getBlockNumber();
}

export function getContractInstance(address: string, contractInterface: ContractInterface): Contract {
  const provider = this.getProvider();
  return provider.getContract(address, contractInterface);
}

export async function getContractAllEvents(contract: Contract, fromBlock: number, toBlock: number): Promise<Event[]> {
  //TODO: Query multiple event then
  const eventFilter = contract.filters.Transfer();
  return await contract.queryFilter(eventFilter, fromBlock, toBlock);
}
