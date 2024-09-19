import {ADMIN_URLS, urlJoin} from "../../common-src/StringUtils";
import FeedDb, {getFetchItemsParams} from "../../edge-src/models/FeedDb";
import OnboardingChecker from "../../common-src/OnboardingUtils";
import {STATUSES} from "../../common-src/Constants";

async function fetchFeed({request, next, env, data}) {
  const urlObj = new URL(request.url);

  // Function to hash the secret key
  async function hashSecret(secret) {
    const crypto = globalThis.crypto
    const encoder = new TextEncoder();
    const data = encoder.encode(secret);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hash;
  }

  // Access the secret key from environment variables
  const secretKey = `${env.SECRET_KEY}`;
  const hashedSecretKey = hashSecret(secretKey);

  // Check if the user is authenticated
  const cookieHeader = request.headers.get('Cookie') || '';
  const isAuthenticated = cookieHeader.includes(`authenticated=${hashedSecretKey}`);



  if (!isAuthenticated) {
    const urlObj = new URL(request.url);
    return Response.redirect(`${urlObj.origin}/auth/login?redirectTo=${encodeURIComponent(urlObj)}`, 302);
  }

  if (urlObj.pathname.startsWith(urlJoin(ADMIN_URLS.home(), '/ajax/'))) {
    return next();
  }

  let fetchItems = null;
  if (urlObj.pathname.startsWith(urlJoin(ADMIN_URLS.home(), '/feed/json')) ||
      urlObj.pathname.startsWith(urlJoin(ADMIN_URLS.home(), '/items/list'))) {
    fetchItems = getFetchItemsParams(request, {
      'status__!=': STATUSES.DELETED,
    });
  } else if (urlObj.pathname.startsWith(urlJoin(ADMIN_URLS.home(), '/items/'))) {
    // Either /items/ or /items/{id}
    if (!urlObj.pathname.startsWith(urlJoin(ADMIN_URLS.home(), '/items/new'))) {
      return next();
    }
  } else if (urlObj.pathname.startsWith(urlJoin(ADMIN_URLS.home(), '/settings/code-editor'))) {
    fetchItems = getFetchItemsParams(request, {
      'status__!=': STATUSES.DELETED,
    }, 1);
  }

  const feedDb = new FeedDb(env, request);
  const contentFromDb = await feedDb.getContent(fetchItems)

  const onboardingChecker = new OnboardingChecker(contentFromDb, request, env);
  const onboardingResult = onboardingChecker.getResult();

  data.feedDb = feedDb;
  data.feedContent = contentFromDb;
  data.onboardingResult = onboardingResult;

  return next();
}

export const onRequest = [fetchFeed];
