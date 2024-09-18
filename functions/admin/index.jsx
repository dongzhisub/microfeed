import React from "react";
import {renderReactToHtml} from "../../edge-src/common/PageUtils";
import EdgeAdminHomeApp from "../../edge-src/EdgeAdminHomeApp";

export async function onRequestGet({ data }) {
  const {feedContent, onboardingResult} = data;

  // Check for authentication cookie
  const cookieHeader = request.headers.get('Cookie') || '';
  const isAuthenticated = cookieHeader.includes('authenticated=true');

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return Response.redirect('/auth/login', 302);
  }

  const fromReact = renderReactToHtml(<EdgeAdminHomeApp
    feedContent={feedContent}
    onboardingResult={onboardingResult}
  />);

  return new Response(fromReact, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
