import React, { useEffect, useState } from 'react';
import Note from 'plaid-threads/Note';
import Touchable from 'plaid-threads/Touchable';
import { Institution } from 'plaid/dist/api';

import { ItemType, AccountType } from './types';
import { AccountCard, MoreDetails } from '.';
import {
  useAccounts,
  useInstitutions,
  useItems,
  useTransactions,
} from '../services';
import { setItemToBadState } from '../services/api';
import { diffBetweenCurrentTime } from '../util';

const PLAID_ENV = process.env.REACT_APP_PLAID_ENV || 'sandbox';

interface Props {
  item: ItemType;
  userId: number;
}

const ItemCard = (props: Props) => {
  const [accounts, setAccounts] = useState<AccountType[]>([]);
  const [institution, setInstitution] = useState<Institution>({
    logo: '',
    name: '',
    institution_id: '',
    oauth: false,
    products: [],
    country_codes: [],
  });
  const [showAccounts, setShowAccounts] = useState(false);

  const { accountsByItem } = useAccounts();
  const { deleteAccountsByItemId } = useAccounts();
  const { deleteItemById } = useItems();
  const { deleteTransactionsByItemId } = useTransactions();
  const {
    institutionsById,
    getInstitutionById,
    formatLogoSrc,
  } = useInstitutions();
  const { id, plaid_institution_id, status } = props.item;
  const isSandbox = PLAID_ENV === 'sandbox';
  const isGoodState = status === 'good';

  useEffect(() => {
    console.log(accountsByItem);
    // const itemAccounts: AccountType = accountsByItem[id];
    // setAccounts(itemAccounts || []);
  }, [accountsByItem, id]);

  useEffect(() => {
    setInstitution(institutionsById[plaid_institution_id] || {});
  }, [institutionsById, plaid_institution_id]);

  useEffect(() => {
    getInstitutionById(plaid_institution_id);
  }, [getInstitutionById, plaid_institution_id]);

  const handleSetBadState = () => {
    setItemToBadState(id);
  };
  const handleDeleteItem = () => {
    deleteItemById(id, props.userId);
    deleteAccountsByItemId(id);
    deleteTransactionsByItemId(id);
  };

  const cardClassNames = showAccounts
    ? 'card item-card expanded'
    : 'card item-card';
  return (
    <div className="box">
      <div className={cardClassNames}>
        <Touchable
          className="item-card__clickable"
          onClick={() => setShowAccounts(current => !current)}
        >
          <div className="item-card__column-1">
            <img
              className="item-card__img"
              src={formatLogoSrc(institution.logo)}
              alt={institution && institution.name}
            />
            <p>{institution && institution.name}</p>
          </div>
          <div className="item-card__column-2">
            {isGoodState ? (
              <Note info solid>
                Updated
              </Note>
            ) : (
              <Note error solid>
                Login Required
              </Note>
            )}
          </div>
          <div className="item-card__column-3">
            <h3 className="heading">ITEM_ID</h3>
            <p className="value">{id}</p>
          </div>
          <div className="item-card__column-4">
            <h3 className="heading">LAST_UPDATED</h3>
            <p className="value">
              {diffBetweenCurrentTime(props.item.updated_at)}
            </p>
          </div>
        </Touchable>
        <MoreDetails // The MoreDetails component allows developer to test the ITEM_LOGIN_REQUIRED webhook and Link update mode
          setBadStateShown={isSandbox && isGoodState}
          handleDelete={handleDeleteItem}
          handleSetBadState={handleSetBadState}
          userId={props.userId}
          itemId={id}
        />
      </div>
      {showAccounts && (
        <div>
          {accounts.map(account => (
            <div key={account.id}>
              <AccountCard account={account} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemCard;
