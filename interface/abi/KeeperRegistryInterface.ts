/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export interface KeeperRegistryInterfaceInterface
  extends ethers.utils.Interface {
  functions: {
    "getKeeperInfo(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "getKeeperInfo",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "getKeeperInfo",
    data: BytesLike
  ): Result;

  events: {};
}

export interface KeeperRegistryInterface extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: KeeperRegistryInterfaceInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    getKeeperInfo(
      query: string,
      overrides?: CallOverrides
    ): Promise<
      [string, boolean, BigNumber] & {
        payee: string;
        active: boolean;
        balance: BigNumber;
      }
    >;
  };

  getKeeperInfo(
    query: string,
    overrides?: CallOverrides
  ): Promise<
    [string, boolean, BigNumber] & {
      payee: string;
      active: boolean;
      balance: BigNumber;
    }
  >;

  callStatic: {
    getKeeperInfo(
      query: string,
      overrides?: CallOverrides
    ): Promise<
      [string, boolean, BigNumber] & {
        payee: string;
        active: boolean;
        balance: BigNumber;
      }
    >;
  };

  filters: {};

  estimateGas: {
    getKeeperInfo(query: string, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    getKeeperInfo(
      query: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
