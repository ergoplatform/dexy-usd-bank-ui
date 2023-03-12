import { useDevice } from '@ergolabs/ui-kit';
import React, { useEffect } from 'react';
import { of } from 'rxjs';

import { getErgopayAddresses } from '../../../../../api/ergopay/getErgopayAddresses';
import { getErgopayRequestId } from '../../../../../api/ergopay/getErgopayRequestId';
import {
  ErgopayWallet,
  setErgopayAddress,
} from '../../../../../api/wallet/ergopay/ergopay';
import { connectWallet } from '../../../../../api/wallet/wallet';
import { useObservable } from '../../../../hooks/useObservable';
// import { patchSettings } from '../../../settings/settings';
import {
  createErgoPayDeepLink,
  createSelectAddressesRequestLink,
} from '../../../../utils/ergopayLinks';
import { ErgoPayTabPaneContentDesktop } from './ErgoPayTabPaneContentDesktop';
import { ErgoPayTabPaneContentMobile } from './ErgoPayTabPaneContentMobile';

interface Props {
  close: (result?: boolean | undefined) => void;
}

export const ErgoPayTabPaneContent = ({ close }: Props) => {
  const { s } = useDevice();

  const [requestId, loadingRequestId] = useObservable(getErgopayRequestId, []);
  const [addresses, loadingAddresses = true] = useObservable(
    requestId ? getErgopayAddresses(requestId) : of(null),
    [requestId],
  );

  useEffect(() => {
    if (loadingAddresses === false && addresses?.[0]) {
      setErgopayAddress(addresses[0]);
      connectWallet(ErgopayWallet).subscribe();
      close();
    }
  }, [loadingAddresses]);

  const handleClick = () => {
    if (requestId) {
      window.location.replace(
        createErgoPayDeepLink(createSelectAddressesRequestLink(requestId)),
      );
    }
  };

  return s ? (
    <ErgoPayTabPaneContentMobile
      handleClick={handleClick}
      loadingRequestId={loadingRequestId}
    />
  ) : (
    <ErgoPayTabPaneContentDesktop
      handleClick={handleClick}
      loadingRequestId={loadingRequestId}
      requestId={requestId}
    />
  );
};
