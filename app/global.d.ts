interface Window {
  google?: {
    accounts: {
      id: {
        initialize: (config: {
          client_id: string;
          callback: (response: CredentialResponse) => void;
          auto_select?: boolean;
        }) => void;
        prompt: () => void;
      };
    };
  };
}

interface CredentialResponse {
  credential: string;
}
