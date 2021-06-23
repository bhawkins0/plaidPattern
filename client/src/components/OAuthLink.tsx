import React from 'react';

import { LinkButton } from '.';

// Component rendered when user is redirected back to site from Oauth institution site.
// It initiates link immediately with the original link token that was set in local storage
// from the initial link initialization.
const OAuthLink = () => {
  let { userId, itemId, token } = JSON.parse(
    // ignore typescript when itemId=null
    // @ts-ignore
    localStorage.getItem('oauthConfig')
  );

  return (
    <>
      {token != null && (
        <LinkButton
          isOauth // this will initiate link immediately
          userId={userId}
          itemId={itemId}
          token={token}
        />
      )}
    </>
  );
};

export default OAuthLink;
