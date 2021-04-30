import React, { useState } from 'react';
import Button from 'plaid-threads/Button';
import TextInput from 'plaid-threads/TextInput';

import { useUsers } from '../services';

const AddUserForm = ({ hideForm }) => {
  const [username, setUsername] = useState('');

  const { addNewUser } = useUsers();

  function handleSubmit(e) {
    e.preventDefault();
    addNewUser(username);
    hideForm();
  }

  return (
    <div className="box">
      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="add-user__column-1">
            <h3 className="heading add-user__heading">Add a new user</h3>
            <p className="value add-user__value">
              Enter a name in the input field for your new user.
            </p>
          </div>
          <div className="add-user__column-2">
            <label className="heading user-add__label" htmlFor="username">
              User_Name
            </label>
            <TextInput
              id="username"
              className="user-add__input"
              type="text"
              name="username"
              required="required"
              autoComplete="off"
              value={username}
              placeholder="New user name"
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="add-user__column-3">
            <Button
              className="button button--is-primary add-user__button"
              type="submit"
              centered
            >
              Add User
            </Button>
            <Button
              className="button add-user__button"
              type="cancel"
              onClick={hideForm}
              centered
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddUserForm;
