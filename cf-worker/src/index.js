export default {
  async fetch(request) {
    // 원본 요청을 그대로 GitHub Pages로 전달합니다.
    const response = await fetch(request);

    // 응답을 복제하여 헤더를 수정할 수 있도록 합니다.
    const newResponse = new Response(response.body, response);

    const cspHeader = `
    default-src 'self';
    connect-src 'self' https://gmail.googleapis.com;
    form-action 'self';
    frame-ancestors 'none';
    frame-src 'self' https://content.googleapis.com https://content-gmail.googleapis.com;
    style-src 'self' 'sha256-yDtTmGTx+HyLsvh62eKxZZjZqGR9D04ym9gQvd8Pi+o=' 'sha256-B3Jk7Rws8l6DgOhoy0oMP4k8gk16joGygBpDXz05ZXo=' 'sha256-Z5XTK23DFuEMs0PwnyZDO9SWxemQ5HxcpVaBNuUJyWY=' 'sha256-62bzXi2UhdWpYgtGCqraCZs6PtBsZ0N+iYsYwCmJyFM=' 'sha256-jKE6QZqne5OsrfemNvuLSNoud++NsCOiSlGuIsQns5o=' 'sha256-tdnkoSkLUgRhOgw6H8vgY/Cqyq1n8ju33p/Pple8Dyg=' 'sha256-B3Jk7Rws8l6DgOhoy0oMP4k8gk16joGygBpDXz05ZXo=' 'sha256-62bzXi2UhdWpYgtGCqraCZs6PtBsZ0N+iYsYwCmJyFM=' 'sha256-jKE6QZqne5OsrfemNvuLSNoud++NsCOiSlGuIsQns5o=' 'sha256-tdnkoSkLUgRhOgw6H8vgY/Cqyq1n8ju33p/Pple8Dyg=';
    script-src 'self' https://apis.google.com https://accounts.google.com ${inlineScriptSrc(request.url)};
    `
    newResponse.headers.set('Content-Security-Policy', cspHeader.replace(/\s{2,}/g, " ").trim());
    newResponse.headers.set('Access-Control-Allow-Origin', 'https://gfilter.app');
    //newResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
    //newResponse.headers.set('Pragma', 'no-cache');
    //newResponse.headers.set('Expires', '0');
    newResponse.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    newResponse.headers.set('Permissions-Policy', 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), fullscreen=(), display-capture=(), midi=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), xr-spatial-tracking=(), autoplay=(), clipboard-read=(), clipboard-write=(), gamepad=()');
    newResponse.headers.set('X-Content-Type-Options', 'nosniff');

    return newResponse;
  }
}

function inlineScriptSrc(urlString) {
  const url = new URL(urlString);
  const pathname = url.pathname.toLocaleLowerCase();
  switch (pathname) {
    case '/':
    case '/index':
    case '/index.html':
      return "'sha256-LcsuUMiDkprrt6ZKeiLP4iYNhWo8NqaSbAgtoZxVK3s=' 'sha256-6zH936tTfLQZv+3gVm0q55m633kLnHK2APs06s5l2ek=' 'sha256-fswFAdvwUyb4lNYteM5jMJUjGy4pKKs4WoS92FvayNo=' 'sha256-OBTN3RiyCV4Bq7dFqZ5a2pAXjnCcCYeTJMO2I/LYKeo=' 'sha256-YmsJRhOHJDOKpakPsGM1syyXD07sgXclgq5RPJLImxU=' 'sha256-iac/CynLxjVGWnMjVe1l25DYXxjNUiwVEKCfOV8mFoo=' 'sha256-UYMjKtZ2iYi1b6wNFS5HMK3DhT8cUlEMhMR/m0Hp4h0=' 'sha256-0bpvpvwIPHMm6he92HyTGiUEugzr5ZPlQ/6Qu5zjfhU=' 'sha256-W+y2eHzc9i5el1db9QMo9xqkKryyTN7S51duRkzq5Rg=' 'sha256-yp4Mh5yi4iz5Qn3E3Q3GHuzy4vw30jpEfrDu7FC4ieI=' 'sha256-l7ktxvFZc9t9ZMdUPihEf5O2EQRNhfj/6YYFTXHG8sI=' 'sha256-lpxGY5vXNSXYm9GIDNwdDjWo+WVeHcQHiUNfqK05qmo=' 'sha256-P2c+pLzWDLItI/0ZkGnQU3af+CAHysSZbXkuT15UZ8s=' 'sha256-RyOx4hlYo01ewnmTOV8+Se7cVy64FcJftDmYvhEuXQQ='";
    case '/help':
    case '/help.html':
      return "'sha256-LcsuUMiDkprrt6ZKeiLP4iYNhWo8NqaSbAgtoZxVK3s=' 'sha256-6zH936tTfLQZv+3gVm0q55m633kLnHK2APs06s5l2ek=' 'sha256-fswFAdvwUyb4lNYteM5jMJUjGy4pKKs4WoS92FvayNo=' 'sha256-OBTN3RiyCV4Bq7dFqZ5a2pAXjnCcCYeTJMO2I/LYKeo=' 'sha256-Czhhz4l13BGN38ymWi/ESJASQAQo6BBh4Pn274iHhMc=' 'sha256-cUIIvGYoPZPMwoldp4CH5eQ+WwETy4qR8OwzJC0L4kY=' 'sha256-U30Lbgog72SCg/02bizOE/b/ch9nYqP2u6yQvw0zUtc=' 'sha256-A1i3EWDiBvMgHQ15U1+utWb7id9icqUqPwII1bULTDQ=' 'sha256-rWZyBdV4Y5JMaCwtBNbAMLwqakYKvPxO93vE2w8Z+7I=' 'sha256-iRWBt0z1qBbB9VCDl3SrJXa6TiRqSaC3RWSEgXO1CQE=' 'sha256-UNMfdsrJoVktuI73NTUkgH8ku9KJnxLhmlwg5yIhazk=' 'sha256-TqDt9AbNDUt1wuFXAXbEIiFCFXxqc6lEqfZu3zEDCBA=' 'sha256-HAarZDzGDNA3D87gnFiS3StNH9rDrPGcddRqcqIM64w=' 'sha256-ZYRuFV8UzYp4ZwzvmsYs0y1ahl/7PGK8wMH4pvo1qPw=' 'sha256-vBiqlC1f3V40jU/d/7XLzU44jEo2kugeubNcXbowMbM=' 'sha256-HWkVZ8NWxBUlnB6DxJb5KfYIkcfNM6sTa3xyDQGsnWM='";
    case '/privacy':
    case '/privacy.html':
      return "'sha256-LcsuUMiDkprrt6ZKeiLP4iYNhWo8NqaSbAgtoZxVK3s=' 'sha256-6zH936tTfLQZv+3gVm0q55m633kLnHK2APs06s5l2ek=' 'sha256-fswFAdvwUyb4lNYteM5jMJUjGy4pKKs4WoS92FvayNo=' 'sha256-OBTN3RiyCV4Bq7dFqZ5a2pAXjnCcCYeTJMO2I/LYKeo=' 'sha256-qkooGc42XWKQQhVwHZPOZlChWj3YlWRBC6mod9eCkcQ=' 'sha256-5bqFQcw6OfjfMl/1jwhH8ikZ1EgJrzbZwHbh3wMjgHs=' 'sha256-ms64KQeqzzhToLbk2TgVrNT/PYrgD0IA3nVVPxvAjhI=' 'sha256-iRWBt0z1qBbB9VCDl3SrJXa6TiRqSaC3RWSEgXO1CQE=' 'sha256-UNMfdsrJoVktuI73NTUkgH8ku9KJnxLhmlwg5yIhazk=' 'sha256-U/5zM6J3DkH0IkXvH8EuJDpaqYYUi960qsUL9mCFSic=' 'sha256-U04C5LH1GekP2e0iEIhZm68lxpivzM5Br1K5BfpoXMM=' 'sha256-4d42e+OoTEyrz4iD+eFEg47CebwzXoKqL0vzfoiwHX0=' 'sha256-u7x70swepFP3L4qJh9RAe+xcUHzUZcUFZ/HhU01vwJ8='";
    default:
      return "'sha256-LcsuUMiDkprrt6ZKeiLP4iYNhWo8NqaSbAgtoZxVK3s=' 'sha256-6zH936tTfLQZv+3gVm0q55m633kLnHK2APs06s5l2ek=' 'sha256-fswFAdvwUyb4lNYteM5jMJUjGy4pKKs4WoS92FvayNo=' 'sha256-Z5XTK23DFuEMs0PwnyZDO9SWxemQ5HxcpVaBNuUJyWY=' 'sha256-OBTN3RiyCV4Bq7dFqZ5a2pAXjnCcCYeTJMO2I/LYKeo=' 'sha256-4KG0l3b+8ESjLUuXF12iAeDWdffkg9o8rqP1e1qE5EU=' 'sha256-FS0j6GmgQgoABFCtvI48LbDplEEfRP1X7B59Prq7vJ4=' 'sha256-aWjX+VfvPrHl8SIHfHVVdIXXBRbCuLRVLq1ptLwV8YY=' 'sha256-XmvjXJWBZKP2tnw1rn49YfBlClcUTUrG5BkXCUaQXJs=' 'sha256-KHjZtaQ8AtqpYNzfXJrAGmObnagVojOk6Aqx7wYhk+U=' 'sha256-otw1u1w1L59x/fUuk6qHgikxElUvZQzdkDeyZYurzLE=' 'sha256-p1parabONiwME0QE7fy+aLIOidfdLydSVroQRZ/oRNU=' 'sha256-ij3r7vef5Cd5eP1FxDSrVvE0GBADtJNSq2cEblCV5uM=' 'sha256-SIGt3JB9N4/aVdX+G+B/DNT5L/brxAzeAcwLn5Dq7wM='";
  }
}

