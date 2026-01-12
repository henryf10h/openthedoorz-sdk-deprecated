import { useCallback } from 'react';
import { useCallAnyContract } from '@chipi-stack/nextjs';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import { useFetchWallet } from './useFetchWallet';
import { deriveEncryptKey } from '@/lib/utils/deriveEncryptKey';

// Helpers copied/kept consistent with existing code
function toBaseUnits(human: string, decimals: number): bigint {
  const [integer, fraction = ''] = human.split('.');
  const frac = (fraction + '0'.repeat(decimals)).slice(0, decimals);
  const combined = `${integer}${frac}`.replace(/^0+/, '') || '0';
  return BigInt(combined);
}

function toUint256Parts(amount: bigint) {
  const mask = (1n << 128n) - 1n;
  const low = amount & mask;
  const high = amount >> 128n;
  return { low: `0x${low.toString(16)}`, high: `0x${high.toString(16)}` };
}

export const useVesuPool = () => {
  const { callAnyContractAsync, isLoading } = useCallAnyContract();
  const { getToken, user } = useFirebaseAuth();
  const { wallet } = useFetchWallet();

  const deposit = useCallback(async (opts: { amount: string; receiver?: string; poolAddress?: string; tokenAddress?: string }) => {
    if (!user) throw new Error('User not authenticated');
    if (!wallet) throw new Error('Wallet not found');

    const { amount, receiver, poolAddress, tokenAddress } = opts;

    // derive encryptKey
    const encryptKey = await deriveEncryptKey(user.uid);

    const bearerToken = await getToken();
    if (!bearerToken) throw new Error('Authentication token required');

    // Defaults (can be overridden via opts)
    // vToken (vault) contract to interact with (default is the address you provided)
    // vToken (vault) contract to interact with
    const VTOKEN = poolAddress ?? process.env.NEXT_PUBLIC_VESU_VTOKEN ?? process.env.NEXT_PUBLIC_STARKNET_SEPOLIA_STRK_VTOKEN ?? process.env.NEXT_PUBLIC_STARKNET_MAINNET_STRK_VTOKEN;
    if (!VTOKEN) throw new Error('VTOKEN (vToken contract) not configured. Set NEXT_PUBLIC_VESU_VTOKEN or NEXT_PUBLIC_STARKNET_*_STRK_VTOKEN or pass poolAddress to useVesuPool.');
    const STRK = tokenAddress ?? process.env.NEXT_PUBLIC_STRK_TOKEN ?? process.env.NEXT_PUBLIC_STARKNET_SEPOLIA_STRK ?? process.env.NEXT_PUBLIC_STARKNET_MAINNET_STRK;
    if (!STRK) throw new Error('STRK token address not configured. Set NEXT_PUBLIC_STRK_TOKEN or NEXT_PUBLIC_STARKNET_*_STRK or pass tokenAddress to useVesuPool.');
    const amountBase = toBaseUnits(amount, 18);
    const u = toUint256Parts(amountBase);

    // Calls: approve token for pool, then call pool.deposit(amount, high, receiver)
    const calls = [
      {
        // approve STRK token to the vToken (vault)
        contractAddress: STRK,
        entrypoint: 'approve',
        calldata: [VTOKEN, u.low, u.high],
      },
      {
        // call deposit on the vToken
        contractAddress: VTOKEN,
        entrypoint: 'deposit',
        calldata: [u.low, u.high, receiver || wallet.publicKey],
      },
    ];

    // Debug: surface the constructed payload to help diagnose paymaster/backend errors
    // (safe to remove once issue is resolved)
    // eslint-disable-next-line no-console
    console.debug('[useVesuPool.deposit] calls, wallet.publicKey:', calls, wallet.publicKey);
    const result = await callAnyContractAsync({
      params: {
        // top-level contractAddress is required by CallAnyContractParams
        contractAddress: STRK,
        encryptKey,
        wallet: {
          publicKey: wallet.publicKey,
          encryptedPrivateKey: (wallet as any).encryptedPrivateKey,
        },
        calls,
      },
      bearerToken,
    });

    // Try to extract tx hash
    if (typeof result === 'string') return result;
    if (result && typeof result === 'object') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const r: any = result;
      return r.transaction_hash || r.transactionHash || r.hash || r.txHash || null;
    }
    return null;
  }, [callAnyContractAsync, getToken, user, wallet]);

  const withdraw = useCallback(async (opts: { amount: string; recipient?: string; poolAddress?: string }) => {
    if (!user) throw new Error('User not authenticated');
    if (!wallet) throw new Error('Wallet not found');

    const { amount, recipient, poolAddress } = opts;

    const encryptKey = await deriveEncryptKey(user.uid);
    const bearerToken = await getToken();
    if (!bearerToken) throw new Error('Authentication token required');

    const VTOKEN = poolAddress ?? process.env.NEXT_PUBLIC_VESU_VTOKEN ?? process.env.NEXT_PUBLIC_STARKNET_SEPOLIA_STRK_VTOKEN ?? process.env.NEXT_PUBLIC_STARKNET_MAINNET_STRK_VTOKEN;
    if (!VTOKEN) throw new Error('VTOKEN (vToken contract) not configured. Set NEXT_PUBLIC_VESU_VTOKEN or NEXT_PUBLIC_STARKNET_*_STRK_VTOKEN or pass poolAddress to useVesuPool.');

    // STRK is 18 decimals
    const amountBase = toBaseUnits(amount, 18);
    const u = toUint256Parts(amountBase);

    const calls = [
      {
        contractAddress: VTOKEN,
        entrypoint: 'withdraw',
        // order: amount_low, amount_high, recipient, padding
        calldata: [u.low, u.high, recipient || wallet.publicKey, recipient || wallet.publicKey],
      },
    ];

    // Debug: surface the constructed payload to help diagnose paymaster/backend errors
    // (safe to remove once issue is resolved)
    // eslint-disable-next-line no-console
    console.debug('[useVesuPool.withdraw] calls, wallet.publicKey:', calls, wallet.publicKey);
    let result: any;
    try {
      result = await callAnyContractAsync({
        params: {
          // top-level contractAddress is required by CallAnyContractParams
          contractAddress: VTOKEN,
          encryptKey,
          wallet: {
            publicKey: wallet.publicKey,
            encryptedPrivateKey: (wallet as any).encryptedPrivateKey,
          },
          calls,
        },
        bearerToken,
      });
    } catch (err) {
      // Log the caught error for debugging (includes stack and message)
      // eslint-disable-next-line no-console
      console.error('[useVesuPool.withdraw] callAnyContractAsync threw:', err);
      throw err;
    }

    if (typeof result === 'string') return result;
    if (result && typeof result === 'object') {
      // Log full result for debugging contract errors
      // eslint-disable-next-line no-console
      console.error('[useVesuPool.withdraw] contract result:', result);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const r: any = result;
      return r.transaction_hash || r.transactionHash || r.hash || r.txHash || null;
    }
    return null;
  }, [callAnyContractAsync, getToken, user, wallet]);

  return {
    deposit,
    withdraw,
    isLoading,
  };
};

export default useVesuPool;
