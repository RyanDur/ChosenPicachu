import {useContext} from 'react';
import {Address} from '../profile';
import {draftActions} from './draftActions';
import {draftContexts} from './draftContexts';
import {AddressName, drafts} from './drafts';

type AddressDraft = {
  readonly address: Address;
  readonly edit: (address: Address) => void;
};

export const useAddressDraft = (name: AddressName): AddressDraft => {
  const {draft, dispatch} = useContext(draftContexts.State);
  return {
    address: drafts.addressFor(draft, name),
    edit: address => dispatch(draftActions.addressEdited(name, address))
  };
};
