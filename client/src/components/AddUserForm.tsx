import React, { useState, useEffect } from 'react';
import Button from 'plaid-threads/Button';
import TextInput from 'plaid-threads/TextInput';

import { useUsers, useCurrentUser } from '../services';

interface Props {
  hideForm: () => void;
}
const AddUserForm = (props: Props) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const { addNewUser, getUsers } = useUsers();
  const { setNewUser } = useCurrentUser();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await addNewUser(username, email);
    setNewUser(username);
    props.hideForm();
  };

  useEffect(() => {
    getUsers(true);
  }, [addNewUser, getUsers]);

  return (
    <div className="box addUserForm">
      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="add-user__column-1">
            <h3 className="heading add-user__heading">Add a new user</h3>
            <p className="value add-user__value">
              Enter your name and email address in the input fields.
            </p>
          </div>
          <div className="add-user__column-2">
            <TextInput
              id="full_name"
              name="full_name"
              required
              autoComplete="off"
              className="input_field"
              value={username}
              placeholder="First and last name"
              label="Full Name"
              onChange={e => setUsername(e.target.value)}
            />
            <TextInput
              id="email"
              name="email"
              required
              autoComplete="off"
              className="input_field"
              value={email}
              placeholder="email address"
              label="Email"
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="add-user__column-3">
            <Button className="add-user__button" centered small type="submit">
              Add User
            </Button>
            <Button
              className="add-user__button"
              centered
              small
              secondary
              onClick={props.hideForm}
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
