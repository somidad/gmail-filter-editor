
export default {
  async fetch(request) {
    const response = await fetch(request);
    const newResponse = new Response(response.body, response);
    const url = new URL(request.url);
    const pathname = url.pathname.toLocaleLowerCase();
    switch (pathname) {
      case '/':
        newResponse.headers.set("Access-Control-Allow-Origin", "https://gfilter.app");
        newResponse.headers.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
        newResponse.headers.set("X-Content-Type-Options", "nosniff");
        newResponse.headers.set("Permissions-Policy", "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), fullscreen=(), display-capture=(), midi=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), xr-spatial-tracking=(), autoplay=(), clipboard-read=(), clipboard-write=(), gamepad=()");
        newResponse.headers.set("Content-Security-Policy", "default-src 'self' https://apis.google.com https://accounts.google.com https://content.googleapis.com https://gmail.googleapis.com https://apis.google.com/js/api.js https://accounts.google.com/gsi/client 'sha256-LcsuUMiDkprrt6ZKeiLP4iYNhWo8NqaSbAgtoZxVK3s=' 'sha256-6zH936tTfLQZv+3gVm0q55m633kLnHK2APs06s5l2ek=' 'sha256-fswFAdvwUyb4lNYteM5jMJUjGy4pKKs4WoS92FvayNo=' 'sha256-OBTN3RiyCV4Bq7dFqZ5a2pAXjnCcCYeTJMO2I/LYKeo=' 'sha256-sM1nU9c5h/4M7EwxiArebUhANhEi79ANM8Op81bSs44=' 'sha256-DfVD6xUO7jQK2SwBcglizQ6HzlwmsiOg7m5clVat7c4=' 'sha256-UYMjKtZ2iYi1b6wNFS5HMK3DhT8cUlEMhMR/m0Hp4h0=' 'sha256-0bpvpvwIPHMm6he92HyTGiUEugzr5ZPlQ/6Qu5zjfhU=' 'sha256-W+y2eHzc9i5el1db9QMo9xqkKryyTN7S51duRkzq5Rg=' 'sha256-yp4Mh5yi4iz5Qn3E3Q3GHuzy4vw30jpEfrDu7FC4ieI=';");
        break;
      case '/help':
        newResponse.headers.set("Access-Control-Allow-Origin", "https://gfilter.app");
        newResponse.headers.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
        newResponse.headers.set("X-Content-Type-Options", "nosniff");
        newResponse.headers.set("Permissions-Policy", "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), fullscreen=(), display-capture=(), midi=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), xr-spatial-tracking=(), autoplay=(), clipboard-read=(), clipboard-write=(), gamepad=()");
        newResponse.headers.set("Content-Security-Policy", "default-src 'self' https://apis.google.com/js/api.js https://accounts.google.com/gsi/client 'sha256-LcsuUMiDkprrt6ZKeiLP4iYNhWo8NqaSbAgtoZxVK3s=' 'sha256-6zH936tTfLQZv+3gVm0q55m633kLnHK2APs06s5l2ek=' 'sha256-fswFAdvwUyb4lNYteM5jMJUjGy4pKKs4WoS92FvayNo=' 'sha256-OBTN3RiyCV4Bq7dFqZ5a2pAXjnCcCYeTJMO2I/LYKeo=' 'sha256-5jqEmOirEQOcxzKyUMOIiS70bJ3svpgQYNHBzXXdL4I=' 'sha256-7WnA/1gy6KexuXAlodBVgLu2YcFCvdPiTZxtmoq8k9M=' 'sha256-MF6eWm7Jva9DecrSNazhMNr0lpDkzgIKDpbXHL/Sm3I=' 'sha256-A1i3EWDiBvMgHQ15U1+utWb7id9icqUqPwII1bULTDQ=' 'sha256-rWZyBdV4Y5JMaCwtBNbAMLwqakYKvPxO93vE2w8Z+7I=' 'sha256-iRWBt0z1qBbB9VCDl3SrJXa6TiRqSaC3RWSEgXO1CQE=' 'sha256-UNMfdsrJoVktuI73NTUkgH8ku9KJnxLhmlwg5yIhazk=' 'sha256-TqDt9AbNDUt1wuFXAXbEIiFCFXxqc6lEqfZu3zEDCBA=';");
        break;
      case '/privacy':
        newResponse.headers.set("Access-Control-Allow-Origin", "https://gfilter.app");
        newResponse.headers.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
        newResponse.headers.set("X-Content-Type-Options", "nosniff");
        newResponse.headers.set("Permissions-Policy", "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), fullscreen=(), display-capture=(), midi=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), xr-spatial-tracking=(), autoplay=(), clipboard-read=(), clipboard-write=(), gamepad=()");
        newResponse.headers.set("Content-Security-Policy", "default-src 'self' https://apis.google.com/js/api.js https://accounts.google.com/gsi/client 'sha256-LcsuUMiDkprrt6ZKeiLP4iYNhWo8NqaSbAgtoZxVK3s=' 'sha256-6zH936tTfLQZv+3gVm0q55m633kLnHK2APs06s5l2ek=' 'sha256-fswFAdvwUyb4lNYteM5jMJUjGy4pKKs4WoS92FvayNo=' 'sha256-OBTN3RiyCV4Bq7dFqZ5a2pAXjnCcCYeTJMO2I/LYKeo=' 'sha256-wYuSy3PidcUmpfyEuKnRKzWEDyVJLJSsiXlGjliVg9k=' 'sha256-O6m7g2dghyDr7ApZwq9l21DU3+t5jptvUiTxnezLRNY=' 'sha256-ms64KQeqzzhToLbk2TgVrNT/PYrgD0IA3nVVPxvAjhI=' 'sha256-iRWBt0z1qBbB9VCDl3SrJXa6TiRqSaC3RWSEgXO1CQE=' 'sha256-UNMfdsrJoVktuI73NTUkgH8ku9KJnxLhmlwg5yIhazk=' 'sha256-U/5zM6J3DkH0IkXvH8EuJDpaqYYUi960qsUL9mCFSic=';");
        break;
      default:
        newResponse.headers.set("Access-Control-Allow-Origin", "https://gfilter.app");
        newResponse.headers.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
        newResponse.headers.set("X-Content-Type-Options", "nosniff");
        newResponse.headers.set("Permissions-Policy", "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), fullscreen=(), display-capture=(), midi=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), xr-spatial-tracking=(), autoplay=(), clipboard-read=(), clipboard-write=(), gamepad=()");
        newResponse.headers.set("Content-Security-Policy", "default-src 'self' https://apis.google.com/js/api.js https://accounts.google.com/gsi/client 'sha256-LcsuUMiDkprrt6ZKeiLP4iYNhWo8NqaSbAgtoZxVK3s=' 'sha256-6zH936tTfLQZv+3gVm0q55m633kLnHK2APs06s5l2ek=' 'sha256-fswFAdvwUyb4lNYteM5jMJUjGy4pKKs4WoS92FvayNo=' 'sha256-B3Jk7Rws8l6DgOhoy0oMP4k8gk16joGygBpDXz05ZXo=' 'sha256-Z5XTK23DFuEMs0PwnyZDO9SWxemQ5HxcpVaBNuUJyWY=' 'sha256-62bzXi2UhdWpYgtGCqraCZs6PtBsZ0N+iYsYwCmJyFM=' 'sha256-jKE6QZqne5OsrfemNvuLSNoud++NsCOiSlGuIsQns5o=' 'sha256-tdnkoSkLUgRhOgw6H8vgY/Cqyq1n8ju33p/Pple8Dyg=' 'sha256-OBTN3RiyCV4Bq7dFqZ5a2pAXjnCcCYeTJMO2I/LYKeo=' 'sha256-7jb7O17MTAqUB/tw3SicMEK5Xlwsi/dkH3Lz3y7YKik=' 'sha256-lA+rlP875Tl9kwxeWEnSXDGb+rwB+CDPupfiExMDMtg=' 'sha256-aWjX+VfvPrHl8SIHfHVVdIXXBRbCuLRVLq1ptLwV8YY=' 'sha256-XmvjXJWBZKP2tnw1rn49YfBlClcUTUrG5BkXCUaQXJs=' 'sha256-KHjZtaQ8AtqpYNzfXJrAGmObnagVojOk6Aqx7wYhk+U=' 'sha256-otw1u1w1L59x/fUuk6qHgikxElUvZQzdkDeyZYurzLE=';");
        break;
    }
    return newResponse;
  }
}
