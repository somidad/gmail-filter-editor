declare namespace google {
    namespace accounts {
        namespace oauth2 {
            interface TokenClient {
                // Add any methods you need here
                requestAccessToken: () => Promise<void>;
            }
        }
    }
}
